# Video Speed Controller

## Description

Video Speed Controller is a browser extension that allows users to control the playback speed of HTML5 videos and audio with keyboard shortcuts and customizable presets. It also supports automatic theme detection to match the user's system theme.

## Problem Statement

Many online video players do not provide sufficient controls for adjusting playback speed. Users often have to rely on the default speed options, which may not meet their needs. Additionally, there is a lack of seamless integration with system themes, leading to inconsistent user experiences.

## Solution

Video Speed Controller addresses these issues by providing a comprehensive set of controls for adjusting playback speed, including keyboard shortcuts and customizable presets. It also automatically detects and applies the user's system theme, ensuring a consistent and visually appealing experience.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/video-speed-controller.git
   ```
2. Navigate to the project directory:
   ```bash
   cd video-speed-controller
   ```
3. Load the extension in your browser:
   - **Chrome**:
     1. Go to `chrome://extensions/`
     2. Enable "Developer mode"
     3. Click "Load unpacked" and select the project directory
   - **Firefox**:
     1. Go to `about:debugging#/runtime/this-firefox`
     2. Click "Load Temporary Add-on"
     3. Select the `manifest.json` file in the project directory

## Usage

1. Click on the extension icon to open the popup.
2. Use the slider or preset buttons to adjust the playback speed.
3. Use the skip buttons to navigate through the video.
4. Toggle dark mode with the switch at the top of the popup.

### Keyboard Shortcuts

- **Ctrl+Shift+U (Windows/Linux) or Command+Shift+U (Mac):** Speed up video
- **Ctrl+Shift+Y (Windows/Linux) or Command+Shift+Y (Mac):** Slow down video

The current keyboard shortcuts are also displayed in the extension popup for easy reference.

## Features

- Control playback speed with keyboard shortcuts
- Customizable speed presets
- Automatic theme detection and application
- Dark mode support
- Easy-to-use popup interface
- Persistent settings across browser sessions
## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-branch
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m "Add new feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-branch
   ```
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

Made with <3 By Iolo Evans Jones
