function detectSystemTheme() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

browser.commands.onCommand.addListener(function (command) {
  console.log("Command received:", command);
  if (command === "video-speed-up") {
    console.log("Sending speedUp command to content script");
    sendCommandToContentScript("speedUp");
  } else if (command === "video-speed-down") {
    console.log("Sending slowDown command to content script");
    sendCommandToContentScript("slowDown");
  }
});

browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("Message received in background script:", request);
  if (request.command === "updateBadgeText") {
    let { value, tabId } = request;
    if (tabId === "currentTab") {
      browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
        tabId = tabs[0].id;
      });
    }
    setIconBadgeTextFromValue(tabId, value);
  }
});

function sendCommandToContentScript(commandName) {
  console.log("Sending command to content script:", commandName);
  browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
    sendMessageToContentScript(tabs[0].id, { command: commandName })
      .then(response => {
        console.log("Response from content script:", response);
        setIconBadgeTextFromValue(tabs[0].id, response.toFixed(2));
        browser.storage.local.set({ currentSpeed: response });
      })
      .catch(error => {
        console.error("Error in sendCommandToContentScript:", error);
      });
  });
}

function setIconBadgeTextFromValue(tabId, value) {
  console.log("Setting badge text:", value);
  browser.browserAction.setBadgeText({ text: value ? value.toString() + 'x' : '', tabId: tabId });
}

function sendMessageToContentScript(tabId, message) {
  console.log("Sending message to content script:", message);
  return browser.tabs.sendMessage(tabId, message)
    .then(response => {
      console.log("Response received from content script:", response);
      return response;
    })
    .catch(error => {
      console.error("Error sending message to content script:", error);
      throw error;
    });
}

// Add this event listener
browser.runtime.onInstalled.addListener(function(details) {
  if (details.reason === "install" || details.reason === "update") {
    browser.storage.local.get('darkMode').then(result => {
      if (result.darkMode === undefined) {
        const isDarkMode = detectSystemTheme();
        browser.storage.local.set({ darkMode: isDarkMode });
      }
    });
  }
});

// Load settings from storage on startup
browser.storage.local.get('speedStep').then(result => {
  if (!result.speedStep) {
    console.log("Setting default speedStep");
    browser.storage.local.set({ speedStep: 0.25 });
  } else {
    console.log("Loaded speedStep from storage:", result.speedStep);
  }
});

// Helper function to convert hex to RGB
function hexToRgb(hex) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})` : null;
}

// Listen for browser theme changes
browser.theme.onUpdated.addListener((updateInfo) => {
  // Check if the theme update includes changes to the colors
  if (updateInfo.theme && updateInfo.theme.colors) {
    // Determine if the new theme is dark based on the background color
    const bgColor = updateInfo.theme.colors.frame || updateInfo.theme.colors.accentcolor;
    if (bgColor) {
      // Convert the color to RGB if it's not already
      const rgb = bgColor.startsWith('rgb') ? bgColor : hexToRgb(bgColor);
      const [r, g, b] = rgb.match(/\d+/g).map(Number);
      
      // Calculate perceived brightness
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      
      // If brightness is less than 128, consider it a dark theme
      const isDark = brightness < 128;
      
      setTheme(isDark);
    }
  } else {
    // If no specific theme is set, fall back to system preference
    setTheme(isSystemDarkMode());
  }
});

function isSystemDarkMode() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function setTheme(isDark) {
  browser.storage.local.set({ darkMode: isDark });
  // Notify all open popups to update their theme
  browser.runtime.sendMessage({ action: "updateTheme", isDark: isDark });
}