/*global chrome*/
import React, {useEffect, useState} from 'react';

function CanvasDefenderToggle() {
    const [isEnabled, setIsEnabled] = useState(false);

    useEffect(() => {
        // При монтировании компонента загружаем сохраненное состояние
        chrome.storage.sync.get(['canvasDefenderEnabled'], function(result) {
            if (result.canvasDefenderEnabled !== undefined) {
                setIsEnabled(result.canvasDefenderEnabled);
            }
        });
    }, []);

    const toggleCanvasDefender = () => {
        const newIsEnabled = !isEnabled;
        setIsEnabled(newIsEnabled);
        // Сохраняем новое состояние в chrome.storage
        chrome.storage.sync.set({'canvasDefenderEnabled': newIsEnabled});

        // Отправляем сообщение в фоновый скрипт для включения/отключения защиты
        chrome.runtime.sendMessage({action: "toggleCanvasDefender", isEnabled: newIsEnabled});
    };

    return (
        <div>
            <button onClick={toggleCanvasDefender}>
                {isEnabled ? 'Disable' : 'Enable'} Canvas Defender
            </button>
        </div>
    );
}

export default CanvasDefenderToggle;
