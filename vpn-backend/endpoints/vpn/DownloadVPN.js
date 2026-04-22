import {app, authenticateToken} from "../../backend.js";
import path from "path";
import fs from "fs";

app.get('/vpn/download/:client', authenticateToken, (req, res) => {
    try {
        const client = req.params.client;

        // Sanitize — prevent path traversal
        if (!client || /[^a-zA-Z0-9_\-]/.test(client)) {
            return res.status(400).json({ error: 'Invalid client name' });
        }

        // Check both /root and /home/<client>
        const possiblePaths = [
            `/root/${client}.zip`,
            `/home/${client}/${client}.zip`,
        ];

        const zipPath = possiblePaths.find(p => fs.existsSync(p));

        if (!zipPath) {
            return res.status(404).json({ error: 'VPN config file not found' });
        }

        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename="${client}.zip"`);
        fs.createReadStream(zipPath).pipe(res);

    } catch (error) {
        console.error('Download error:', error.message);
        res.status(500).json({ error: 'Failed to download VPN config' });
    }
});
