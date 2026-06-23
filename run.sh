#!/bin/bash

# Exit on error
set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MAVEN_VERSION="3.8.8"
MAVEN_DIR="${PROJECT_DIR}/.maven"

echo "=== DevPortfolio AI Startup System ==="

# Load environment variables from .env file if it exists
if [ -f "${PROJECT_DIR}/.env" ]; then
    echo "✓ Loading environment variables from .env file..."
    while IFS= read -r line || [ -n "$line" ]; do
        # Ignore comments and empty lines
        if [[ ! "$line" =~ ^# ]] && [[ ! "$line" =~ ^[[:space:]]*$ ]]; then
            eval "export $line"
        fi
    done < "${PROJECT_DIR}/.env"
fi

# Check Java version
if ! command -v java &> /dev/null; then
    echo "Error: Java is not installed. Please install Java 17+ and retry."
    exit 1
fi
echo "✓ Java detected: $(java -version 2>&1 | head -n 1)"

# Check local Maven binary
if [ ! -d "${MAVEN_DIR}" ]; then
    echo "Local Maven not found. Downloading Apache Maven ${MAVEN_VERSION}..."
    curl -L "https://archive.apache.org/dist/maven/maven-3/${MAVEN_VERSION}/binaries/apache-maven-${MAVEN_VERSION}-bin.tar.gz" -o "${PROJECT_DIR}/maven.tar.gz"
    mkdir -p "${MAVEN_DIR}"
    tar -xzf "${PROJECT_DIR}/maven.tar.gz" -C "${MAVEN_DIR}" --strip-components=1
    rm "${PROJECT_DIR}/maven.tar.gz"
    echo "✓ Maven installed locally at ${MAVEN_DIR}"
fi

export PATH="${MAVEN_DIR}/bin:${PATH}"
echo "✓ Maven detected: $(mvn --version | head -n 1)"

# Note on MongoDB Database
echo ""
echo "=========================================================="
echo "IMPORTANT: This application connects to MongoDB."
echo "Please make sure your local MongoDB is running:"
echo "Host: localhost:27017"
echo "Database: devportfolio"
echo "=========================================================="
echo ""

# Check if MongoDB is running
if nc -z localhost 27017 &>/dev/null; then
    echo "✓ MongoDB detected on localhost:27017. Starting Spring Boot..."
else
    echo "⚠ MongoDB NOT detected on localhost:27017."
    echo "  Please make sure your MongoDB instance is running, or verify your MONGODB_URI in your .env file."
fi

# Run Spring Boot backend
echo "Starting Spring Boot backend..."
cd "${PROJECT_DIR}/backend"
mvn spring-boot:run
