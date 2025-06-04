#!/bin/bash

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to open URL in default browser
open_browser() {
    if command_exists xdg-open; then
        xdg-open "$1"
    elif command_exists open; then
        open "$1"
    else
        echo "Could not find a way to open the browser automatically."
        echo "Please open http://localhost:5173 in your browser."
    fi
}

# Start the backend server in the background
echo "Starting backend server..."
cd server && node index.js &
BACKEND_PID=$!

# Wait a moment for the backend to start
sleep 2

# Start the frontend development server in the background
echo "Starting frontend development server..."
npm run dev &
FRONTEND_PID=$!

# Wait a moment for the frontend to start
sleep 3

# Open the browser
echo "Opening browser..."
open_browser "http://localhost:5173"

# Function to handle script termination
cleanup() {
    echo "Shutting down servers..."
    kill $BACKEND_PID
    kill $FRONTEND_PID
    exit 0
}

# Set up trap to catch termination signal
trap cleanup SIGINT SIGTERM

# Keep the script running
echo "Servers are running. Press Ctrl+C to stop."
wait 