/*global chrome*/
import React, { useEffect, useState } from 'react';

function CookiesManager({ domainPattern }) {
    const [cookies, setCookies] = useState([]);
    const [editingCookie, setEditingCookie] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchCookies();
    }, [domainPattern]);

    const fetchCookies = () => {
        chrome.runtime.sendMessage({action: "getCookies", domainPattern}, (response) => {
            setCookies(response.cookies.map(cookie => ({
                name: cookie.name,
                value: cookie.value,
                domain: cookie.domain,
                secure: cookie.secure,
                path: cookie.path
            })));
        });
    };

    const deleteCookie = (cookie) => {
        let url = `http${cookie.secure ? 's' : ''}://${cookie.domain}${cookie.path}`;
        chrome.runtime.sendMessage({action: "deleteCookie", name: cookie.name, url: url}, fetchCookies);
    };

    const deleteAllCookiesBySearch = () => {
        chrome.runtime.sendMessage({action: "deleteAllCookies", domainPattern: searchQuery}, fetchCookies);
    };

    const editCookie = (cookie) => {
        setEditingCookie({...cookie});
    };

    const handleEditChange = (e) => {
        setEditingCookie({...editingCookie, [e.target.name]: e.target.value});
    };

    const saveCookie = () => {
        const cookieData = {
            ...editingCookie,
            url: `http${editingCookie.secure ? 's' : ''}://${editingCookie.domain}${editingCookie.path}`,
            secure: editingCookie.secure,
            httpOnly: editingCookie.httpOnly
        };

        console.log("Saving cookie:", cookieData);

        chrome.runtime.sendMessage({
            action: "editCookie",
            ...cookieData
        }, response => {
            console.log("Response:", response);
            if (response.status === "success") {
                setEditingCookie(null);
                fetchCookies();
            }
        });
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredCookies = cookies.filter(cookie => cookie.domain.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div>
            <h1>Cookies List</h1>
            <input type="text" placeholder="Search by domain..." value={searchQuery} onChange={handleSearchChange} />
            <button onClick={deleteAllCookiesBySearch}>Delete All By Search</button>
            {editingCookie && (
                <div>
                    <h2>Editing Cookie: {editingCookie.name}</h2>
                    <input type="text" name="value" value={editingCookie.value} onChange={handleEditChange} />
                    <button onClick={saveCookie}>Save</button>
                </div>
            )}
            <ul>
                {filteredCookies.map((cookie, index) => (
                    <li key={index}>
                        {cookie.name}: {cookie.value} ({cookie.domain})
                        <button onClick={() => editCookie(cookie)}>Edit</button>
                        <button onClick={() => deleteCookie(cookie)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CookiesManager;
