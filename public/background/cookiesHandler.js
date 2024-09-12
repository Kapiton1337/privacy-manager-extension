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
        // Создаем новый объект details для chrome.cookies.set,
        // копируем в него все свойства из request, кроме action.
        const cookieDetails = {
            url: request.url,
            name: request.name,
            value: request.value,
            domain: request.domain,
            path: request.path,
            secure: request.secure,
            httpOnly: request.httpOnly, // Если это свойство используется
            expirationDate: request.expirationDate, // Если это свойство используется
            // Добавьте другие свойства, используемые вашим расширением
        };

        chrome.cookies.set(cookieDetails, function(cookie) {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
                sendResponse({status: "error", message: chrome.runtime.lastError.message});
            } else {
                sendResponse({status: "success", cookie: cookie});
            }
        });
        return true; // Чтобы ответ мог быть асинхронным.
    }
});
