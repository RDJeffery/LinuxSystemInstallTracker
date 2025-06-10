#!/bin/bash

# Function to safely get command output
get_command_output() {
    local cmd="$1"
    local output
    output=$($cmd 2>/dev/null)
    if [ $? -eq 0 ]; then
        if [ -z "$output" ]; then
            echo "Unknown"
        else
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

# Function to safely convert array to JSON
array_to_json() {
    local input="$1"
    if [ -z "$input" ]; then
        echo "[]"
    else
        echo "$input" | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g' -e 's/\n/\\n/g' -e 's/\r/\\r/g' -e 's/\t/\\t/g' | jq -R -s -c 'split("\n")[:-1]'
    fi
}

# Function to get packages from lists
get_packages_from_lists() {
    local category="$1"
    local packages=""
    
    # Read from both main and foreign package lists
    if [ -f "/etc/pacman.d/lists/pkglist.txt" ]; then
        packages+=$(grep -f <(echo "$2" | tr ' ' '\n') "/etc/pacman.d/lists/pkglist.txt" 2>/dev/null)
    fi
    if [ -f "/etc/pacman.d/lists/foreignpkglist.txt" ]; then
        packages+=$'\n'$(grep -f <(echo "$2" | tr ' ' '\n') "/etc/pacman.d/lists/foreignpkglist.txt" 2>/dev/null)
    fi
    
    # Remove duplicates and empty lines
    echo "$packages" | sort -u | grep -v '^$'
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

# Define package categories
declare -A categories
categories["CORE_OS_UTILITIES"]="waybar udiskie pavucontrol wttr hyprland hyprlock hypridle hyprpicker hyprcursor nwg-look yay flatpak pcmanfm lf engrampa xdg-desktop-portal-hyprland"
categories["EXTRA_UTILITIES"]="btop neofetch bottles wine helvum wineasio latencyflex"
categories["WEB_BROWSERS"]="brave qutebrowser"
categories["TEXT_EDITORS"]="cursor neovim"
categories["LAUNCHERS"]="steam lutris"
categories["APPLICATIONS"]="spotify vesktop davinci-resolve touchdesigner"

# Get installed packages for each category
CORE_OS_UTILITIES=$(get_packages_from_lists "CORE_OS_UTILITIES" "${categories[CORE_OS_UTILITIES]}")
EXTRA_UTILITIES=$(get_packages_from_lists "EXTRA_UTILITIES" "${categories[EXTRA_UTILITIES]}")
WEB_BROWSERS=$(get_packages_from_lists "WEB_BROWSERS" "${categories[WEB_BROWSERS]}")
TEXT_EDITORS=$(get_packages_from_lists "TEXT_EDITORS" "${categories[TEXT_EDITORS]}")
LAUNCHERS=$(get_packages_from_lists "LAUNCHERS" "${categories[LAUNCHERS]}")
APPLICATIONS=$(get_packages_from_lists "APPLICATIONS" "${categories[APPLICATIONS]}")

# Get installed fonts
INSTALLED_FONTS=$(get_command_output "fc-list : family | sort | uniq")

# Get installed themes
INSTALLED_THEMES=$(get_command_output "ls /usr/share/themes/ 2>/dev/null")

# Get installed icon themes
INSTALLED_ICON_THEMES=$(get_command_output "ls /usr/share/icons/ 2>/dev/null")

# Get installed cursor themes
INSTALLED_CURSOR_THEMES=$(get_command_output "ls /usr/share/icons/ 2>/dev/null | grep -i cursor")

# Create the final JSON output
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
    "coreOsUtilities": $(array_to_json "$CORE_OS_UTILITIES"),
    "extraUtilities": $(array_to_json "$EXTRA_UTILITIES"),
    "webBrowsers": $(array_to_json "$WEB_BROWSERS"),
    "textEditors": $(array_to_json "$TEXT_EDITORS"),
    "launchers": $(array_to_json "$LAUNCHERS"),
    "applications": $(array_to_json "$APPLICATIONS")
  },
  "themes": {
    "fonts": $(array_to_json "$INSTALLED_FONTS"),
    "themes": $(array_to_json "$INSTALLED_THEMES"),
    "iconThemes": $(array_to_json "$INSTALLED_ICON_THEMES"),
    "cursorThemes": $(array_to_json "$INSTALLED_CURSOR_THEMES")
  }
}
EOF