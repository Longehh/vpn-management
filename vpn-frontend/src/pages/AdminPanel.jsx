import React, {useEffect, useState} from 'react';
import {Box, Button, CircularProgress, Tab, Tabs, Typography} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import {logout, verifyToken} from "../api/APICalls";
import LoginPage from "./LoginPage";
import UsersTab from "./tabs/UsersTab";
import {Link} from "react-router-dom";
import VPNTab from "./tabs/VPNTab";
import CopyTab from "./tabs/CopyTab";

// ── Main Panel ────────────────────────────────────────────────────
function AdminPanelContent({permissions, currentUser, onLogout}) {
    const [tab, setTab] = useState(0);

    return (
        <Box sx={{minHeight: '100vh', backgroundColor: '#111', p: {xs: 2, sm: 4}}}>
            {/* Header */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
                maxWidth: 900,
                mx: 'auto'
            }}>
                <Typography
                    component={Link}
                    to="/"
                    sx={{
                        fontFamily: "'Alatsi', sans-serif",
                        fontSize: '1.25rem',
                        letterSpacing: '0.12em',
                        color: '#fff',
                        textDecoration: 'none',
                        '& span': {
                            background: 'linear-gradient(90deg, #2770e6, #06285e)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        },
                    }}
                >
                    Azura<span>X</span>
                </Typography>
                <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                    <Typography
                        sx={{color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', fontFamily: "'Alatsi', sans-serif"}}>
                        {currentUser?.username}
                    </Typography>
                    <Button onClick={onLogout} startIcon={<LogoutIcon/>}
                            sx={{
                                color: 'rgba(255,255,255,0.5)',
                                '&:hover': {color: '#fff'},
                                fontFamily: "'Alatsi', sans-serif"
                            }}>
                        Logout
                    </Button>
                </Box>
            </Box>

            {/* Tabs */}
            <Box sx={{maxWidth: 900, mx: 'auto'}}>
                <Tabs
                    value={tab}
                    onChange={(_, v) => setTab(v)}
                    sx={{
                        mb: 3,
                        borderBottom: '1px solid rgba(255,255,255,0.08)',
                        '& .MuiTab-root': {
                            color: 'rgba(255,255,255,0.4)',
                            fontFamily: "'Alatsi', sans-serif",
                            fontSize: '0.8rem'
                        },
                        '& .Mui-selected': {color: '#fff !important'},
                        '& .MuiTabs-indicator': {backgroundColor: 'rgb(54,118,213)'},
                    }}
                >
                    <Tab label="VPN"/>
                    {permissions.can_view_admin && <Tab label="Copy"/>}
                    {permissions.can_create_users && <Tab label="Users"/>}
                </Tabs>

                {tab === 0 && <VPNTab permissions={permissions} />}
                {tab === 1 && <CopyTab permissions={permissions} />}
                {tab === 2 && permissions.can_create_users && <UsersTab currentUserId={currentUser?.id}/>}
            </Box>
        </Box>
    );
}

// ── Root Component ────────────────────────────────────────────────
export default function AdminPanel() {
    const [authenticated, setAuthenticated] = useState(false);
    const [checking, setChecking] = useState(true);
    const [permissions, setPermissions] = useState({});
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        verifyToken()
            .then(res => res.ok ? res.json() : Promise.reject())
            .then(data => {
                console.log(data);
                setAuthenticated(true);
                setPermissions(data.permissions);
                setCurrentUser(data.user);
            })
            .catch(() => setAuthenticated(false))
            .finally(() => setChecking(false));
    }, []);

    if (checking) {
        return (
            <Box sx={{
                minHeight: '100vh',
                backgroundColor: '#111',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <CircularProgress sx={{color: '#3643d5'}}/>
            </Box>
        );
    }

    if (!authenticated) {
        return <LoginPage onLogin={(perms, user) => {
            setAuthenticated(true);
            setPermissions(perms);
            setCurrentUser(user);
        }}/>;
    }

    return (
        <AdminPanelContent
            permissions={permissions}
            currentUser={currentUser}
            onLogout={async () => {
                await logout();
                setAuthenticated(false);
                setPermissions({});
                setCurrentUser(null);
            }}
        />
    );
}