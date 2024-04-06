/*global chrome*/
let isBlockingEnabled = false;
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get(['isBlockingEnabled'], function(result) {
        isBlockingEnabled = result.isBlockingEnabled || false;
    });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "toggleBlocking") {
        isBlockingEnabled = request.state;
        chrome.storage.sync.set({isBlockingEnabled: isBlockingEnabled});
        sendResponse({status: 'success', isBlockingEnabled: isBlockingEnabled});
    }
    return true;
});

chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        if (isBlockingEnabled && new RegExp("google\\.com", 'i').test(details.url)) {
            return {cancel: true};
        }
    },
    {urls: ["<all_urls>"]},
    ["blocking"]
);