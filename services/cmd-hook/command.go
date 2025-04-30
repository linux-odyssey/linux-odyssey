package main

import (
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
	"touch": handleTouch,
	"mkdir": handleMkdir,
	"cp":    handleCp,
	"rm":    handleRm,
	"rmdir": handleRmdir,
	"mv":    handleMv,
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
	fmt.Println("handleLs", cmd)
	parts := strings.Fields(cmd)[1:]
	path := "."
	if len(parts) > 1 {
		path = parts[1]
	}

	files := make([]FileObject, 0)
	err := discover(&files, path, 0)
	if err != nil {
		return CommandParams{}, err
	}

	return CommandParams{
		Discover: files,
	}, nil
}

func discover(files *[]FileObject, path string, level int) error {
	absPath := resolvePath(path)
	fileType, err := fileExists(absPath)
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

func handleTouch(cmd string) (CommandParams, error) {
	// TODO: Implement touch command
	return CommandParams{}, nil
}

func handleMkdir(cmd string) (CommandParams, error) {
	// TODO: Implement mkdir command
	return CommandParams{}, nil
}

func handleCp(cmd string) (CommandParams, error) {
	// TODO: Implement cp command
	return CommandParams{}, nil
}

func handleRm(cmd string) (CommandParams, error) {
	// TODO: Implement rm command
	return CommandParams{}, nil
}

func handleRmdir(cmd string) (CommandParams, error) {
	// TODO: Implement rmdir command
	return CommandParams{}, nil
}

func handleMv(cmd string) (CommandParams, error) {
	// TODO: Implement mv command
	return CommandParams{}, nil
}
