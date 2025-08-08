#!/bin/bash

# GitHub configuration
GITHUB_USER="numerimondes"
GITHUB_REPO=".github"
BRANCH="main"
BASE_URL="https://raw.githubusercontent.com/$GITHUB_USER/$GITHUB_REPO/refs/heads/$BRANCH"

# Output file path (relative to current `assets/` directory)
OUTPUT_FILE="commons/config/assets-links.txt"

# Create parent directory if it doesn't exist
mkdir -p "$(dirname "$OUTPUT_FILE")"

# Clear the output file
> "$OUTPUT_FILE"

# Find and process files
find . -type f \
    ! -name "*.txt" \
    ! -name "*.sh" \
    ! -name ".gitkeep" \
    ! -name "txt.gitkeep" \
    | while read -r file; do
        clean_path="${file#./}"
        echo "$BASE_URL/assets/$clean_path" >> "$OUTPUT_FILE"
    done

