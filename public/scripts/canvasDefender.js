/*global chrome*/
(function() {
    console.log("Canvas Defender script loaded.");
    const createElement = document.createElement.bind(document);
    document.createElement = function(tagName, options) {
        const element = createElement(tagName, options);

        if (tagName.toLowerCase() === 'canvas') {
            const getContext = element.getContext.bind(element);

            element.getContext = function(contextType, contextAttributes) {
                const context = getContext(contextType, contextAttributes);

                if (contextType === '2d') {
                    const originalFillRect = context.fillRect;
                    context.fillRect = function(x, y, w, h) {
                        const noise = 0.2; // Уровень шума
                        originalFillRect.apply(this, [x, y, w * noise, h * noise]);
                        originalFillRect.apply(this, arguments);

                        // Отправка сообщения в фоновый скрипт
                        chrome.runtime.sendMessage({action: "canvasFingerprintDetected"});
                    };
                }

                return context;
            };
        }

        return element;
    };
})();
