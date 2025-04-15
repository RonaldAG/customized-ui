package handlers

import (
	"encoding/json"
	"io"
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

	// Construct the path to data.json
	dataPath := filepath.Join(currentDir, "..", "configurations", "data.json")

	// Read the file contents
	content, err := os.ReadFile(dataPath)
	if err != nil {
		p.log.Printf("Error reading file: %v\n", err)
		return
	}

	// Print the contents
	p.log.Printf("Contents of data.json: %s", string(content))

	// Set the content type header
	rw.Header().Set("Content-Type", "application/json")
	rw.Write(content)
}

// This function is used to post a file to the server
func (p *Products) PostProducts(rw http.ResponseWriter, r *http.Request) {
	// Parse the multipart form with a max memory of 32MB
	err := r.ParseMultipartForm(32 << 20)
	if err != nil {
		p.log.Printf("Error parsing multipart form: %v\n", err)
		http.Error(rw, "Error parsing form", http.StatusBadRequest)
		return
	}
	defer r.MultipartForm.RemoveAll()

	// Get the file from the form
	file, header, err := r.FormFile("file")
	if err != nil {
		p.log.Printf("Error getting file from form: %v\n", err)
		http.Error(rw, "Error getting file", http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Get the current working directory
	currentDir, err := os.Getwd()
	if err != nil {
		p.log.Printf("Error getting current directory: %v\n", err)
		return
	}

	// Construct the path to data.json
	dataPath := filepath.Join(currentDir, "..", "configurations", "data.json")
	
	// Read the file contents into a byte slice
	fileBytes, err := io.ReadAll(file)
	if err != nil {
		p.log.Printf("Error reading file: %v\n", err)
		http.Error(rw, "Error reading file", http.StatusInternalServerError)
		return
	}

	// replace the file with the new one
	err = os.WriteFile(dataPath, fileBytes, 0644)
	if err != nil {
		p.log.Printf("Error writing file: %v\n", err)
		http.Error(rw, "Error writing file", http.StatusInternalServerError)
		return
	}

	// Return success response
	response := map[string]string{
		"message":  "File uploaded successfully",
		"filename": header.Filename,
	}

	rw.Header().Set("Content-Type", "application/json")
	json.NewEncoder(rw).Encode(response)
}
