/*global chrome*/
import React, { useEffect, useState } from 'react';
import ProxySettings from "./Components/ProxySettings";
import './App.css';
import Blocker from "./Components/Blocker";
import UserAgentSetter from "./Components/UserAgentSetter";

function App() {
    const [cookies, setCookies] = useState([]);
    const [domainPattern, setDomainPattern] = useState('');
    const [editingCookie, setEditingCookie] = useState(null);

    useEffect(() => {
        fetchCookies();
    }, []);

    const fetchCookies = () => {
        chrome.runtime.sendMessage({action: "getCookies", domainPattern}, (response) => {
            setCookies(response.cookies.map(cookie => ({ name: cookie.name, value: cookie.value, domain: cookie.domain, secure: cookie.secure, path: cookie.path })));
        });
    };

    const deleteCookie = (cookie) => {
        let url = `http${cookie.secure ? 's' : ''}://${cookie.domain}${cookie.path}`;
        chrome.runtime.sendMessage({action: "deleteCookie", name: cookie.name, url: url}, fetchCookies);
    };

    const deleteAllCookies = () => {
        chrome.runtime.sendMessage({action: "deleteAllCookies", domainPattern}, fetchCookies);
    };

    const editCookie = (cookie) => {
        // Функция для начала редактирования куки
        setEditingCookie({...cookie});
    };

    const handleEditChange = (e) => {
        // Обновляем значения редактируемой куки
        setEditingCookie({...editingCookie, [e.target.name]: e.target.value});
    };

    const saveCookie = () => {
        // Отправляем изменения в фоновый скрипт
        chrome.runtime.sendMessage({
            action: "editCookie",
            ...editingCookie,
            url: `http${editingCookie.secure ? 's' : ''}://${editingCookie.domain}${editingCookie.path}`
        }, response => {
            if (response.status === "success") {
                setEditingCookie(null); // Скрываем форму редактирования
                fetchCookies(); // Обновляем список кук
            }
        });
    };

    return (
        <div className="App">
            <ProxySettings />
            <Blocker />
            <UserAgentSetter />
            <h1>Cookies List</h1>
            {/* Интерфейс для поиска и удаления кук */}
            {editingCookie && (
                <div>
                    <h2>Editing Cookie: {editingCookie.name}</h2>
                    <input type="text" name="value" value={editingCookie.value} onChange={handleEditChange} />
                    <button onClick={saveCookie}>Save</button>
                </div>
            )}
            <ul>
                {cookies.map((cookie, index) => (
                    <li key={index}>
                        {cookie.name}: {cookie.value}
                        <button onClick={() => editCookie(cookie)}>Edit</button>
                        <button onClick={() => deleteCookie(cookie)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;