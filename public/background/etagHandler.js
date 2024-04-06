/*global chrome*/

let isEtagProtectionEnabled = false; // Переменная для отслеживания статуса защиты

// Слушаем изменения в хранилище и обновляем переменную состояния
chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (let key in changes) {
        if (key === 'etagProtectionEnabled') {
            const storageChange = changes[key];
            isEtagProtectionEnabled = storageChange.newValue;
            console.log(`eTag Protection is now ${isEtagProtectionEnabled ? 'enabled' : 'disabled'}.`);
        }
    }
});

// Инициализируем состояние защиты при запуске расширения
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get(['etagProtectionEnabled'], function(result) {
        isEtagProtectionEnabled = result.etagProtectionEnabled || false;
        console.log(`eTag Protection initialized as ${isEtagProtectionEnabled ? 'enabled' : 'disabled'}.`);
    });
});

// Обработка сообщения от попапа
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "toggleEtagProtection") {
        // Изменяем состояние защиты и сохраняем его в storage
        isEtagProtectionEnabled = message.enable;
        chrome.storage.local.set({ etagProtectionEnabled: isEtagProtectionEnabled }, () => {
            console.log(`eTag Protection is now ${isEtagProtectionEnabled ? 'enabled' : 'disabled'}.`);
            // Отправляем ответ обратно в попап, если это необходимо
            sendResponse({ status: isEtagProtectionEnabled });
        });

        // Возвращаем true, чтобы указать, что ответ будет асинхронным
        return true;
    }
});

// Удаление заголовков ETag из ответов сервера
chrome.webRequest.onHeadersReceived.addListener(
    (details) => {
        if (isEtagProtectionEnabled) {
            const responseHeaders = details.responseHeaders.filter(header => header.name.toLowerCase() !== 'etag');
            return { responseHeaders };
        }
    },
    { urls: ["<all_urls>"] },
    ["blocking", "responseHeaders"]
);
