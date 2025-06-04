# Arch Linux System Manager

A modern web application for managing and tracking your Arch Linux system configuration, packages, and themes. Built with React, TypeScript, and Node.js, featuring a Neovim-inspired theme.

## Features

- System Information Dashboard
  - Hostname, base install, kernel, and bootloader information
  - Graphics and audio driver management
  - User management
  - Theme and font tracking

- Package Management
  - Categorized package tracking
  - Installation status monitoring
  - Package installation script generation
  - Recently added packages view

- Theme Management
  - Track installed themes
  - Font management
  - Icon theme tracking
  - Cursor theme management

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- A modern web browser

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd LinuxSystemInstallTracker
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd server
   npm install
   cd ..
   ```

## Usage

1. Start the application using the provided script:
   ```bash
   ./start.sh
   ```
   This will:
   - Start the backend server on port 3000
   - Start the frontend development server on port 5173
   - Open your default browser to http://localhost:5173

2. To stop the application:
   - Press `Ctrl+C` in the terminal
   - The script will automatically shut down both servers

## Development

- Frontend development server: http://localhost:5173
- Backend API server: http://localhost:3000

### Available Scripts

- `npm run dev` - Start the frontend development server
- `npm run build` - Build the frontend for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview the production build

## Project Structure

```
LinuxSystemInstallTracker/
├── src/                    # Frontend source code
│   ├── components/        # React components
│   ├── context/          # React context providers
│   ├── pages/            # Page components
│   ├── services/         # API services
│   └── types/            # TypeScript type definitions
├── server/               # Backend server code
│   └── index.js         # Server entry point
├── package.json         # Frontend dependencies
├── start.sh            # Startup script
└── README.md           # This file
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by Neovim's color scheme
- Built with React and TypeScript
- Uses Tailwind CSS for styling
- Lucide React for icons 