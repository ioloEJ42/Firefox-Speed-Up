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
  } else if (request.command === "captureScreenshot") {
    captureScreenshot(sender.tab.id).then(sendResponse);
    return true;  // Will respond asynchronously
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

function captureScreenshot(tabId) {
  console.log("Capturing screenshot for tab:", tabId);
  return browser.tabs.captureVisibleTab(tabId, { format: "png" })
    .then(dataUrl => {
      const timestamp = new Date().toISOString().replace(/:/g, "-");
      return browser.downloads.download({
        url: dataUrl,
        filename: `screenshot-${timestamp}.png`,
        saveAs: true
      });
    });
}

// Load settings from storage on startup
browser.storage.local.get('speedStep').then(result => {
  if (!result.speedStep) {
    console.log("Setting default speedStep");
    browser.storage.local.set({ speedStep: 0.25 });
  } else {
    console.log("Loaded speedStep from storage:", result.speedStep);
  }
});