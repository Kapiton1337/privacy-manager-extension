/*global chrome*/
import React, { useState, useEffect } from 'react';

const ProxySettings = () => {
    const [proxyHost, setProxyHost] = useState('');
    const [proxyPort, setProxyPort] = useState('');

    // Загрузка сохраненных настроек прокси при инициализации компонента
    useEffect(() => {
        loadProxySettings();
    }, []);

    const loadProxySettings = () => {
        // Используйте chrome.storage для загрузки сохраненных настроек
        chrome.storage.sync.get(['proxyHost', 'proxyPort'], function(result) {
            if (result.proxyHost) setProxyHost(result.proxyHost);
            if (result.proxyPort) setProxyPort(result.proxyPort);
        });
    };

    const setProxy = () => {
        // Сохранение настроек прокси в chrome.storage перед установкой
        chrome.storage.sync.set({
            proxyHost: proxyHost,
            proxyPort: proxyPort
        }, function() {
            console.log('Proxy settings saved.');
        });

        // Отправка сообщения в background script для установки прокси
        chrome.runtime.sendMessage({
            action: "setProxy",
            proxyHost: proxyHost,
            proxyPort: proxyPort
        }, response => {
            alert(response.status); // Отображаем статус установки прокси
        });
    };

    const disableProxy = () => {
        // Отправка сообщения в background script для отключения прокси
        chrome.runtime.sendMessage({
            action: "disableProxy"
        }, response => {
            if (response.status === 'Proxy is disabled') {
                // Удаление настроек прокси из хранилища
                chrome.storage.sync.remove(['proxyHost', 'proxyPort'], () => {
                    // Очистка полей ввода после успешного удаления настроек
                    setProxyHost('');
                    setProxyPort('');
                    alert('Прокси отключен и настройки удалены');
                });
            }
        });
    };


    return (
        <div>
            <h2>Proxy Settings</h2>
            <input
                type="text"
                placeholder="Proxy Host"
                value={proxyHost}
                onChange={(e) => setProxyHost(e.target.value)}
            />
            <input
                type="number"
                placeholder="Proxy Port"
                value={proxyPort}
                onChange={(e) => setProxyPort(e.target.value)}
            />
            <button onClick={setProxy}>Set Proxy</button>
            <button onClick={disableProxy}>Отключить Прокси</button>
        </div>
    );
};

export default ProxySettings;
