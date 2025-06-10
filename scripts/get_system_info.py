#!/usr/bin/env python3

import json
import os
import subprocess
import re
from typing import Dict, List, Optional, Union
import platform
import pwd
import psutil
import gi
from flask import Flask, jsonify
from flask_cors import CORS
gi.require_version('Gio', '2.0')
from gi.repository import Gio

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def run_command(cmd: str) -> str:
    """Run a command and return its output."""
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        return result.stdout.strip() if result.returncode == 0 else "Unknown"
    except Exception:
        return "Unknown"

def get_hostname() -> str:
    """Get system hostname."""
    return platform.node()

def get_base_install() -> str:
    """Get base installation information."""
    try:
        with open('/etc/os-release', 'r') as f:
            for line in f:
                if line.startswith('PRETTY_NAME='):
                    return line.split('=', 1)[1].strip().strip('"')
    except Exception:
        pass
    return "Unknown"

def get_kernel() -> str:
    """Get kernel version."""
    return platform.release()

def get_bootloader() -> str:
    """Get bootloader information."""
    # Try to detect GRUB
    if os.path.exists('/boot/grub/grub.cfg'):
        return "GRUB"
    # Try to detect systemd-boot
    if os.path.exists('/boot/loader/loader.conf'):
        return "systemd-boot"
    # Try to detect rEFInd
    if os.path.exists('/boot/refind/refind.conf'):
        return "rEFInd"
    return "Unknown"

def get_login_manager() -> str:
    """Get login manager information."""
    try:
        # Check for common display managers
        display_managers = {
            'ly': 'Ly',
            'lightdm': 'LightDM',
            'gdm': 'GDM',
            'sddm': 'SDDM',
            'lxdm': 'LXDM'
        }
        
        for service, name in display_managers.items():
            result = subprocess.run(['systemctl', 'is-active', service], 
                                 capture_output=True, text=True)
            if result.returncode == 0 and result.stdout.strip() == 'active':
                return name
    except Exception:
        pass
    return "Unknown"

def get_theme_info() -> Dict[str, str]:
    """Get theme information using GSettings or fallback to environment variables."""
    theme_info = {
        'font': "Unknown",
        'theme': "Unknown",
        'iconTheme': "Unknown",
        'cursorTheme': "Unknown"
    }
    
    try:
        # Try GSettings first (GNOME)
        settings = Gio.Settings.new('org.gnome.desktop.interface')
        theme_info.update({
            'font': settings.get_string('font-name') or "Unknown",
            'theme': settings.get_string('gtk-theme') or "Unknown",
            'iconTheme': settings.get_string('icon-theme') or "Unknown",
            'cursorTheme': settings.get_string('cursor-theme') or "Unknown"
        })
    except Exception:
        # Fallback to environment variables
        theme_info.update({
            'font': os.environ.get('GTK_FONT', "Unknown"),
            'theme': os.environ.get('GTK_THEME', "Unknown"),
            'iconTheme': os.environ.get('GTK_ICON_THEME', "Unknown"),
            'cursorTheme': os.environ.get('XCURSOR_THEME', "Unknown")
        })
    
    return theme_info

def get_users() -> List[str]:
    """Get list of real users."""
    users = []
    try:
        for user in pwd.getpwall():
            if user.pw_uid >= 1000 and user.pw_shell != '/usr/sbin/nologin':
                users.append(user.pw_name)
    except Exception:
        pass
    return users if users else ["Unknown"]

def get_graphics_driver() -> str:
    """Get graphics driver information."""
    # Try NVIDIA first
    try:
        nvidia_smi = subprocess.run(['nvidia-smi'], capture_output=True, text=True)
        if nvidia_smi.returncode == 0:
            return "NVIDIA"
    except Exception:
        pass

    # Try to get from lspci
    try:
        lspci = subprocess.run(['lspci', '-k'], capture_output=True, text=True)
        if lspci.returncode == 0:
            for line in lspci.stdout.split('\n'):
                if 'VGA' in line or '3D' in line:
                    if 'nvidia' in line.lower():
                        return "NVIDIA"
                    elif 'amd' in line.lower():
                        return "AMD"
                    elif 'intel' in line.lower():
                        return "Intel"
    except Exception:
        pass

    return "Unknown"

def get_audio_driver() -> str:
    """Get audio driver information."""
    # Check for PipeWire
    try:
        pipewire = subprocess.run(['systemctl', 'is-active', 'pipewire.service'],
                                capture_output=True, text=True)
        if pipewire.returncode == 0 and pipewire.stdout.strip() == 'active':
            return "PipeWire"
    except Exception:
        pass

    # Check for PulseAudio
    try:
        pulse = subprocess.run(['systemctl', 'is-active', 'pulseaudio.service'],
                             capture_output=True, text=True)
        if pulse.returncode == 0 and pulse.stdout.strip() == 'active':
            return "PulseAudio"
    except Exception:
        pass

    return "Unknown"

