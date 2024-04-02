/*global chrome*/let currentUserAgent = "default";
chrome.runtime.onInstalled.addListener(() => {
    updateUserAgent();
});

function updateUserAgent() {
    chrome.storage.sync.get(['userAgent'], function(result) {
        currentUserAgent = result.userAgent || "default";
    });
}

chrome.webRequest.onBeforeSendHeaders.addListener(
    (details) => {
        const requestHeaders = details.requestHeaders.filter(header => header.name.toLowerCase() !== 'user-agent');
        requestHeaders.push({name: "User-Agent", value: currentUserAgent});
        return {requestHeaders};
    },
    {urls: ["<all_urls>"]},
    ["blocking", "requestHeaders"]
);
