/*global chrome*/
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getCookies") {
        chrome.cookies.getAll({}, function (allCookies) {
            let filteredCookies = request.domainPattern ? allCookies.filter(cookie => new RegExp(request.domainPattern).test(cookie.domain)) : allCookies;
            sendResponse({cookies: filteredCookies});
        });
        return true;
    } else if (request.action === "deleteCookie") {
        chrome.cookies.remove({url: request.url, name: request.name}, function (details) {
            sendResponse({status: "success", details: details});
        });
        return true;
    } else if (request.action === "deleteAllCookies") {
        chrome.cookies.getAll({}, function (allCookies) {
            allCookies.filter(cookie => request.domainPattern ? new RegExp(request.domainPattern).test(cookie.domain) : true)
                .forEach(cookie => {
                    chrome.cookies.remove({url: `http${cookie.secure ? 's' : ''}://${cookie.domain}${cookie.path}`, name: cookie.name});
                });
            sendResponse({status: "success"});
        });
        return true;
    } else if (request.action === "editCookie") {
        chrome.cookies.set({...request, url: request.url}, function (cookie) {
            sendResponse({status: "success", cookie: cookie});
        });
        return true;
    }
});
