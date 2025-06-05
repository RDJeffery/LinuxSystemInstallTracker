#!/bin/bash

# Function to safely get command output
get_command_output() {
    local cmd="$1"
    local output
    output=$($cmd 2>/dev/null)
    if [ $? -eq 0 ]; then
        # Escape special characters and handle empty output
        if [ -z "$output" ]; then
            echo "Unknown"
        else
            # Properly escape special characters for JSON
            echo "$output" | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g' -e 's/\n/\\n/g' -e 's/\r/\\r/g' -e 's/\t/\\t/g'
        fi
    else
        echo "Unknown"
    fi
}

# Function to get theme information from gsettings
get_theme_info() {
    local schema="$1"
    local key="$2"
    local value
    value=$(gsettings get "$schema" "$key" 2>/dev/null)
    if [ $? -eq 0 ]; then
        # Remove quotes and escape special characters
        value=$(echo "$value" | sed -e "s/^'//" -e "s/'$//" -e 's/\\/\\\\/g' -e 's/"/\\"/g' -e 's/\n/\\n/g' -e 's/\r/\\r/g' -e 's/\t/\\t/g')
        if [ -z "$value" ]; then
            echo "Unknown"
        else
            echo "$value"
        fi
    else
        echo "Unknown"
    fi
}

# Function to get installed packages
get_installed_packages() {
    # Get explicitly installed packages
    pacman -Qe 2>/dev/null | awk '{print $1}'
}

# Function to get package description
get_package_description() {
    local pkg="$1"
    pacman -Qi "$pkg" 2>/dev/null | grep "Description" | cut -d: -f2 | sed 's/^[ \t]*//'
}

# Function to get package category
get_package_category() {
    local pkg="$1"
    pacman -Qi "$pkg" 2>/dev/null | grep "Groups" | cut -d: -f2 | sed 's/^[ \t]*//'
}

# Get system information
HOSTNAME=$(get_command_output "hostname")
BASE_INSTALL=$(get_command_output "cat /etc/os-release | grep PRETTY_NAME | cut -d= -f2 | tr -d '\"'")
KERNEL=$(get_command_output "uname -r")
BOOTLOADER=$(get_command_output "systemctl status boot.mount 2>/dev/null | grep 'Loaded:' | awk '{print $2}'")

# Get login manager
LOGIN_MANAGER=$(get_command_output "systemctl status display-manager 2>/dev/null | grep 'Loaded:' | awk '{print $2}'")

# Get theme information
FONT=$(get_theme_info "org.gnome.desktop.interface" "font-name")
THEME=$(get_theme_info "org.gnome.desktop.interface" "gtk-theme")
ICON_THEME=$(get_theme_info "org.gnome.desktop.interface" "icon-theme")
CURSOR_THEME=$(get_theme_info "org.gnome.desktop.interface" "cursor-theme")

# Get users
USERS=$(get_command_output "cat /etc/passwd | grep -v '/usr/sbin/nologin' | grep -v '/bin/false' | cut -d: -f1")

# Get graphics driver
GRAPHICS_DRIVER=$(get_command_output "lspci -k | grep -A 2 -E '(VGA|3D)' | grep 'Kernel driver' | awk '{print $NF}'")

# Get audio driver
AUDIO_DRIVER=$(get_command_output "systemctl status pipewire.service 2>/dev/null | grep 'Active:' | awk '{print $2}'")

# Get installed packages and categorize them
declare -A categories
categories["CORE_OS_UTILITIES"]="waybar udiskie pavucontrol wttr hyprland hyprlock hypridle hyprpicker hyprcursor nwg-look yay flatpak pcmanfm lf engrampa xdg-desktop-portal-hyprland"
categories["EXTRA_UTILITIES"]="btop neofetch bottles wine helvum wineasio latencyflex"
categories["WEB_BROWSERS"]="brave qutebrowser"
categories["TEXT_EDITORS"]="cursor neovim"
categories["LAUNCHERS"]="steam lutris"
categories["APPLICATIONS"]="spotify vesktop davinci-resolve touchdesigner"

# Get installed fonts
INSTALLED_FONTS=$(get_command_output "fc-list : family | sort | uniq")

# Get installed themes
INSTALLED_THEMES=$(get_command_output "ls /usr/share/themes/ 2>/dev/null")

