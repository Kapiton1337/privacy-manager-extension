/*global chrome*/

let currentSettings = {
    userAgent: 'default',
    language: 'en-US,en;q=0.9' // Значение по умолчанию для языка
};

chrome.runtime.onInstalled.addListener(() => {
    updateSettings();
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (let key in changes) {
        if (key === 'userAgent' || key === 'language') {
            currentSettings[key] = changes[key].newValue;
        }
    }
});

function updateSettings() {
    chrome.storage.sync.get(['userAgent', 'language'], function (result) {
        currentSettings.userAgent = result.userAgent || currentSettings.userAgent;
        currentSettings.language = result.language || currentSettings.language;
    });
}

chrome.webRequest.onBeforeSendHeaders.addListener(
    function(details) {
        let headers = details.requestHeaders;
        // Удаляем существующие заголовки User-Agent и Accept-Language
        headers = headers.filter(header => !["User-Agent", "Accept-Language"].includes(header.name));
        // Добавляем наши заголовки
        headers.push({name: "User-Agent", value: currentSettings.userAgent});
        headers.push({name: "Accept-Language", value: currentSettings.language});
        return {requestHeaders: headers};
    },
    {urls: ["<all_urls>"]},
    ["blocking", "requestHeaders"]
);
