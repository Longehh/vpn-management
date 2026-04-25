import React, {useEffect, useState} from "react";
import {createUser, deleteUser, getUsers} from "../../api/APICalls";
import {
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    Chip,
    CircularProgress,
    FormControlLabel,
    Grid,
    IconButton,
    TextField,
    Typography
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DeleteIcon from "@mui/icons-material/Delete";

const inputSx = {
    '& .MuiOutlinedInput-root': {
        color: '#fff',
        backgroundColor: 'rgba(255,255,255,0.07)',
        '& fieldset': {borderColor: 'rgba(255,255,255,0.25)'},
        '&:hover fieldset': {borderColor: 'rgba(255,255,255,0.5)'},
        '&.Mui-focused fieldset': {borderColor: 'rgb(213,54,54)'},
    },
    '& .MuiInputLabel-root': {color: 'rgba(255,255,255,0.5)'},
    '& .MuiInputLabel-root.Mui-focused': {color: 'rgb(213,54,54)'},
    '& .MuiInputBase-input.MuiOutlinedInput-input': {
        '&:-webkit-autofill': {
            // Replace #121212 with your actual dark background hex code
            WebkitBoxShadow: '0 0 0 1000px #121212 inset !important',
            WebkitTextFillColor: '#fff !important',
            caretColor: '#fff !important',
        },
    },
};

const redBtnSx = {
    background: 'rgba(54,118,213,0.85)', borderRadius: '1px',
    fontFamily: "'Alatsi', sans-serif", fontWeight: 'bold',
    border: '1px solid rgb(54,118,213)',
    '&:hover': {background: 'rgba(54,118,213,1)'},
};

export default function UsersTab({currentUserId}) {
    const [users, setUsers] = useState([]);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [perms, setPerms] = useState({
        can_manage_vpn: false,
        can_manage_file: false,
        can_create_users: false,
        can_view_admin: true,
    });
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    async function fetchUsers() {
        try {
            const res = await getUsers();
            setUsers(res.users || []);
        } catch {
            setError('Failed to load users');
        }
    }

    async function handleCreateUser(e) {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            const res = await createUser(JSON.stringify({username, password, permissions: perms}));
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to create user');
            setSuccess(`User "${username}" created successfully!`);
            setUsername('');
            setPassword('');
            setPerms({can_manage_vpn: false, can_manage_file: false, can_create_users: false, can_view_admin: true});
            fetchUsers();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteUser(id) {
        try {
            const res = await deleteUser(id);
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to delete user');
            fetchUsers();
        } catch (err) {
            setError(err.message);
        }
    }

    const permLabels = {
        can_manage_vpn: 'VPN Management',
        can_manage_file: 'File Management',
        can_create_users: 'Create Users',
        can_view_admin: 'View Admin Panel',
    };

    return (
        <Box>
            {/* Create User Form */}
            <Typography sx={{
                color: 'rgba(255,255,255,0.4)',
                fontFamily: "'Alatsi', sans-serif",
                fontSize: '0.8rem',
                mb: 2,
                letterSpacing: '0.1em'
            }}>
                CREATE NEW USER
            </Typography>
            <Card sx={{background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', mb: 4}}>
                <CardContent sx={{p: 3}}>
                    <Box component="form" onSubmit={handleCreateUser}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="Username" value={username}
                                           onChange={e => setUsername(e.target.value)}
                                           sx={inputSx} required/>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="Password" type="password" value={password}
                                           onChange={e => setPassword(e.target.value)}
                                           sx={inputSx} required helperText="Min. 6 characters"
                                           FormHelperTextProps={{sx: {color: 'rgba(255,255,255,0.3)'}}}/>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography sx={{
                                    color: 'rgba(255,255,255,0.4)',
                                    fontSize: '0.8rem',
                                    mb: 1,
                                    fontFamily: "'Alatsi', sans-serif",
                                    letterSpacing: '0.08em'
                                }}>
                                    PERMISSIONS
                                </Typography>
                                <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1}}>
                                    {Object.entries(permLabels).map(([key, label]) => (
                                        <FormControlLabel
                                            key={key}
                                            control={
                                                <Checkbox
                                                    checked={perms[key]}
                                                    onChange={e => setPerms(p => ({...p, [key]: e.target.checked}))}
                                                    disabled={key === 'can_view_admin'}
                                                    sx={{
                                                        color: 'rgba(255,255,255,0.3)',
                                                        '&.Mui-checked': {color: 'rgb(54,110,213)'},
                                                    }}
                                                />
                                            }
                                            label={
                                                <Typography sx={{color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem'}}>
                                                    {label}
                                                </Typography>
                                            }
                                        />
                                    ))}
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                {error && <Typography
                                    sx={{color: '#3656d5', fontSize: '0.85rem', mb: 1}}>{error}</Typography>}
                                {success && (
                                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: '#4caf50'}}>
                                        <CheckCircleIcon fontSize="small"/>
                                        <Typography sx={{fontSize: '0.85rem'}}>{success}</Typography>
                                    </Box>
                                )}
                                <Button type="submit" variant="contained" disabled={loading}
                                        startIcon={<PersonAddIcon/>} sx={{...redBtnSx, py: 1}}>
                                    {loading ? <CircularProgress size={20} sx={{color: '#fff'}}/> : 'CREATE USER'}
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </CardContent>
            </Card>

            {/* User List */}
            <Typography sx={{
                color: 'rgba(255,255,255,0.4)',
                fontFamily: "'Alatsi', sans-serif",
                fontSize: '0.8rem',
                mb: 2,
                letterSpacing: '0.1em'
            }}>
                EXISTING USERS ({users.length})
            </Typography>
            <Box sx={{display: 'flex', flexDirection: 'column', gap: 1.5}}>
                {users.map(user => (
                    <Box key={user.id} sx={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        flexWrap: 'wrap', gap: 1,
                        backgroundColor: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 1, px: 2, py: 1.5,
                    }}>
                        <Box>
                            <Typography component="span" sx={{
                                color: '#fff',
                                fontFamily: "'Alatsi', sans-serif",
                                fontSize: '0.9rem',
                                mb: 0.5
                            }}>
                                {user.username}
                                {user.id === currentUserId && (
                                    <Chip label="YOU" size="small" sx={{
                                        ml: 1,
                                        height: 18,
                                        fontSize: '0.65rem',
                                        backgroundColor: 'rgba(54,75,213,0.3)',
                                        color: '#364bd5'
                                    }}/>
                                )}
                            </Typography>
                            <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                                {Object.entries(permLabels).map(([key, label]) =>
                                    user[key] ? (
                                        <Chip key={key} label={label} size="small" sx={{
                                            height: 20, fontSize: '0.65rem',
                                            backgroundColor: 'rgba(255,255,255,0.08)',
                                            color: 'rgba(255,255,255,0.6)',
                                        }}/>
                                    ) : null
                                )}
                            </Box>
                        </Box>
                        {user.id !== currentUserId && (
                            <IconButton onClick={() => handleDeleteUser(user.id)}
                                        sx={{
                                            color: '#3680d5',
                                            '&:hover': {backgroundColor: 'rgba(54,91,213,0.1)'},
                                            p: 0.5
                                        }}>
                                <DeleteIcon fontSize="small"/>
                            </IconButton>
                        )}
                    </Box>
                ))}
            </Box>
        </Box>
    );
}