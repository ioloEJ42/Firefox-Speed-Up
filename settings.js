function detectSystemTheme() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

document.addEventListener("DOMContentLoaded", function () {
  const darkModeToggle = document.getElementById("darkModeToggle");
  const body = document.body;
  const speedSlider = document.getElementById("speedSlider");
  const speedValue = document.getElementById("speedValue");
  const presetButtons = document.querySelectorAll(".preset-button");
  const skipButtons = document.querySelectorAll(".skip-button");
  const shortcutsList = document.getElementById("shortcutsList");

  // Load and apply dark mode setting
  browser.storage.local.get("darkMode").then((result) => {
    const storedDarkMode = result.darkMode;
    if (storedDarkMode === undefined) {
      // If no stored preference, use system preference
      setTheme(detectSystemTheme());
    } else {
      // Use stored preference
      setTheme(storedDarkMode);
    }
  });

  // Function to set the theme
  function setTheme(isDark) {
    document.body.classList.toggle('dark-mode', isDark);
    darkModeToggle.checked = isDark;
    browser.storage.local.set({ darkMode: isDark });
  }

  // Dark mode toggle functionality
  darkModeToggle.addEventListener("change", function () {
    setTheme(this.checked);
  });

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addListener(function(e) {
    setTheme(e.matches);
  });

  // Speed slider functionality
  speedSlider.addEventListener("input", function () {
    const speed = parseFloat(this.value);
    updateSpeedDisplay(speed);
    sendMessageToActiveTab({ command: "setSpeed", speed: speed });
  });

  // Speed preset buttons functionality
  presetButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const speed = parseFloat(this.dataset.speed);
      updateSpeedDisplay(speed);
      sendMessageToActiveTab({ command: "setSpeed", speed: speed });
    });
  });

  // Skip interval buttons functionality
  skipButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const interval = parseInt(this.dataset.skip);
      sendMessageToActiveTab({ command: "skipInterval", interval: interval });
    });
  });

  // Function to send message to active tab
  function sendMessageToActiveTab(message) {
    browser.tabs
      .query({ active: true, currentWindow: true })
      .then((tabs) => {
        if (tabs[0]) {
          return browser.tabs.sendMessage(tabs[0].id, message);
        }
      })
      .then((response) => {
        if (response) {
          console.log("Response from content script:", response);
          updateSpeedDisplay(response);
          updateBadgeText(response);
        }
      })
      .catch((error) => {
        console.error("Error sending message to content script:", error);
      });
  }

  // Function to update speed display
  function updateSpeedDisplay(speed) {
    speedSlider.value = speed;
    speedValue.textContent = speed.toFixed(2) + "x";
  }

  // Function to update badge text
  function updateBadgeText(speed) {
    browser.runtime.sendMessage({
      command: "updateBadgeText",
      value: speed.toFixed(2),
    });
  }

  // Load current speed from storage and update display
  browser.storage.local.get("currentSpeed").then((result) => {
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
  document.getElementById("speedPresetsTitle").textContent =
    browser.i18n.getMessage("speedPresetsTitle");
  document.getElementById("speedControlTitle").textContent =
    browser.i18n.getMessage("speedControlTitle");
  document.getElementById("skipIntervalTitle").textContent =
    browser.i18n.getMessage("skipIntervalTitle");
  document.getElementById("keyboardShortcutsTitle").textContent =
    browser.i18n.getMessage("keyboardShortcutsTitle");

  // Display keyboard shortcuts
  browser.commands.getAll().then((commands) => {
    const shortcutsList = document.getElementById("shortcutsList");
    shortcutsList.innerHTML = ""; // Clear existing content

    commands.forEach((command) => {
      const li = document.createElement("li");
      let description;

      if (command.name === "video-speed-up") {
        description = browser.i18n.getMessage("speedUpPlayback");
      } else if (command.name === "video-speed-down") {
        description = browser.i18n.getMessage("slowDownPlayback");
      } else {
        description = command.description; // Fallback to default description
      }

      li.innerHTML = `<span class="shortcut-key">${
        command.shortcut || "Not set"
      }</span> ${description}`;
      shortcutsList.appendChild(li);
    });
  });

  // Add this listener for theme update messages
  browser.runtime.onMessage.addListener((message) => {
    if (message.action === "updateTheme") {
      setTheme(message.isDark);
    }
  });
});
