# Video Speed Controller

**Video Speed Controller** is a browser extension that enhances your video watching experience by providing easy-to-use controls for adjusting playback speed and navigating through videos.

## Features

- **Speed Control:** Adjust video playback speed from 0.1x to 4x.
- **Speed Presets:** Quickly set speed to 0.5x, 1x, 1.5x, or 2x with preset buttons.
- **Keyboard Shortcuts:** Use keyboard shortcuts to speed up or slow down videos.
- **Skip Intervals:** Jump forward or backward in the video by 5 or 10 seconds.
- **Dark Mode:** Toggle between light and dark themes for the extension popup.
- **Persistent Settings:** Your speed settings are remembered across browser sessions.
- **Multiple Video Support:** Works with HTML5 video and audio elements across various websites.

## Installation

1. Download the extension files or clone this repository.
2. Open your Firefox browser and navigate to `about:debugging`.
3. Click on "This Firefox" in the left sidebar.
4. Click on "Load Temporary Add-on" and select the `manifest.json` file from the extension directory.

## Usage

### Popup Controls

- Click on the extension icon to open the popup.
- Use the slider or preset buttons to adjust the playback speed.
- Use the skip buttons to navigate through the video.
- Toggle dark mode with the switch at the top of the popup.

### Keyboard Shortcuts

- **Ctrl+Shift+U (Windows/Linux) or Command+Shift+U (Mac):** Speed up video
- **Ctrl+Shift+Y (Windows/Linux) or Command+Shift+Y (Mac):** Slow down video

The current keyboard shortcuts are also displayed in the extension popup for easy reference.

## Customization

You can customize the keyboard shortcuts:

1. Go to `about:addons` in Firefox.
2. Click on the gear icon and select "Manage Extension Shortcuts".
3. Find "Video Speed Controller" and set your preferred shortcuts.

## Development

To modify or extend this extension:

1. Clone this repository.
2. Make your changes to the relevant files (`manifest.json`, `background.js`, `content.js`, `settings.html`, `settings.js`).
3. Test your changes by loading the extension as a temporary add-on in Firefox.
4. Update the version number in `manifest.json` if you're planning to distribute your modified version.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the `LICENSE.md` file for details.

Made with <3 By Iolo Evans Jones