/*global chrome*/
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "setProxy") {
        chrome.proxy.settings.set({value: {mode: "fixed_servers", rules: {singleProxy: {scheme: "http", host: request.proxyHost, port: parseInt(request.proxyPort)}}}, scope: 'regular'}, () => {
            sendResponse({status: 'Proxy is set'});
        });
        return true;
    } else if (request.action === "disableProxy") {
        chrome.proxy.settings.clear({}, () => {
            chrome.storage.sync.remove(['proxyHost', 'proxyPort'], () => {
                sendResponse({status: 'Proxy is disabled'});
            });
        });
        return true;
    }
});
