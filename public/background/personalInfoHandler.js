/*global chrome*/

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "scanPage") {
        // Если sender.tab определён, используйте его ID
        if (sender.tab && sender.tab.id) {
            chrome.tabs.executeScript(sender.tab.id, { file: "scripts/PersonalInfoScanner.js" });
        } else {
            // В противном случае, найдите активную вкладку и используйте её ID
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                if (tabs.length === 0) return; // Вкладка не найдена
                var activeTab = tabs[0];
                chrome.tabs.executeScript(activeTab.id, { file: "scripts/PersonalInfoScanner.js" });
            });
        }
    }
});

