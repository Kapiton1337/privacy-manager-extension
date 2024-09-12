/*global chrome*/

import React, { useEffect, useState } from 'react';

function DefenderToggle() {
    const [isCanvasEnabled, setIsCanvasEnabled] = useState(false);
    const [isWebGLEnabled, setIsWebGLEnabled] = useState(false);

    useEffect(() => {
        // Загружаем сохраненное состояние для обеих защит при монтировании компонента
        chrome.storage.sync.get(['canvasDefenderEnabled', 'webglDefenderEnabled'], function(result) {
            if (result.canvasDefenderEnabled !== undefined) {
                setIsCanvasEnabled(result.canvasDefenderEnabled);
            }
            if (result.webglDefenderEnabled !== undefined) {
                setIsWebGLEnabled(result.webglDefenderEnabled);
            }
        });
    }, []);

    const toggleCanvasDefender = () => {
        const newIsEnabled = !isCanvasEnabled;
        setIsCanvasEnabled(newIsEnabled);
        // Сохраняем новое состояние для защиты Canvas
        chrome.storage.sync.set({'canvasDefenderEnabled': newIsEnabled});
        // Отправляем сообщение в фоновый скрипт для включения/отключения защиты Canvas
        chrome.runtime.sendMessage({action: "toggleCanvasDefender", isEnabled: newIsEnabled});
    };

    const toggleWebGLDefender = () => {
        const newIsEnabled = !isWebGLEnabled;
        setIsWebGLEnabled(newIsEnabled);
        // Сохраняем новое состояние для защиты WebGL
        chrome.storage.sync.set({'webglDefenderEnabled': newIsEnabled});
        // Отправляем сообщение в фоновый скрипт для включения/отключения защиты WebGL
        chrome.runtime.sendMessage({action: "toggleWebGLDefender", isEnabled: newIsEnabled});
    };

    return (
        <div>
            <div>
                <button onClick={toggleCanvasDefender}>
                    {isCanvasEnabled ? 'Disable' : 'Enable'} Canvas Defender
                </button>
            </div>
            <div>
                <button onClick={toggleWebGLDefender}>
                    {isWebGLEnabled ? 'Disable' : 'Enable'} WebGL Defender
                </button>
            </div>
        </div>
    );
}

export default DefenderToggle;
