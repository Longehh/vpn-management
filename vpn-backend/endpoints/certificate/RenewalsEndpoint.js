import {app, authenticateToken, requirePermission} from "../../backend.js";

app.get('/renewals', (req, res) => {
    const renewals = app.db.prepare('SELECT * FROM renewals').all();
    res.json({renewals});
});