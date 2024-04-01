/*global chrome*/

import React, { useState, useEffect } from 'react';

const UserAgentSetter = () => {
    const [userAgent, setUserAgent] = useState('');

    useEffect(() => {
        // При монтировании компонента получаем текущий User-Agent из хранилища
        chrome.storage.sync.get(['userAgent'], function(result) {
            setUserAgent(result.userAgent || '');
        });
    }, []);

    const handleChange = (event) => {
        setUserAgent(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Сохраняем User-Agent в хранилище расширения
        chrome.storage.sync.set({userAgent}, () => {
            console.log('User-Agent updated to', userAgent);
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="user-agent">User-Agent:</label>
            <input
                id="user-agent"
                type="text"
                value={userAgent}
                onChange={handleChange}
            />
            <button type="submit">Save</button>
        </form>
    );
};

export default UserAgentSetter;
