import rateLimit from "express-rate-limit";
import {app} from "../../backend.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 3,
    message: { error: 'Too many login attempts, try again later' }
});


app.post('/auth/login', [loginLimiter], (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

    const user = app.db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    if (!user.can_view_admin) return res.status(403).json({ error: 'Access denied' });

    const permissions = {
        can_manage_vpn: !!user.can_manage_vpn,
        can_manage_file: !!user.can_manage_file,
        can_create_users: !!user.can_create_users,
        can_view_admin: !!user.can_view_admin,
    };

    const token = jwt.sign(
        { id: user.id, username: user.username, permissions },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '8h' }
    );

    const accessToken = jwt.sign(
        { id: user.id, username: user.username, permissions },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
        { id: user.id },
        process.env.JWT_REFRESH_SECRET_KEY,
        { expiresIn: '7d' }
    );

    res.cookie('admin_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000
    });

    res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.json({ permissions, user: { id: user.id, username: user.username }});
});