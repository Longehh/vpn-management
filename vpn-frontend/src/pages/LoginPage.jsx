// ── Login Page ────────────────────────────────────────────────────
import {Box, Button, Card, CardContent, CircularProgress, TextField, Typography} from "@mui/material";
import React, {useState} from "react";
import {login, setToken} from "../api/APICalls";
import {Link} from "react-router-dom";


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
    background: 'rgba(213,54,54,0.85)', borderRadius: '1px',
    fontFamily: "'Alatsi', sans-serif", fontWeight: 'bold',
    border: '1px solid rgb(237,65,65)',
    '&:hover': {background: 'rgba(213,54,54,1)'},
};

export default function LoginPage({onLogin}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleLogin(e) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await login(username, password);
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Login failed');
            onLogin(data.permissions, data.user);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Box sx={{
            minHeight: '100vh',
            backgroundColor: '#111',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: 2
        }}>
            <Card
                sx={{background: '#171717', border: '1px solid rgba(255,255,255,0.08)', width: '100%', maxWidth: 400}}>
                <CardContent sx={{p: {xs: 3, sm: 5}}}>
                    <Typography variant="h5"
                                sx={{fontFamily: "'Alatsi', sans-serif", color: '#fff', textAlign: 'center', mb: 1, '& span': {
                                        background: 'linear-gradient(90deg, #e62727, #5c0303)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                    }}}>
                        Azura<span>X</span>
                    </Typography>
                    <Typography sx={{color: 'rgba(255,255,255,0.5)', textAlign: 'center', fontSize: '0.85rem', mb: 4}}>
                        AzuraX — Staff Only
                    </Typography>
                    <Box component="form" onSubmit={handleLogin}>
                        <TextField fullWidth label="Username" value={username}
                                   onChange={e => setUsername(e.target.value)} sx={{...inputSx, mb: 2}} required/>
                        <TextField fullWidth label="Password" type="password" value={password}
                                   onChange={e => setPassword(e.target.value)} sx={{...inputSx, mb: 3}} required/>
                        {error && (
                            <Typography sx={{color: '#d53636', fontSize: '0.85rem', mb: 2, textAlign: 'center'}}>
                                {error}
                            </Typography>
                        )}
                        <Button type="submit" fullWidth variant="contained" disabled={loading}
                                sx={{...redBtnSx, py: 1.5}}>
                            {loading ? <CircularProgress size={22} sx={{color: '#fff'}}/> : 'LOGIN'}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}