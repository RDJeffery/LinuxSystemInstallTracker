#!/bin/bash

# Function to safely get command output
get_command_output() {
    local cmd="$1"
    local output
    output=$($cmd 2>/dev/null)
    if [ $? -eq 0 ]; then
        echo "$output"
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
        # Remove quotes from the value
        echo "$value" | sed -e "s/^'//" -e "s/'$//"
    else
        echo "Unknown"
    fi
}

# Function to get installed packages
get_installed_packages() {
    # Get explicitly installed packages
    pacman -Qe | awk '{print $1}'
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
    "users": $(echo "$USERS" | jq -R -s -c 'split("\n")[:-1]'),
    "drivers": {
        "graphics": "$GRAPHICS_DRIVER",
        "audio": "$AUDIO_DRIVER"
    },
    "packages": {
        "coreOsUtilities": $(echo "${categories["CORE_OS_UTILITIES"]}" | tr ' ' '\n' | jq -R -s -c 'split("\n")[:-1]'),
        "extraUtilities": $(echo "${categories["EXTRA_UTILITIES"]}" | tr ' ' '\n' | jq -R -s -c 'split("\n")[:-1]'),
        "webBrowsers": $(echo "${categories["WEB_BROWSERS"]}" | tr ' ' '\n' | jq -R -s -c 'split("\n")[:-1]'),
        "textEditors": $(echo "${categories["TEXT_EDITORS"]}" | tr ' ' '\n' | jq -R -s -c 'split("\n")[:-1]'),
        "launchers": $(echo "${categories["LAUNCHERS"]}" | tr ' ' '\n' | jq -R -s -c 'split("\n")[:-1]'),
        "applications": $(echo "${categories["APPLICATIONS"]}" | tr ' ' '\n' | jq -R -s -c 'split("\n")[:-1]')
    },
    "themes": {
        "fonts": $(echo "$INSTALLED_FONTS" | jq -R -s -c 'split("\n")[:-1]'),
        "themes": $(echo "$INSTALLED_THEMES" | jq -R -s -c 'split("\n")[:-1]'),
        "iconThemes": $(echo "$INSTALLED_ICON_THEMES" | jq -R -s -c 'split("\n")[:-1]'),
        "cursorThemes": $(echo "$INSTALLED_CURSOR_THEMES" | jq -R -s -c 'split("\n")[:-1]')
    }
}
EOF 