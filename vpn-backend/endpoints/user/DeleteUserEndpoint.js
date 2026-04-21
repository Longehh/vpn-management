import {app, authenticateToken, requirePermission} from "../../backend.js";

app.delete('/api/auth/users/:id', authenticateToken, requirePermission('can_create_users'), (req, res) => {
    const id = parseInt(req.params.id);
    if (id === req.user.id) return res.status(400).json({ error: "You can't delete yourself" });
    app.db.prepare('DELETE FROM users WHERE id = ?').run(id);
    res.json({ success: true });
});