import {app, authenticateToken} from "../../backend.js";

app.get('/auth/verify', authenticateToken, (req, res) => {
    const user = app.db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
    if (!user) return res.status(401).json({ error: 'User not found' });

    const permissions = {
        can_modify_vpn: !!user.can_modify_vpn,
        can_delete: !!user.can_delete,
        can_create_users: !!user.can_create_users,
        can_view_admin: !!user.can_view_admin,
    };

    res.json({ valid: true, user: { id: user.id, username: user.username }, permissions });
});