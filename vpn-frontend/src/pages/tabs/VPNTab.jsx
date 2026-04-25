import React, {useEffect, useState} from "react";
import {createVPN, deleteVPN, getVPNS} from "../../api/APICalls";
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
import {DOWNLOAD_VPN} from "../../api/APIConstants";

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

export default function VPNTab({permissions}) {
    const [vpns, setVPNS] = useState([]);
    const [client, setClient] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchVPNS();
    }, []);

    async function fetchVPNS() {
        try {
            const res = await getVPNS();
            setVPNS(res.clients || []);
        } catch {
            setError('Failed to load VPNS');
        }
    }

    async function handleCreateVPN(e) {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            const res = await createVPN(JSON.stringify({client}));
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to create user');
            setSuccess(`User "${client}" created successfully!`);

            window.location.href = `${DOWNLOAD_VPN}${client}`;
            setClient('');
            fetchVPNS();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteVPN(id) {
        try {
            const res = await deleteVPN(id);
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to delete user');
            fetchVPNS();
        } catch (err) {
            setError(err.message);
        }
    }

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
                CREATE NEW VPN
            </Typography>
            <Card sx={{background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', mb: 4}}>
                <CardContent sx={{p: 3}}>
                    <Box component="form" onSubmit={handleCreateVPN}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12}>
                                <TextField fullWidth label="Client" value={client}
                                           onChange={e => setClient(e.target.value)}
                                           sx={inputSx} required/>
                            </Grid>
                            <Grid item xs={12}>
                                {error && <Typography
                                    sx={{color: '#d53636', fontSize: '0.85rem', mb: 1}}>{error}</Typography>}
                                {success && (
                                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: '#4caf50'}}>
                                        <CheckCircleIcon fontSize="small"/>
                                        <Typography sx={{fontSize: '0.85rem'}}>{success}</Typography>
                                    </Box>
                                )}
                                <Button type="submit" variant="contained" disabled={loading}
                                        startIcon={<PersonAddIcon/>} sx={{...redBtnSx, py: 1}}>
                                    {loading ? <CircularProgress size={20} sx={{color: '#fff'}}/> : 'CREATE VPN'}
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </CardContent>
            </Card>

            {/* VPN List */}
            <Typography sx={{
                color: 'rgba(255,255,255,0.4)',
                fontFamily: "'Alatsi', sans-serif",
                fontSize: '0.8rem',
                mb: 2,
                letterSpacing: '0.1em'
            }}>
                EXISTING VPNS ({vpns.length})
            </Typography>
            <Box sx={{display: 'flex', flexDirection: 'column', gap: 1.5}}>
                {vpns.map(vpn => (
                    <Box key={vpn.id} sx={{
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
                                {vpn.name}
                            </Typography>
                        </Box>
                        <IconButton onClick={() => handleDeleteVPN(vpn.id)}
                                    sx={{
                                        color: '#d53636',
                                        '&:hover': {backgroundColor: 'rgba(213,54,54,0.1)'},
                                        p: 0.5
                                    }}>
                            <DeleteIcon fontSize="small"/>
                        </IconButton>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}