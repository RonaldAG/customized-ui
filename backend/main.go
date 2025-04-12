package main

import (
	"fmt"
	"os"
	"path/filepath"
)

func main() {
	// Get the current working directory
	currentDir, err := os.Getwd()
	if err != nil {
		fmt.Printf("Error getting current directory: %v\n", err)
		return
	}

	// Construct the path to data.txt
	dataPath := filepath.Join(currentDir, "/", "configurations", "data.txt")

	// Read the file contents
	content, err := os.ReadFile(dataPath)
	if err != nil {
		fmt.Printf("Error reading file: %v\n", err)
		return
	}

	// Print the contents
	fmt.Println("Contents of data.txt:")
	fmt.Println(string(content))
}
