import {Box, Card, CardContent, Grid, TextField, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import {getStats, getUsers} from "../../api/APICalls";

export default function HomeTab() {
    const [statistics, setStatistics] = useState(null);
    const [error, setError] = useState('');

    const STATS_CONFIG = [
        {
            label: 'RAM Usage',
            getValue: (s) => `${s.memory.used} / ${s.memory.total}`,
            bg: '#0d2a7a',
            border: '#1a4aaa'
        },
        {
            label: 'CPU Usage',
            getValue: (s) => `${s.cpu.usage}%`,
            bg: '#0a4a2a',
            border: '#1a8a4a'
        },
        {
            label: 'Disk Usage',
            getValue: (s) => `${s.disk.used} / ${s.disk.total}`,
            bg: '#4a1a0a',
            border: '#8a3a1a'
        },
    ];

    useEffect(() => {
        fetchStats();
    }, []);

    async function fetchStats() {
        try {
            const res = await getStats();
            setStatistics(res.statistics || []);
        } catch {
            setError('Failed to load stats');
        }
    }

    return (
        <Box>
            <Typography sx={{
                color: 'rgba(255,255,255,0.4)',
                fontFamily: "'Alatsi', sans-serif",
                fontSize: '0.8rem',
                mb: 2,
                letterSpacing: '0.1em'
            }}>
                HOME
            </Typography>

            <Card sx={{background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', mb: 4}}>
                <CardContent sx={{p: 3}}>
                    <Typography>
                        System Usage
                    </Typography>
                    <Grid container spacing={2} sx={{p: 4, textAlign: 'center'}}>
                        {STATS_CONFIG.map((stat) => (
                            <Grid item xs={12} sm={4} key={stat.label}>
                                <Box sx={{
                                    backgroundColor: stat.bg,
                                    border: `1px solid ${stat.border}`,
                                    borderRadius: 2,
                                    p: 2.5,
                                }}>
                                    <Typography sx={{
                                        fontFamily: "'Alatsi', sans-serif",
                                        fontSize: '0.7rem',
                                        letterSpacing: '0.15em',
                                        textTransform: 'uppercase',
                                        color: 'rgba(255,255,255,0.45)',
                                        mb: 1,
                                    }}>
                                        {stat.label}
                                    </Typography>
                                    <Typography sx={{
                                        fontFamily: "'Alatsi', sans-serif",
                                        fontSize: '1.5rem',
                                        color: '#fff',
                                        fontWeight: 600,
                                    }}>
                                        {statistics ? stat.getValue(statistics) : '???'}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </CardContent>
            </Card>

            <Card sx={{background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', mb: 4}}>
                <CardContent sx={{p: 3}}>
                    <Grid container spacing={2} sx={{p: 4}}>
                        <Grid item xs={12} sm={12} sx={{textAlign: 'center'}}>
                            <Typography sx={{fontSize: '1.5rem'}}>
                                Welcome to the AzuraX Server Management Panel
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={12} sx={{textAlign: 'center'}}>
                            <Box sx={{
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: 2,
                                p: 2.5,
                            }}>
                                <Typography sx={{fontSize: '1.5rem'}}>
                                    File Management FAQ
                                </Typography>
                                <Typography sx={{fontSize: '0.7rem'}}>
                                    The File Management Page is very useful especially for moving files from one instance to another.
                                </Typography>
                                <Box sx={{ width: '60%', height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', mb: 2, mt: 2, mx: 'auto' }} />
                                <Typography sx={{fontSize: '0.8rem'}}>
                                    1. Locate the file you wish to move (this must be a .zip or .tar.gz) If this is located in /plugins/ you must put plugins/(file) in Copy File.
                                </Typography>
                                <Typography sx={{fontSize: '0.8rem'}}>
                                    2. Then head to the Settings page of the instance the file is on and copy Server ID. This is your Copy File Instance.
                                </Typography>
                                <Typography sx={{fontSize: '0.8rem'}}>
                                    3. Then head to the Settings page of the instance you wish to copy the file too. And copy Server ID This will be Copy Instance.
                                </Typography>
                            </Box>

                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    )
}