import {app, authenticateToken, requirePermission} from "../../backend.js";
import bcrypt from "bcryptjs";

app.post('/auth/create-user', authenticateToken, requirePermission('can_create_users'), (req, res) => {
    const { username, password, permissions } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
    if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });

    const existing = app.db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    if (existing) return res.status(409).json({ error: 'Username already exists' });

    const hashed = bcrypt.hashSync(password, 10);
    app.db.prepare(`
        INSERT INTO users (username, password, can_modify_vpn, can_delete, can_create_users, can_view_admin)
        VALUES (?, ?, ?, ?, ?, ?)
    `).run(
        username, hashed,
        permissions.can_modify_vpn ? 1 : 0,
        permissions.can_delete ? 1 : 0,
        permissions.can_create_users ? 1 : 0,
        permissions.can_view_admin ? 1 : 0,
    );

    res.json({ success: true });
});