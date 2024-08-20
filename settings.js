document.addEventListener("DOMContentLoaded", function () {
    browser.storage.local.get("selectedOption").then(function (result) {
        let selectedOption = result.selectedOption || "all";
        let applyAllRadio = document.getElementById("apply-all");
        let applyTabRadio = document.getElementById("apply-tab");

        if (selectedOption === "all") {
            applyAllRadio.checked = true;
        } else {
            applyTabRadio.checked = true;
        }
    });

    let applyAllRadio = document.getElementById("apply-all");
    let applyTabRadio = document.getElementById("apply-tab");

    applyAllRadio.addEventListener("change", function () {
        browser.storage.local.set({ selectedOption: "all" });
    });

    applyTabRadio.addEventListener("change", function () {
        browser.storage.local.set({ selectedOption: "tab" });
        browser.storage.local.remove('lastPlaybackRate');
    });

    browser.commands.getAll().then(function (commands) {
        let shortcutList = document.getElementById("shortcut-list");
        commands.forEach(function (command) {
            let listItem = document.createElement("li");
            listItem.textContent = `${command.description}: ${command.shortcut}`;
            shortcutList.appendChild(listItem);
        });
    });
});

document.getElementById('popupTitle').textContent = browser.i18n.getMessage('popupTitle');
document.getElementById('popupInfo').textContent = browser.i18n.getMessage('popupInfo');
document.getElementById('popup-apply-all-message').textContent = browser.i18n.getMessage('popup-apply-all-message');
document.getElementById('popup-apply-tab-message').textContent = browser.i18n.getMessage('popup-apply-tab-message');