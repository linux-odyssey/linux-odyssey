package main

import (
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

type CommandHandler func(cmd string) (CommandParams, error)

type CommandParams struct {
	Discover []FileObject `json:"discover,omitempty"`
	Add      []FileObject `json:"add,omitempty"`
	Remove   []FileObject `json:"remove,omitempty"`
	Pwd      string       `json:"pwd,omitempty"`
}

type FileObject struct {
	Path       string   `json:"path"`
	Type       FileType `json:"type"`
	Discovered bool     `json:"discovered"`
	Empty      bool     `json:"empty,omitempty"`
}

var commandHandlers = map[string]CommandHandler{
	"ls":    handleLs,
	"cd":    handleCd,
	"touch": handleCreate,
	"mkdir": handleCreate,
	"cp":    handleCopy,
	"rm":    handleRemove,
	"rmdir": handleRemove,
	"mv":    handleMove,
	"pwd":   handlePwd,
}

func handleCommand(cmd string) (CommandParams, error) {
	parts := strings.Fields(cmd)
	if len(parts) == 0 {
		return CommandParams{}, nil
	}

	handler, exists := commandHandlers[parts[0]]
	if !exists {
		return CommandParams{}, nil
	}

	return handler(cmd)
}

func handleCd(cmd string) (CommandParams, error) {
	return CommandParams{
		Pwd: os.Getenv("PWD"),
	}, nil
}

func handleLs(cmd string) (CommandParams, error) {
	files := getFilePathList(cmd)
	if len(files) == 0 {
		files = append(files, ".")
	}

	results := make([]FileObject, 0)
	for _, path := range files {
		err := discover(&results, path, 0)
		if err != nil {
			return CommandParams{}, err
		}
	}

	return CommandParams{
		Discover: results,
	}, nil
}

func discover(files *[]FileObject, path string, level int) error {
	absPath := resolvePath(path)
	fileType, err := fileExists(absPath)
	if errors.Is(err, os.ErrNotExist) {
		return nil
	}
	if err != nil {
		return fmt.Errorf("ls: cannot access '%s': %v", path, err)
	}

	if fileType == FileTypeFile {
		*files = append(*files, FileObject{
			Path:       absPath,
			Type:       fileType,
			Discovered: level <= 1,
		})
		return nil
	}

	entries, err := os.ReadDir(absPath)
	if err != nil {
		return fmt.Errorf("error reading directory: %v", err)
	}

	*files = append(*files, FileObject{
		Path:       absPath,
		Type:       fileType,
		Discovered: level <= 1,
		Empty:      len(entries) == 0,
	})

	if level >= 2 {
		return nil
	}

	for _, entry := range entries {
		discover(files, filepath.Join(absPath, entry.Name()), level+1)
	}
	return nil
}

func handleCreate(cmd string) (CommandParams, error) {
	files := getFilePathList(cmd)
	results := make([]FileObject, 0, len(files))
	for _, absPath := range files {
		fileType, err := fileExists(absPath)
		if errors.Is(err, os.ErrNotExist) {
			continue
		}
		if err != nil {
			return CommandParams{}, err
		}
		results = append(results, FileObject{
			Path:       absPath,
			Type:       fileType,
			Discovered: true,
		})
	}
	return CommandParams{Add: results}, nil
}

func handleCopy(cmd string) (CommandParams, error) {
	files := getFilePathList(cmd)
	if len(files) < 2 {
		return CommandParams{}, nil
	}
	dest := files[len(files)-1]
	results := make([]FileObject, 0)
	discover(&results, dest, 0)
	return CommandParams{Discover: results}, nil
}

func handleRemove(cmd string) (CommandParams, error) {
	files := getFilePathList(cmd)
	results := make([]FileObject, 0, len(files))
	for _, absPath := range files {
		_, err := fileExists(absPath)
		// If the file exists, ignore it
		if err == nil {
			continue
		}
		if !errors.Is(err, os.ErrNotExist) {
			return CommandParams{}, err
		}
		results = append(results, FileObject{
			Path:       absPath,
			Type:       FileTypeFile, // whatever
			Discovered: true,
		})
	}
	return CommandParams{Remove: results}, nil
}

func handleMove(cmd string) (CommandParams, error) {
	files := getFilePathList(cmd)
	if len(files) < 2 {
		return CommandParams{}, nil
	}
	sources := files[:len(files)-1]
	dest := files[len(files)-1]
	result := CommandParams{
		Add:    make([]FileObject, 0, len(sources)),
		Remove: make([]FileObject, 0, len(sources)),
	}
	for _, source := range sources {
		_, err := fileExists(source)
		if err == nil {
			continue
		}
		if !errors.Is(err, os.ErrNotExist) {
			return CommandParams{}, err
		}
		result.Remove = append(result.Remove, FileObject{
			Path:       source,
			Type:       FileTypeFile, // whatever
			Discovered: true,
		})
	}

	discover(&result.Add, dest, 0)
	return result, nil
}

func handlePwd(cmd string) (CommandParams, error) {
	pwd := os.Getenv("PWD")
	parts := strings.Split(pwd, "/")
	currentPath := "/"
	results := make([]FileObject, 0, len(parts))
	for _, part := range parts {
		currentPath = filepath.Join(currentPath, part)
		results = append(results, FileObject{
			Path:       currentPath,
			Type:       FileTypeDir,
			Discovered: true,
		})
	}
	return CommandParams{
		Pwd: os.Getenv("PWD"),
		Add: results,
	}, nil
}
