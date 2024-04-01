/*global chrome*/
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getCookies") {
        console.log("cookies");
        // Получаем все куки
        chrome.cookies.getAll({}, function (allCookies) {
            let filteredCookies = allCookies;
            // Фильтруем куки по домену, если задан шаблон
            if (request.domainPattern) {
                const regex = new RegExp(request.domainPattern);
                filteredCookies = allCookies.filter(cookie => regex.test(cookie.domain));
            }
            console.log(filteredCookies); // Выводим отфильтрованные куки
            sendResponse({cookies: filteredCookies});
        });
        return true;  // Указывает, что ответ будет асинхронным.
    } else if (request.action === "deleteCookie") {
        chrome.cookies.remove({url: request.url, name: request.name}, function (details) {
            console.log(`Cookie ${request.name} deleted`);
            sendResponse({status: "success", details: details});
        });
        return true;
    } else if (request.action === "deleteAllCookies") {
        // Удаление всех кук, соответствующих фильтру
        chrome.cookies.getAll({}, function (allCookies) {
            if (request.domainPattern) {
                const regex = new RegExp(request.domainPattern);
                allCookies.filter(cookie => regex.test(cookie.domain))
                    .forEach(cookie => {
                        let url = `http${cookie.secure ? 's' : ''}://${cookie.domain}${cookie.path}`;
                        chrome.cookies.remove({url: url, name: cookie.name});
                    });
            }
            sendResponse({status: "success"});
        });
        return true;
    } else if (request.action === "editCookie") {
        const details = {
            url: request.url,
            name: request.name,
            value: request.value,
            domain: request.domain,
            path: request.path,
            secure: request.secure,
            httpOnly: request.httpOnly,
            sameSite: request.sameSite,
            expirationDate: request.expirationDate
        };
        chrome.cookies.set(details, function (cookie) {
            console.log(`Cookie ${request.name} updated`, cookie);
            sendResponse({status: "success", cookie: cookie});
        });
        return true;  // Указывает, что ответ будет асинхронным.
    } else if (request.action === "setProxy") {
        chrome.proxy.settings.set({
            value: {
                mode: "fixed_servers",
                rules: {
                    singleProxy: {
                        scheme: "http",
                        host: request.proxyHost,
                        port: parseInt(request.proxyPort)
                    }
                }
            },
            scope: 'regular'
        }, () => {
            console.log(`Proxy set to ${request.proxyHost}:${request.proxyPort}`);
            sendResponse({status: 'Proxy is set'});
        });

        return true; // Указывает на асинхронный ответ.
    } else if (request.action === "disableProxy") {
        chrome.proxy.settings.clear({}, () => {
            // Удаляем сохраненные настройки прокси из chrome.storage
            chrome.storage.sync.remove(['proxyHost', 'proxyPort'], () => {
                console.log('Proxy settings removed from storage.');
                sendResponse({status: 'Proxy is disabled'});
            });
        });

        return true; // Указывает на асинхронный ответ.
    }
});

