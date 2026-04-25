import {Box, Button, Typography} from "@mui/material";
import AzuraX from "../assets/images/AzuraX.png"
import LogoutIcon from "@mui/icons-material/Logout";

export default function SideBar({ currentUser, activeTab, onTabChange, permissions, onLogout}) {
    const navItems = [
        {label: 'Home', index: 0, show: true},
        {label: 'VPN', index: 1, show: !!permissions.can_manage_vpn},
        {label: 'File Management', index: 2, show: !!permissions.can_manage_file},
        {label: 'User Management', index: 3, show: !!permissions.can_create_users}
    ].filter(item => item.show);

    return (
        <Box sx={{
            width: 260,
            minWidth: 260,
            minHeight: '100vh',
            background: 'linear-gradient(180deg, #0a2260 0%, #0d2a7a 60%, #0a1f5c 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            py: 4,
            position: 'sticky',
            top: 0,
            height: '100vh',
            boxShadow: '4px 0 24px rgba(0,0,0,0.4)',
        }}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
                <img src={AzuraX}  alt={"AzuraX"} width={120} height={120}/>
                <Typography
                    sx={{
                        fontFamily: "'Alatsi', sans-serif",
                        fontSize: '0.6rem',
                        letterSpacing: '0.2em',
                        color: 'rgba(255,255,255,0.45)',
                        mt: 0.5,
                        textTransform: 'uppercase',
                    }}
                >
                    Server Management
                </Typography>
            </Box>

            <Box sx={{ width: '60%', height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', mb: 5, mx: 'auto' }} />

            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1,
                    width: '100%',
                }}
            >
                {navItems.map((item) => {
                    const isActive = activeTab === item.index;
                    return (
                        <Box
                            key={item.index}
                            onClick={() => onTabChange(item.index)}
                            sx={{
                                width: '100%',
                                textAlign: 'center',
                                py: 1.5,
                                cursor: 'pointer',
                                position: 'relative',
                                transition: 'all 0.2s ease',
                                '&:hover .nav-label': {
                                    color: '#fff',
                                },
                                '&:hover .nav-indicator': {
                                    opacity: 0.5,
                                },
                            }}
                        >
                            {/* Active indicator bar */}
                            {isActive && (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        left: 0,
                                        top: '20%',
                                        height: '60%',
                                        width: 3,
                                        backgroundColor: '#38aaff',
                                        borderRadius: '0 2px 2px 0',
                                    }}
                                />
                            )}
                            <Typography
                                className="nav-label"
                                sx={{
                                    fontFamily: "'Alatsi', sans-serif",
                                    fontSize: '0.75rem',
                                    letterSpacing: '0.18em',
                                    textTransform: 'uppercase',
                                    color: isActive ? '#fff' : 'rgba(255,255,255,0.45)',
                                    fontWeight: isActive ? 600 : 400,
                                    transition: 'color 0.2s ease',
                                }}
                            >
                                {item.label}
                            </Typography>
                        </Box>
                    );
                })}
            </Box>
            <Box
                sx={{
                    width: '100%',
                    px: 3,
                    pt: 3,
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <Typography
                    sx={{
                        fontFamily: "'Alatsi', sans-serif",
                        fontSize: '0.8rem',
                        color: 'rgba(255,255,255,0.8)',
                        letterSpacing: '0.05em',
                    }}
                >
                    {currentUser?.username}
                </Typography>
                <Button
                    onClick={onLogout}
                    startIcon={<LogoutIcon sx={{ fontSize: '0.9rem !important' }} />}
                    size="small"
                    variant="outlined"
                    sx={{
                        fontFamily: "'Alatsi', sans-serif",
                        fontSize: '0.65rem',
                        letterSpacing: '0.1em',
                        color: 'rgba(255,255,255,0.6)',
                        borderColor: 'rgba(255,255,255,0.2)',
                        px: 1.5,
                        py: 0.5,
                        minWidth: 0,
                        '&:hover': {
                            borderColor: 'rgba(255,255,255,0.5)',
                            color: '#fff',
                            backgroundColor: 'rgba(255,255,255,0.05)',
                        },
                    }}
                >
                    Logout
                </Button>
            </Box>
        </Box>
    )
}