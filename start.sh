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

# Function to print colored output
print_status() {
    echo -e "\033[1;34m==>\033[0m $1"
}

print_error() {
    echo -e "\033[1;31mError:\033[0m $1"
}

print_success() {
    echo -e "\033[1;32mSuccess:\033[0m $1"
}

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Setup Python environment
print_status "Setting up Python environment..."
if ! "$SCRIPT_DIR/scripts/setup_and_run.sh"; then
    print_error "Failed to setup Python environment."
    exit 1
fi
print_success "Python environment setup complete."

# Start the Python system info server in the background
print_status "Starting Python system info server..."
cd "$SCRIPT_DIR/scripts" && source venv/bin/activate && python get_system_info.py &
PYTHON_PID=$!

# Wait a moment for the Python server to start
sleep 2

# Start the backend server in the background
print_status "Starting backend server..."
cd "$SCRIPT_DIR/server" && npm install && node index.js &
BACKEND_PID=$!

# Wait a moment for the backend to start
sleep 2

# Start the frontend development server in the background
print_status "Starting frontend development server..."
cd "$SCRIPT_DIR" && npm install && npm run dev &
FRONTEND_PID=$!

# Wait a moment for the frontend to start
sleep 3

# Open the browser
print_status "Opening browser..."
open_browser "http://localhost:5173"

# Function to handle script termination
cleanup() {
    print_status "Shutting down servers..."
    kill $PYTHON_PID 2>/dev/null
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    print_success "Servers stopped."
    exit 0
}

# Set up trap to catch termination signal
trap cleanup SIGINT SIGTERM

# Keep the script running
print_status "Servers are running. Press Ctrl+C to stop."
wait 