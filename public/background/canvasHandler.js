/*global chrome*/

let defenderActivated = false;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "canvasFingerprintDetected") {
        // Вывод оповещения пользователю
        chrome.notifications.create({
            type: 'basic',
            title: 'Внимание!',
            message: 'Обнаружена попытка получения отпечатка холста.'
        });
    } else if (message.action === "toggleCanvasDefender") {
        // Сохраняем состояние активации защиты холста
        chrome.storage.sync.set({'canvasDefenderEnabled': message.isEnabled}, () => {
            console.log(`Canvas Defender ${message.isEnabled ? "enabled" : "disabled"}.`);
            checkAndApplyCanvasDefender();
        });
    }
});

chrome.runtime.onStartup.addListener(checkAndApplyCanvasDefender);
chrome.runtime.onInstalled.addListener(checkAndApplyCanvasDefender);

async function checkAndApplyCanvasDefender() {
    try {
        let { canvasDefenderEnabled } = await chrome.storage.sync.get(['canvasDefenderEnabled']);
        if (canvasDefenderEnabled) {
            enableCanvasDefender();
        } else {
            console.log("Canvas Defender is currently disabled by the user.");
            defenderActivated = false;
        }
    } catch (error) {
        console.error("Error checking Canvas Defender state:", error);
    }
}



function enableCanvasDefender() {
    if (!defenderActivated) {
        chrome.webNavigation.onCommitted.addListener((details) => {
            chrome.tabs.executeScript(details.tabId, {
                file: 'scripts/canvasDefender.js',
                runAt: 'document_start'
            });
        }, {url: [{urlMatches: 'http://*/*'}, {urlMatches: 'https://*/*'}]});
        console.log("Canvas Defender has been enabled and will protect your canvas data.");
        defenderActivated = true;
    }
}
