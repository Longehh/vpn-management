import {app, authenticateToken, requirePermission} from "../../backend.js";

app.get('/auth/users', authenticateToken, requirePermission('can_create_users'), (req, res) => {
    const users = app.db.prepare('SELECT id, username, can_manage_vpn, can_manage_file, can_create_users, can_view_admin FROM users').all();
    res.json({ users });
});