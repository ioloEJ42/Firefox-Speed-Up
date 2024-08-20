let elements;
let newPlaybackRate = 1;

browser.runtime.onMessage.addListener(function (request) {
  switch (request.command) {
    case "speedUp025":
      return updateElementsPlaybackRate(0.25);
    case "slowDown025":
      return updateElementsPlaybackRate(-0.25);
  }
});

async function updateElementsPlaybackRate(changeValue, wasThisCalledOnPageLoad = false) {
  elements = document.querySelectorAll("video, audio");

  if (elements.length === 0) {
    return "";
  }

  if (wasThisCalledOnPageLoad) {
    newPlaybackRate = changeValue + 1;
  } else {
    const storageData = await browser.storage.local.get({ lastPlaybackRate: 1 });
    newPlaybackRate = storageData.lastPlaybackRate + changeValue;
  }

  newPlaybackRate = Math.max(0.25, Math.min(4, newPlaybackRate)); // Limit between 0.25x and 4x

  for (const element of elements) {
    element.playbackRate = newPlaybackRate;
  }

  if (!wasThisCalledOnPageLoad) {
    try {
      await browser.storage.local.set({ lastPlaybackRate: newPlaybackRate });
    } catch (error) {
      console.error("Error storing playback rate:", error);
    }
  }

  return newPlaybackRate.toFixed(2);
}

function init() {
  browser.storage.local.get({ selectedOption: "all" }).then(result => {
    if (result.selectedOption === "all") {
      browser.storage.local.get({ lastPlaybackRate: 1 }).then(data => {
        const lastPlaybackRate = data.lastPlaybackRate;
        if (lastPlaybackRate !== 1) {
          elements = document.querySelectorAll("video, audio");
          const hasPlaybackRateOne = Array.from(elements).some(element => element.playbackRate === 1);

          if (hasPlaybackRateOne) {
            const changePlaybackByRate = lastPlaybackRate - 1;
            updateElementsPlaybackRate(changePlaybackByRate, true).then(response => 
              browser.runtime.sendMessage({ command: "updateBadgeText", value: response })
            );
          }
        }
      });
    }
  });
  setTimeout(init, 1000);
}

init();