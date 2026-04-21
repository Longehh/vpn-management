import React from 'react';
import {BrowserRouter as Router, Route, Routes, useLocation} from 'react-router-dom';
import {Container, CssBaseline, ThemeProvider} from '@mui/material';
import theme from './theme';
import AdminPanel from "./pages/AdminPanel";
import LoginPage from "./pages/LoginPage";

function AppContent() {
    return (
        <Container component="main" maxWidth={false} disableGutters>
            <Routes>
                <Route path="/" element={<LoginPage/>}/>
            </Routes>
        </Container>
    );
}

export default function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Router>
                <AppContent />
            </Router>
        </ThemeProvider>
    );
}
