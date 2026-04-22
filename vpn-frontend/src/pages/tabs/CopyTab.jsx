import React, {useState} from "react";
import {copy} from "../../api/APICalls";
import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Grid,
    TextField,
    Typography
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FolderCopyIcon from '@mui/icons-material/FolderCopy';

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

export default function CopyTab({permissions}) {
    const [copyFile, setCopyFile] = useState('');
    const [copyFileInstance, setCopyFileInstance] = useState('')
    const [copyInstance, setCopyInstance] = useState('')
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);


    async function handleMoveFile(e) {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            const res = await copy(JSON.stringify({copyFile, copyFileInstance, copyInstance}));
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to create user');
            setSuccess(`File ${copyFile} moved successfully to instance ${copyInstance}!`);

            setCopyFile('');
            setCopyFileInstance('')
            setCopyInstance('')
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Box>
            {/* Copy Tab */}
            <Typography sx={{
                color: 'rgba(255,255,255,0.4)',
                fontFamily: "'Alatsi', sans-serif",
                fontSize: '0.8rem',
                mb: 2,
                letterSpacing: '0.1em'
            }}>
                COPY FILE
            </Typography>
            <Card sx={{background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', mb: 4}}>
                <CardContent sx={{p: 3}}>
                    <Box component="form" onSubmit={handleMoveFile}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="Copy File" value={copyFile}
                                           onChange={e => setCopyFile(e.target.value)}
                                           sx={inputSx} required/>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="Copy File Instance" value={copyFileInstance}
                                           onChange={e => setCopyFileInstance(e.target.value)}
                                           sx={inputSx} required/>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="Copy Instance" value={copyInstance}
                                           onChange={e => setCopyInstance(e.target.value)}
                                           sx={inputSx} required/>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography>
                                    Get the Server ID from the Settings tab on the panel. This is for Copy Instance & Copy File Instance.
                                </Typography>
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
                                        startIcon={<FolderCopyIcon/>} sx={{...redBtnSx, py: 1}}>
                                    {loading ? <CircularProgress size={20} sx={{color: '#fff'}}/> : 'COPY FILE'}
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}