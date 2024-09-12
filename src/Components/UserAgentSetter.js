/*global chrome*/

import React, { useState, useEffect } from 'react';

const Settings = () => {
    const [userAgent, setUserAgent] = useState('');
    const [language, setLanguage] = useState('');

    useEffect(() => {
        // При монтировании компонента получаем текущие настройки из хранилища
        chrome.storage.sync.get(['userAgent', 'language'], function(result) {
            if (result.userAgent) {
                setUserAgent(result.userAgent);
            }
            if (result.language) {
                setLanguage(result.language);
            }
        });
    }, []);

    const handleUserAgentChange = (event) => {
        setUserAgent(event.target.value);
    };

    const handleLanguageChange = (event) => {
        setLanguage(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Сохраняем User-Agent и язык в хранилище расширения
        chrome.storage.sync.set({ userAgent, language }, () => {
            console.log('Settings updated', { userAgent, language });
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="user-agent">User-Agent:</label>
                <input
                    id="user-agent"
                    type="text"
                    value={userAgent}
                    onChange={handleUserAgentChange}
                />
            </div>
            <div>
                <label htmlFor="language">Language:</label>
                <input
                    id="language"
                    type="text"
                    value={language}
                    onChange={handleLanguageChange}
                />
            </div>
            <button type="submit">Save</button>
        </form>
    );
};

export default Settings;
