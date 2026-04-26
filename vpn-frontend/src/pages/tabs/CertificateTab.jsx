import React, {useEffect, useState} from "react";
import {getRenewals, renew} from "../../api/APICalls";
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
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import DeleteIcon from "@mui/icons-material/Delete";
import {DOWNLOAD_VPN} from "../../api/APIConstants";
import RenewalsTable from "../../components/RenewalsTable";

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

export default function CertificateTab({permissions}) {
    const [renewals, setRenewals] = useState([]);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingRenewals, setLoadingRenewals] = useState(true);

    useEffect(() => {
        fetchRenewals();
    }, []);

    async function fetchRenewals() {
        try {
            const res = await getRenewals();
            setRenewals(res.renewals || []);
            setLoadingRenewals(false);
        } catch {
            setError('Failed to load VPNS');
        }
    }

    async function handleRenewCertificate(e) {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            const res = await renew();
            if (!res.success) throw new Error(res.output);
            setSuccess(`Certificate renewed successfully.`);
            fetchRenewals();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
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
                RENEW CERTIFICATE
            </Typography>
            <Card sx={{background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', mb: 4}}>
                <CardContent sx={{p: 3}}>
                    <Box component="form" onSubmit={handleRenewCertificate}>
                        <Grid container spacing={2}>
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
                                        startIcon={<CardMembershipIcon/>} sx={{...redBtnSx, py: 1}}>
                                    {loading ? <CircularProgress size={20} sx={{color: '#fff'}}/> : 'RENEW CERTIFICATE'}
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </CardContent>
            </Card>

            {loadingRenewals ? <CircularProgress size={20} sx={{color: '#fff'}}/> :
                <>
                    <Typography sx={{
                        color: 'rgba(255,255,255,0.4)',
                        fontFamily: "'Alatsi', sans-serif",
                        fontSize: '0.8rem',
                        mb: 2,
                        letterSpacing: '0.1em'
                    }}>
                        RENEWALS ({renewals.length})
                    </Typography>
                    <Box sx={{display: 'flex', flexDirection: 'column', gap: 1.5}}>
                        <RenewalsTable data={renewals}/>
                    </Box>
                </>
            }
        </Box>
    );
}