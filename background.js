browser.commands.onCommand.addListener(function (command) {
    if (command == "video-speed-up") {
      sendCommandToContentScript("speedUp025");
    } else if (command == "video-speed-down") {
      sendCommandToContentScript("slowDown025");
    }
  });
  
  browser.runtime.onMessage.addListener(function (request) {
    if (request.command === "updateBadgeText") {
      let { value, tabId } = request;
      if (tabId == "currentTab") {
        browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
          tabId = tabs[0].id;
        });
      }
      setIconBadgeTextFromValue(tabId, value);
    }
  });
  
  function sendCommandToContentScript(commandName) {
    browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
      sendMessageToContentScript(tabs[0].id, { command: commandName })
        .then(response => setIconBadgeTextFromValue(tabs[0].id, response));
    });
  }
  
  function setIconBadgeTextFromValue(tabId, value) {
    browser.browserAction.setBadgeText({ text: value ? value.toString() + 'x' : '', tabId: tabId });
  }
  
  function sendMessageToContentScript(tabId, message) {
    return browser.tabs.sendMessage(tabId, message)
      .then(response => response)
      .catch(error => console.error("Error sending message to content script:", error));
  }