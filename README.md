# Color Tool

A modern web application for color extraction and palette generation, built with React, TypeScript, and Vite. Featuring a sleek, dark, tech-inspired UI with smooth animations and 3D backgrounds.

This tool offers two main features: extracting colors from images and generating color palettes.

## Features

### 1. Image Color Extractor
- **Effortless Input**: Extract colors from any image by simply pasting it (Ctrl+V / ⌘+V) directly onto the page.
- **Dominant Color Analysis**: Automatically identifies and displays the most prominent colors in the image.
- **Multiple Formats**: Copy extracted color codes in HEX, RGB, or HSL format with a single click.
- **Interactive Visualization**: Features an engaging 3D background powered by Spline.

### 2. Color Palette Generator
- **Harmonious Palettes**: Generates various color palettes (e.g., complementary, analogous, monochromatic) based on your selected color.
- **Interactive Picker**: Use the intuitive color picker to choose your base color with real-time previews.
- **Format Flexibility**: View and copy palette colors in HEX, RGB, or HSL.
- **Smooth Experience**: Includes a separate 3D background and seamless transitions.

## Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: UnoCSS, TailwindCSS
- **Animation**: Framer Motion
- **3D Rendering**: Spline (@splinetool/react-spline)
- **Notifications**: React Hot Toast
- **Build Tool**: Vite
- **Package Manager**: pnpm (recommended), npm

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- pnpm (or npm)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [repository-url] # Replace [repository-url] with the actual URL
    cd color-tool
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```
    *(If using npm, run `npm install`)*

3.  **Start the development server:**
    ```bash
    pnpm dev
    ```
    *(If using npm, run `npm run dev`)*

The application will typically be available at `http://localhost:5173`.

## Usage Guide

### Extracting Colors from an Image
1.  Navigate to the **Image Color Extractor** section from the home page.
2.  Copy an image to your clipboard (e.g., from a website or file explorer).
3.  Paste the image onto the extractor page (Ctrl+V / ⌘+V).
4.  The dominant colors will be displayed.
5.  Click on any color swatch to copy its code (format depends on the selected option).

### Generating Color Palettes
1.  Navigate to the **Color Palettes** section from the home page.
2.  Use the color picker at the top to select a base color.
3.  The generated palettes (Monochromatic, Analogous, etc.) will update automatically.
4.  Choose your desired output format (HEX, RGB, HSL).
5.  Click on any color swatch within the palettes to copy its code in the selected format.

## Development

### Project Structure
```plaintext
src/
├── App.tsx             # Main application component with routing
├── main.tsx            # Application entry point
├── index.css           # Global styles
├── App.css             # App-specific styles
├── components/         # Reusable UI components (ColorPicker, Palettes, etc.)
├── pages/              # Page components (HomePage, ExtractorPage, PalettePage)
├── utils/              # Utility functions (LoadingContext, colorUtils)
└── assets/             # Static assets (Spline scenes, SVGs)
public/                 # Public assets
.eslintrc.js           # ESLint configuration
.gitignore             # Git ignore rules
package.json           # Project metadata and dependencies
pnpm-lock.yaml         # Exact dependency versions
README.md              # This file
tsconfig.json          # TypeScript base configuration
tsconfig.app.json      # TypeScript app configuration
tsconfig.node.json     # TypeScript node configuration
vite.config.ts         # Vite configuration
uno.config.ts          # UnoCSS configuration
```

### Building for Production

To create an optimized production build:
```bash
pnpm build
```
*(If using npm, run `npm run build`)*

This command bundles the application and outputs the static files to the `dist/` directory.

## License

This project is licensed under the MIT License. Feel free to use, modify, and distribute it for personal or commercial purposes.
