import {app, authenticateToken, requirePermission} from "../../backend.js";

app.get('/api/auth/users', authenticateToken, requirePermission('can_create_users'), (req, res) => {
    const users = app.db.prepare('SELECT id, username, can_modify_vpn, can_delete, can_create_users, can_view_admin FROM users').all();
    res.json({ users });
});