def get_packages_from_lists(category_packages: List[str]) -> List[str]:
    """Get installed packages from pacman lists."""
    installed_packages = []
    
    # Read from main package list
    try:
        with open('/etc/pacman.d/lists/pkglist.txt', 'r') as f:
            main_packages = set(f.read().splitlines())
    except Exception:
        main_packages = set()

    # Read from foreign package list
    try:
        with open('/etc/pacman.d/lists/foreignpkglist.txt', 'r') as f:
            foreign_packages = set(f.read().splitlines())
    except Exception:
        foreign_packages = set()

    # If no package lists found, try pacman -Q
    if not main_packages and not foreign_packages:
        try:
            result = subprocess.run(['pacman', '-Q'], capture_output=True, text=True)
            if result.returncode == 0:
                all_packages = {line.split()[0] for line in result.stdout.splitlines()}
            else:
                all_packages = set()
        except Exception:
            all_packages = set()
    else:
        all_packages = main_packages.union(foreign_packages)

    # Filter packages
    for package in category_packages:
        if package in all_packages:
            installed_packages.append(package)

    return installed_packages

def get_installed_fonts() -> List[str]:
    """Get list of installed fonts."""
    try:
        result = subprocess.run(['fc-list', ':family'], capture_output=True, text=True)
        if result.returncode == 0:
            # Get all fonts
            all_fonts = set(result.stdout.splitlines())
            
            # Filter out common system fonts and keep only user-installed or important fonts
            filtered_fonts = []
            for font in all_fonts:
                # Skip common system fonts
                if any(skip in font.lower() for skip in ['noto', 'liberation', 'dejavu', 'ubuntu']):
                    continue
                # Keep user-installed fonts and important fonts
                if any(keep in font.lower() for keep in ['jetbrains', 'fira', 'hack', 'source', 'roboto', 'inter']):
                    filtered_fonts.append(font)
            
            return sorted(filtered_fonts)
    except Exception:
        pass
    return []

def get_installed_themes() -> Dict[str, List[str]]:
    """Get installed themes, icons, and cursors."""
    themes = {
        'themes': [],
        'iconThemes': [],
        'cursorThemes': []
    }
    
    # Get GTK themes
    theme_dirs = [
        '/usr/share/themes',
        os.path.expanduser('~/.themes')
    ]
    for theme_dir in theme_dirs:
        try:
            if os.path.exists(theme_dir):
                themes['themes'].extend(os.listdir(theme_dir))
        except Exception:
            pass

    # Get icon themes
    icon_dirs = [
        '/usr/share/icons',
        os.path.expanduser('~/.icons')
    ]
    for icon_dir in icon_dirs:
        try:
            if os.path.exists(icon_dir):
                themes['iconThemes'].extend(os.listdir(icon_dir))
        except Exception:
            pass

    # Get cursor themes
    cursor_dirs = [
        '/usr/share/icons',
        os.path.expanduser('~/.icons')
    ]
    for cursor_dir in cursor_dirs:
        try:
            if os.path.exists(cursor_dir):
                themes['cursorThemes'].extend([
                    theme for theme in os.listdir(cursor_dir)
                    if 'cursor' in theme.lower()
                ])
        except Exception:
            pass

    # Remove duplicates and sort
    themes['themes'] = sorted(set(themes['themes']))
    themes['iconThemes'] = sorted(set(themes['iconThemes']))
    themes['cursorThemes'] = sorted(set(themes['cursorThemes']))

    return themes

def get_system_info() -> Dict:
    """Get all system information."""
    # Define package categories
    categories = {
        "CORE_OS_UTILITIES": "waybar udiskie pavucontrol wttr hyprland hyprlock hypridle hyprpicker hyprcursor nwg-look yay flatpak pcmanfm lf engrampa xdg-desktop-portal-hyprland".split(),
        "EXTRA_UTILITIES": "btop neofetch bottles wine helvum wineasio latencyflex".split(),
        "WEB_BROWSERS": "brave qutebrowser".split(),
        "TEXT_EDITORS": "cursor neovim".split(),
        "LAUNCHERS": "steam lutris".split(),
        "APPLICATIONS": "spotify vesktop davinci-resolve touchdesigner".split()
    }

    # Get system information
    system_info = {
        "system": {
            "hostname": get_hostname(),
            "baseInstall": get_base_install(),
            "kernel": get_kernel(),
            "bootloader": get_bootloader(),
            "loginManager": get_login_manager(),
            **get_theme_info()
        },
        "users": get_users(),
        "drivers": {
            "graphics": get_graphics_driver(),
            "audio": get_audio_driver()
        },
        "packages": {
            category.lower(): get_packages_from_lists(packages)
            for category, packages in categories.items()
        },
        "themes": get_installed_themes()
    }

    # Add fonts to themes
    system_info["themes"]["fonts"] = get_installed_fonts()

    return system_info

@app.route('/api/system-info', methods=['GET'])
def system_info():
    """API endpoint to get system information."""
    try:
        return jsonify(get_system_info())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host='localhost', port=5000) 