# Get installed icon themes
INSTALLED_ICON_THEMES=$(get_command_output "ls /usr/share/icons/ 2>/dev/null")

# Get installed cursor themes
INSTALLED_CURSOR_THEMES=$(get_command_output "ls /usr/share/icons/ 2>/dev/null | grep -i cursor")

# Function to safely convert array to JSON
array_to_json() {
    local input="$1"
    if [ -z "$input" ]; then
        echo "[]"
    else
        # Properly escape and format the array
        echo "$input" | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g' -e 's/\n/\\n/g' -e 's/\r/\\r/g' -e 's/\t/\\t/g' | jq -R -s -c 'split("\n")[:-1]'
    fi
}

# Get system info using neofetch
get_neofetch_info() {
    if command -v neofetch >/dev/null 2>&1; then
        neofetch --json | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g' -e 's/\n/\\n/g' -e 's/\r/\\r/g' -e 's/\t/\\t/g'
    else
        echo "{}"
    fi
}

# Get Hyprland info using hyprctl
get_hyprland_info() {
    if command -v hyprctl >/dev/null 2>&1; then
        echo "{\"version\": \"$(hyprctl version | grep -oP 'tag: \K.*' | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g')\", \"monitors\": \"$(hyprctl monitors | grep -oP 'Monitor \K.*' | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g')\"}"
    else
        echo "{}"
    fi
}

# Get audio info using pactl or wpctl
get_audio_info() {
    if command -v pactl >/dev/null 2>&1; then
        echo "{\"audio\": \"$(pactl info | grep -oP 'Server Name: \K.*' | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g')\"}"
    elif command -v wpctl >/dev/null 2>&1; then
        echo "{\"audio\": \"$(wpctl status | grep -oP 'Audio: \K.*' | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g')\"}"
    else
        echo "{}"
    fi
}

# Get login manager info using systemctl
get_login_manager_info() {
    if systemctl status ly >/dev/null 2>&1; then
        echo "{\"login_manager\": \"Ly\"}"
    else
        echo "{\"login_manager\": \"Unknown\"}"
    fi
}

# Get NVIDIA GPU info using nvidia-smi
get_nvidia_info() {
    if command -v nvidia-smi >/dev/null 2>&1; then
        echo "{\"gpu\": \"$(nvidia-smi --query-gpu=name,driver_version --format=csv,noheader)\"}"
    else
        echo "{}"
    fi
}

# Create JSON output
cat << EOF
{
    "system": {
        "hostname": "$HOSTNAME",
        "baseInstall": "$BASE_INSTALL",
        "kernel": "$KERNEL",
        "bootloader": "$BOOTLOADER",
        "loginManager": "$LOGIN_MANAGER",
        "font": "$FONT",
        "theme": "$THEME",
        "iconTheme": "$ICON_THEME",
        "cursorTheme": "$CURSOR_THEME"
    },
    "users": $(array_to_json "$USERS"),
    "drivers": {
        "graphics": "$GRAPHICS_DRIVER",
        "audio": "$AUDIO_DRIVER"
    },
    "packages": {
        "coreOsUtilities": $(array_to_json "${categories["CORE_OS_UTILITIES"]}"),
        "extraUtilities": $(array_to_json "${categories["EXTRA_UTILITIES"]}"),
        "webBrowsers": $(array_to_json "${categories["WEB_BROWSERS"]}"),
        "textEditors": $(array_to_json "${categories["TEXT_EDITORS"]}"),
        "launchers": $(array_to_json "${categories["LAUNCHERS"]}"),
        "applications": $(array_to_json "${categories["APPLICATIONS"]}")
    },
    "themes": {
        "fonts": $(array_to_json "$INSTALLED_FONTS"),
        "themes": $(array_to_json "$INSTALLED_THEMES"),
        "iconThemes": $(array_to_json "$INSTALLED_ICON_THEMES"),
        "cursorThemes": $(array_to_json "$INSTALLED_CURSOR_THEMES")
    },
    "system_info": $(get_neofetch_info),
    "hyprland_info": $(get_hyprland_info),
    "audio_info": $(get_audio_info),
    "login_manager_info": $(get_login_manager_info),
    "nvidia_info": $(get_nvidia_info)
}
EOF