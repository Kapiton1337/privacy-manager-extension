/*global chrome*/

import React, { useState, useEffect } from 'react';

const EtagToggle = () => {
    const [isProtectionEnabled, setIsProtectionEnabled] = useState(false);

    useEffect(() => {
        // Загрузите сохраненное состояние защиты при инициализации компонента
        chrome.storage.local.get(['etagProtectionEnabled'], function(result) {
            setIsProtectionEnabled(result.etagProtectionEnabled || false);
        });
    }, []);

    const toggleProtection = () => {
        const newProtectionState = !isProtectionEnabled;
        setIsProtectionEnabled(newProtectionState);

        // Сохраняем новое состояние в chrome.storage и отправляем сообщение в фоновый скрипт
        chrome.storage.local.set({ etagProtectionEnabled: newProtectionState }, function() {
            chrome.runtime.sendMessage({ action: "toggleEtagProtection", enable: newProtectionState });
        });
    };

    return (
        <div>
            <h1>eTag Protection</h1>
            <button onClick={toggleProtection}>
                {isProtectionEnabled ? 'Disable' : 'Enable'} eTag Protection
            </button>
        </div>
    );
};

export default EtagToggle;
