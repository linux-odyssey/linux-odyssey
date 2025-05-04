package main

import (
	"os"
	"os/exec"

	"github.com/creack/pty"
)

type terminal struct {
	cmd *exec.Cmd
	pty *os.File
}

func newTerminal(token string) (*terminal, error) {
	// Start a new shell in the home directory
	cmd := exec.Command("/usr/bin/zsh")
	cmd.Dir = os.Getenv("HOME")
	cmd.Env = append(os.Environ(), "ZDOTDIR=/etc/zsh", "TOKEN="+token, "TERM=xterm-256color")
	ptmx, err := pty.Start(cmd)
	if err != nil {
		return nil, err
	}

	return &terminal{
		cmd: cmd,
		pty: ptmx,
	}, nil
}

func (t *terminal) Close() error {
	if t.pty != nil {
		t.pty.Close()
	}
	if t.cmd != nil {
		t.cmd.Process.Kill()
		t.cmd.Wait()
	}
	return nil
}
