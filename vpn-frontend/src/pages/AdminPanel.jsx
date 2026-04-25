import React, {useEffect, useState} from 'react';
import {Box, Button, CircularProgress, Tab, Tabs, Typography} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import {logout, verifyToken} from "../api/APICalls";
import LoginPage from "./LoginPage";
import UsersTab from "./tabs/UsersTab";
import {Link} from "react-router-dom";
import VPNTab from "./tabs/VPNTab";
import CopyTab from "./tabs/CopyTab";
import SideBar from "../components/SideBar";
import HomeTab from "./tabs/HomeTab";

// ── Main Panel ────────────────────────────────────────────────────
function AdminPanelContent({permissions, currentUser, onLogout}) {
    const [tab, setTab] = useState(0);
    const getTabContent = () => {
        if(tab === 0) return <HomeTab />
        if (tab === 1 && permissions.can_manage_vpn) return <VPNTab permissions={permissions} />;
        if (tab === 2 && permissions.can_manage_file) return <CopyTab permissions={permissions} />;
        if (tab === 3 && permissions.can_create_users) return <UsersTab currentUserId={currentUser?.id} />;
        return null;
    };
    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#111' }}>
            <SideBar
                currentUser={currentUser}
                activeTab={tab}
                onTabChange={setTab}
                permissions={permissions}
                onLogout={onLogout}
            />

            <Box
                sx={{
                    flex: 1,
                    p: { xs: 3, sm: 5 },
                    overflowY: 'auto',
                }}
            >
                {getTabContent()}
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
        const verify = async () => {
            try {
                const res = await verifyToken();
                if (res && res.ok) {
                    const data = await res.json();
                    setAuthenticated(true);
                    setPermissions(data.permissions);
                    setCurrentUser(data.user);
                } else {
                    setAuthenticated(false);
                }
            } catch (err) {
                setAuthenticated(false);
            } finally {
                setChecking(false);
            }
        };
        verify();
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