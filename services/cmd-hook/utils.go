package main

import (
	"os"
	"path/filepath"
	"strings"
)

type FileType string

const (
	FileTypeFile FileType = "file"
	FileTypeDir  FileType = "directory"
)

func resolvePath(path string) string {
	if filepath.IsAbs(path) {
		return path
	}
	if strings.HasPrefix(path, "~") {
		homeDir := os.Getenv("HOME")
		return filepath.Join(homeDir, path[1:])
	}
	return filepath.Join(os.Getenv("PWD"), path)
}

func fileExists(path string) (FileType, error) {
	fileInfo, err := os.Stat(path)
	if err != nil {
		return "", err
	}
	if fileInfo.IsDir() {
		return FileTypeDir, nil
	}
	return FileTypeFile, nil
}

func getFilePathList(cmd string) []string {
	parts := strings.Fields(cmd)[1:]
	results := make([]string, 0, len(parts))
	for _, part := range parts {
		if strings.HasPrefix(part, "-") {
			continue
		}
		absPath := resolvePath(part)
		results = append(results, absPath)
	}
	return results
}
