/*global chrome*/

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.path === 'page-to-background') {
        if (request.method === 'fingerprint') {
            // Обработка сообщения от контент-скрипта
            console.log("Fingerprint attempt detected on", request.data.host);
            // Вы можете добавить сюда логику отправки уведомлений или других действий
        }
        sendResponse({status: "success"});
    }
});

