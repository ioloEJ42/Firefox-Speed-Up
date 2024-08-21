document.addEventListener("DOMContentLoaded", function () {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    const speedSlider = document.getElementById('speedSlider');
    const speedValue = document.getElementById('speedValue');
    const presetButtons = document.querySelectorAll('.preset-button');
    const skipButtons = document.querySelectorAll('.skip-button');
    const shortcutsList = document.getElementById('shortcutsList');

    // Load and apply dark mode setting
    browser.storage.local.get('darkMode').then(result => {
        if (result.darkMode) {
            body.classList.add('dark-mode');
            darkModeToggle.checked = true;
        }
    });

    // Dark mode toggle functionality
    darkModeToggle.addEventListener('change', function() {
        body.classList.toggle('dark-mode');
        browser.storage.local.set({ darkMode: this.checked });
    });

    // Speed slider functionality
    speedSlider.addEventListener('input', function() {
        const speed = parseFloat(this.value);
        updateSpeedDisplay(speed);
        sendMessageToActiveTab({ command: "setSpeed", speed: speed });
    });

    // Speed preset buttons functionality
    presetButtons.forEach(button => {
        button.addEventListener('click', function() {
            const speed = parseFloat(this.dataset.speed);
            updateSpeedDisplay(speed);
            sendMessageToActiveTab({ command: "setSpeed", speed: speed });
        });
    });

    // Skip interval buttons functionality
    skipButtons.forEach(button => {
        button.addEventListener('click', function() {
            const interval = parseInt(this.dataset.skip);
            sendMessageToActiveTab({ command: "skipInterval", interval: interval });
        });
    });

    // Function to send message to active tab
    function sendMessageToActiveTab(message) {
        browser.tabs.query({ active: true, currentWindow: true })
            .then(tabs => {
                if (tabs[0]) {
                    return browser.tabs.sendMessage(tabs[0].id, message);
                }
            })
            .then(response => {
                if (response) {
                    console.log("Response from content script:", response);
                    updateSpeedDisplay(response);
                    updateBadgeText(response);
                }
            })
            .catch(error => {
                console.error("Error sending message to content script:", error);
            });
    }

    // Function to update speed display
    function updateSpeedDisplay(speed) {
        speedSlider.value = speed;
        speedValue.textContent = speed.toFixed(2) + 'x';
    }

    // Function to update badge text
    function updateBadgeText(speed) {
        browser.runtime.sendMessage({
            command: "updateBadgeText",
            value: speed.toFixed(2)
        });
    }

    // Load current speed from storage and update display
    browser.storage.local.get('currentSpeed').then(result => {
        if (result.currentSpeed) {
            updateSpeedDisplay(result.currentSpeed);
        }
    });

    // Listen for changes to current speed
    browser.storage.onChanged.addListener((changes, areaName) => {
        if (areaName === "local" && changes.currentSpeed) {
            updateSpeedDisplay(changes.currentSpeed.newValue);
        }
    });

    // Set localized strings
    document.getElementById('speedPresetsTitle').textContent = browser.i18n.getMessage('speedPresetsTitle');
    document.getElementById('speedControlTitle').textContent = browser.i18n.getMessage('speedControlTitle');
    document.getElementById('skipIntervalTitle').textContent = browser.i18n.getMessage('skipIntervalTitle');
    document.getElementById('keyboardShortcutsTitle').textContent = browser.i18n.getMessage('keyboardShortcutsTitle');

    // Display keyboard shortcuts
    browser.commands.getAll().then((commands) => {
        commands.forEach((command) => {
            const li = document.createElement('li');
            li.innerHTML = `<span class="shortcut-key">${command.shortcut || 'Not set'}</span>: ${command.description}`;
            shortcutsList.appendChild(li);
        });
    });
});