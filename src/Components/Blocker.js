/*global chrome*/
import React, { useState, useEffect } from 'react';

const Blocker = () => {
    const [isBlockingEnabled, setIsBlockingEnabled] = useState(false);
    const [urls, setUrls] = useState([]);

    useEffect(() => {
        // Загрузка состояния блокировки и списка URL при монтировании компонента
        chrome.storage.sync.get(['isBlockingEnabled', 'maliciousUrls'], function(result) {
            setIsBlockingEnabled(result.isBlockingEnabled || false);
            setUrls(result.maliciousUrls || []);
        });
    }, []);

    const toggleBlocking = () => {
        const newBlockingState = !isBlockingEnabled;
        setIsBlockingEnabled(newBlockingState);
        chrome.storage.sync.set({ isBlockingEnabled: newBlockingState });
        // Отправка сообщения в фоновый скрипт для включения/отключения блокировки
        chrome.runtime.sendMessage({ action: "toggleBlocking", state: newBlockingState });
    };

    return (
        <div>
            <h2>URL Blocker</h2>
            <button onClick={toggleBlocking}>
                {isBlockingEnabled ? 'Отключить блокировку' : 'Включить блокировку'}
            </button>
            <h3>Blocked URLs:</h3>
            <ul>
                {urls.map((url, index) => (
                    <li key={index}>{url}</li>
                ))}
            </ul>
        </div>
    );
};

export default Blocker;