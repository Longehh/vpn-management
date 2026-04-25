import {app, authenticateToken} from "../../backend.js";

app.get('/auth/verify', authenticateToken, (req, res) => {
    const user = app.db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
    if (!user) return res.status(401).json({ error: 'User not found' });

    const permissions = {
        can_manage_vpn: !!user.can_manage_vpn,
        can_manage_file: !!user.can_manage_file,
        can_create_users: !!user.can_create_users,
        can_view_admin: !!user.can_view_admin,
    };

    res.json({ valid: true, user: { id: user.id, username: user.username }, permissions });
});