#!/bin/bash

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
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

# Check if Python 3 is installed
if ! command_exists python3; then
    print_error "Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

# Check if venv module is available
if ! python3 -c "import venv" 2>/dev/null; then
    print_error "Python venv module is not available. Please install python3-venv package."
    exit 1
fi

# Directory setup
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VENV_DIR="$SCRIPT_DIR/venv"
REQUIREMENTS_FILE="$SCRIPT_DIR/requirements.txt"
PYTHON_SCRIPT="$SCRIPT_DIR/get_system_info.py"

# Create virtual environment if it doesn't exist
if [ ! -d "$VENV_DIR" ]; then
    print_status "Creating virtual environment..."
    python3 -m venv "$VENV_DIR"
    if [ $? -ne 0 ]; then
        print_error "Failed to create virtual environment."
        exit 1
    fi
    print_success "Virtual environment created."
fi

# Activate virtual environment
print_status "Activating virtual environment..."
source "$VENV_DIR/bin/activate"
if [ $? -ne 0 ]; then
    print_error "Failed to activate virtual environment."
    exit 1
fi
print_success "Virtual environment activated."

# Upgrade pip
print_status "Upgrading pip..."
python -m pip install --upgrade pip
if [ $? -ne 0 ]; then
    print_error "Failed to upgrade pip."
    exit 1
fi
print_success "Pip upgraded."

# Install requirements
if [ -f "$REQUIREMENTS_FILE" ]; then
    print_status "Installing requirements..."
    pip install -r "$REQUIREMENTS_FILE"
    if [ $? -ne 0 ]; then
        print_error "Failed to install requirements."
        exit 1
    fi
    print_success "Requirements installed."
else
    print_error "Requirements file not found at $REQUIREMENTS_FILE"
    exit 1
fi

# Run the Python script
print_status "Running system information script..."
python "$PYTHON_SCRIPT"
if [ $? -ne 0 ]; then
    print_error "Failed to run system information script."
    exit 1
fi

# Deactivate virtual environment
deactivate
print_success "Script completed successfully." 