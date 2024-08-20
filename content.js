let currentSpeed = 1.0;
let speedStep = 0.25;

browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("Message received in content script:", request);
  switch (request.command) {
    case "speedUp":
      console.log("Speeding up");
      return changeSpeed(speedStep);
    case "slowDown":
      console.log("Slowing down");
      return changeSpeed(-speedStep);
    case "setSpeed":
      console.log("Setting speed to:", request.speed);
      return setSpeed(request.speed);
    case "skipInterval":
      console.log("Skipping interval:", request.interval);
      return skipInterval(request.interval);
    case "getCurrentSpeed":
      console.log("Getting current speed:", currentSpeed);
      return Promise.resolve(currentSpeed);
  }
});

function changeSpeed(step) {
  console.log("Changing speed by step:", step);
  const videos = document.querySelectorAll("video, audio");
  if (videos.length === 0) {
    console.log("No video or audio elements found");
    return Promise.resolve(currentSpeed);
  }

  currentSpeed = Math.max(0.1, Math.min(currentSpeed + step, 16.0));
  console.log("New speed:", currentSpeed);
  
  for (let video of videos) {
    video.playbackRate = currentSpeed;
  }

  updateBadgeAndStorage();
  return Promise.resolve(currentSpeed);
}

function setSpeed(speed) {
  console.log("Setting speed to:", speed);
  const videos = document.querySelectorAll("video, audio");
  if (videos.length === 0) {
    console.log("No video or audio elements found");
    return Promise.resolve(currentSpeed);
  }

  currentSpeed = Math.max(0.1, Math.min(speed, 16.0));
  console.log("New speed:", currentSpeed);
  
  for (let video of videos) {
    video.playbackRate = currentSpeed;
  }

  updateBadgeAndStorage();
  return Promise.resolve(currentSpeed);
}

function skipInterval(interval) {
  console.log("Skipping interval:", interval);
  const videos = document.querySelectorAll("video");
  if (videos.length === 0) {
    console.log("No video elements found");
    return Promise.resolve();
  }

  for (let video of videos) {
    video.currentTime += interval;
  }
  return Promise.resolve();
}

function updateBadgeAndStorage() {
  console.log("Updating badge and storage with speed:", currentSpeed);
  browser.runtime.sendMessage({
    command: "updateBadgeText",
    value: currentSpeed.toFixed(2)
  });
  browser.storage.local.set({ currentSpeed: currentSpeed });
}

// Load speed step and current speed from storage
browser.storage.local.get(['speedStep', 'currentSpeed']).then(result => {
  if (result.speedStep) {
    speedStep = result.speedStep;
    console.log("Loaded speedStep from storage:", speedStep);
  }
  if (result.currentSpeed) {
    setSpeed(result.currentSpeed);
    console.log("Loaded currentSpeed from storage:", result.currentSpeed);
  }
});

// Listen for changes to speed step
browser.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && changes.speedStep) {
    speedStep = changes.speedStep.newValue;
    console.log("SpeedStep updated:", speedStep);
  }
});

console.log("Content script loaded");