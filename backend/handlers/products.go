package handlers

import (
	"log"
	"net/http"
	"os"
	"path/filepath"
)

type Products struct {
	log *log.Logger
}

func NewProducts(log *log.Logger) *Products {
	return &Products{log}
}

func (p *Products) GetProducts(rw http.ResponseWriter, r *http.Request) {
	// Get the current working directory
	currentDir, err := os.Getwd()
	if err != nil {
		p.log.Printf("Error getting current directory: %v\n", err)
		return
	}

	// Construct the path to data.txt
	dataPath := filepath.Join(currentDir, "..", "configurations", "data.json")

	// Read the file contents
	content, err := os.ReadFile(dataPath)
	if err != nil {
		p.log.Printf("Error reading file: %v\n", err)
		return
	}

	// Print the contents
	p.log.Printf("Contents of data.txt: %s", string(content))

	// Set the content type header
	rw.Header().Set("Content-Type", "application/json")
	rw.Write(content)
}
