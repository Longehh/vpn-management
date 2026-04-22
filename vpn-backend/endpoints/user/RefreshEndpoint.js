import rateLimit from "express-rate-limit";
import {app} from "../../backend.js";
import jwt from "jsonwebtoken";
app.post('/auth/refresh', (req, res) => {
    const token = req.cookies.refresh_token;
    console.log(token);
    if (!token) return res.status(401).json({ error: 'No refresh token' });

    jwt.verify(token, process.env.JWT_REFRESH_SECRET_KEY, (err, decoded) => {
        console.log(err);
        if (err) return res.status(403).json({ error: 'Invalid or expired refresh token' });

        const user = app.db.prepare('SELECT * FROM users WHERE id = ?').get(decoded.id);
        if (!user) return res.status(403).json({ error: 'User not found' });

        const permissions = {
            can_modify_vpn: !!user.can_modify_vpn,
            can_delete: !!user.can_delete,
            can_create_users: !!user.can_create_users,
            can_view_admin: !!user.can_view_admin,
        };

        const newAccessToken = jwt.sign(
            { id: user.id, username: user.username, permissions },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '15m' }
        );

        res.cookie('admin_token', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000
        });

        res.json({ permissions });
    });
});