package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
)

var (
	addr = flag.String("addr", ":9090", "http service address")
)

func serveWs(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("upgrade:", err)
		return
	}
	defer ws.Close()

	token := r.URL.Query().Get("token")
	if token == "" {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Create new terminal
	term, err := newTerminal(token)
	if err != nil {
		internalError(ws, "start:", err)
		return
	}
	defer term.Close()

	stdoutDone := make(chan struct{})
	go pumpStdout(ws, term.pty, stdoutDone)
	go ping(ws, stdoutDone)

	pumpStdin(ws, term.pty)

	// Wait for stdout to finish
	<-stdoutDone
}

func serveHome(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		http.Error(w, "Not found", http.StatusNotFound)
		return
	}
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	w.Header().Set("Content-Type", "text/html")
	w.Write(indexHTML)
}

func serveHealth(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	for _, e := range os.Environ() {
		fmt.Fprintln(w, e)
	}
}

func main() {
	flag.Parse()
	log.SetFlags(0)
	http.HandleFunc("/", serveHome)
	http.HandleFunc("/ws", serveWs)
	http.HandleFunc("/health", serveHealth)
	fmt.Println("Starting terminal service on", *addr)
	log.Fatal(http.ListenAndServe(*addr, nil))
}
