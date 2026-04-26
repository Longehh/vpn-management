const {GET_USERS, CREATE_USER, DELETE_USER, LOGIN, VERIFY,
    REFRESH, LOGOUT, GET_VPNS, DELETE_VPN, CREATE_VPN, COPY, GET_STATS, GET_RENEWALS, CERTIFICATE_RENEWAL
} = require("./APIConstants");

// Stats

async function getStats() {
    const res = await fetchWithRefresh(GET_STATS);
    return await res.json();
}
// VPN
async function getVPNS() {
    const res = await fetchWithRefresh(GET_VPNS);
    return await res.json();
}

async function createVPN(body) {
    return await fetchWithRefresh(CREATE_VPN, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: body
    })
}

async function deleteVPN(id) {
    return await fetchWithRefresh(`${DELETE_VPN}${id}`, {
        method: 'DELETE',
    });
}

// COPY
async function copy(copyFile, copyFileInstance, copyInstance) {
    return await fetchWithRefresh(COPY, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({copyFile, copyFileInstance, copyInstance})
    })
}

async function login(username, password) {
    return await fetch(LOGIN, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, password}),
        credentials: 'include'
    });
}

async function getUsers() {
    const res = await fetchWithRefresh(GET_USERS);
    return await res.json();
}

async function createUser(body) {
    return await fetchWithRefresh(CREATE_USER, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: body
    })
}

async function deleteUser(id) {
    return await fetchWithRefresh(`${DELETE_USER}${id}`, {
        method: 'DELETE',
    });
}

async function verifyToken() {
    return await fetchWithRefresh(VERIFY, {
        credentials: 'include',
    });
}

async function fetchWithRefresh(url, options = {}) {
    let res = await fetch(url, { ...options, credentials: 'include' });
    if (res.status === 401) {
        const refreshRes = await fetch(REFRESH, {
            method: 'POST',
            credentials: 'include'
        });
        if (!refreshRes.ok) {
            return refreshRes;
        }
        res = await fetch(url, { ...options, credentials: 'include' });
    }

    return res;
}

async function logout() {
    return await fetch(LOGOUT, {
        method: 'POST',
        credentials: 'include'
    })
}

// Renewals
async function getRenewals() {
    const res = await fetchWithRefresh(GET_RENEWALS, {
        method: 'GET',
    });
    return await res.json();
}

async function renew() {
    const res = await fetchWithRefresh(CERTIFICATE_RENEWAL, {
        method: 'POST',
    });
    return await res.json();
}

module.exports = {
    getUsers, login, verifyToken, createUser, deleteUser, logout, getVPNS, createVPN, deleteVPN, copy, getStats, getRenewals, renew
}