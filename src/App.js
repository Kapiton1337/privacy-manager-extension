import React, { useState } from 'react';
import './App.css';
import ProxySettings from "./Components/ProxySettings";
import Blocker from "./Components/Blocker";
import UserAgentSetter from "./Components/UserAgentSetter";
import CookiesManager from "./Components/CookiesManager";
import CanvasDefenderToggle from "./Components/CanvasDefenderToggle";
import PersonalInfoScanner from "./Components/PersonalInfo";
import EtagToggle from "./Components/EtagToggle"; // Импортируем новый компонент

function App() {
    const [activeTab, setActiveTab] = useState('proxy');

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'proxy':
                return <ProxySettings />;
            case 'blocker':
                return <Blocker />;
            case 'userAgent':
                return <UserAgentSetter />;
            case 'cookies':
                return <CookiesManager domainPattern="" />;
            case 'canvas':
                return <CanvasDefenderToggle />;
            case 'personalInfo':
                return <PersonalInfoScanner />;
            case 'etag':
                return <EtagToggle />;
            default:
                return <div>Select a tab</div>;
        }
    };

    return (
        <div className="App">
            <div className="tabs">
                <button onClick={() => setActiveTab('proxy')}>Proxy Settings</button>
                <button onClick={() => setActiveTab('blocker')}>Blocker</button>
                <button onClick={() => setActiveTab('userAgent')}>User Agent Setter</button>
                <button onClick={() => setActiveTab('cookies')}>Cookies Manager</button>
                <button onClick={() => setActiveTab('canvas')}>Canvas Defender</button>
                <button onClick={() => setActiveTab('personalInfo')}>Personal Info Scanner</button>
                <button onClick={() => setActiveTab('etag')}>Etag defender</button>
            </div>
            <div className="content">
                {renderActiveTab()}
            </div>
        </div>
    );
}

export default App;
