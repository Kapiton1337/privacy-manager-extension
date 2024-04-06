/*global chrome*/

import React, {useState, useEffect} from 'react';
import './PersonalInfo.css';

function PersonalInfo() {
    const [foundInfo, setFoundInfo] = useState([]);

    useEffect(() => {
        const handleMessage = (request, sender, sendResponse) => {
            if (request.action === "foundInfo") {
                const newInfo = [];
                if (request.data.phoneNumbers) newInfo.push(...request.data.phoneNumbers);
                if (request.data.birthDates) newInfo.push(...request.data.birthDates);
                if (request.data.bankCards) newInfo.push(...request.data.bankCards);

                setFoundInfo(prevFoundInfo => [...prevFoundInfo, ...newInfo]);
            }
        };

        chrome.runtime.onMessage.addListener(handleMessage);

        // Очистка слушателя при размонтировании компонента
        return () => chrome.runtime.onMessage.removeListener(handleMessage);
    }, []);

    const handleScanPage = () => {
        chrome.runtime.sendMessage({action: "scanPage"});
    };

    return (
        <div className="personal-info">
            <button className="scan-btn" onClick={handleScanPage}>
                Scan Page for Personal Information
            </button>
            {foundInfo.length > 0 ? (
                <div className="info-list-container">
                    <ul className="info-list">
                        {foundInfo.map((info, index) => (
                            <li key={index} className="info-item">
                                {info}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p className="no-info">No personal information detected or scan not yet performed.</p>
            )}
        </div>
    );
}

export default PersonalInfo;
