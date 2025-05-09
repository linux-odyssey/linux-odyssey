package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
)

type CommandPayload struct {
	Command  string        `json:"command"`
	Output   string        `json:"output"`
	Error    string        `json:"error"`
	ExitCode string        `json:"exit_code"`
	PWD      string        `json:"pwd"`
	Params   CommandParams `json:"params"`
}

func readOrNone(file string) string {
	data, err := os.ReadFile(file)
	if err != nil {
		return ""
	}
	return string(data)
}

func main() {
	cmdName := os.Getenv("CMD_NAME")
	if cmdName == "" {
		os.Exit(0)
	}

	payload := CommandPayload{
		Command:  cmdName,
		Output:   readOrNone(os.Getenv("CMD_OUTPUT_FILE")),
		Error:    readOrNone(os.Getenv("CMD_ERROR_FILE")),
		ExitCode: os.Getenv("CMD_EXIT_CODE"),
		PWD:      os.Getenv("PWD"),
	}

	params, err := handleCommand(cmdName)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error handling command: %v\n", err)
		os.Exit(1)
	}

	payload.Params = params

	backendUrl := os.Getenv("BACKEND_URL")
	if backendUrl == "" {
		fmt.Fprintf(os.Stderr, "BACKEND_URL is not set\n")
		os.Exit(1)
	}
	token := os.Getenv("TOKEN")

	jsonData, err := json.MarshalIndent(payload, "", "  ")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error marshaling payload: %v\n", err)
		os.Exit(1)
	}

	req, err := http.NewRequest("POST", fmt.Sprintf("%s/api/v1/commands", backendUrl), bytes.NewBuffer(jsonData))
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error creating request: %v\n", err)
		os.Exit(1)
	}

	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", token))
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error sending request: %v\n", err)
		os.Exit(1)
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		body, _ := io.ReadAll(resp.Body)
		fmt.Fprintf(os.Stderr, "Failed to send command: %s\nResponse Body: %s\n", resp.Status, string(body))
		os.Exit(1)
	}
}
