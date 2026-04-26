import {app, authenticateToken} from "../../backend.js";
import {exec, execSync} from "child_process";

app.post('/renew', authenticateToken, async (req, res) => {
    const panelDomain = process.env.PANEL_DOMAIN;

    try {
        const result = execSync(`sudo bash -c 'source /etc/letsencrypt/azurax.env && AZURAX_AUTH_KEY=$AZURAX_AUTH_KEY certbot -d ${panelDomain} --manual --non-interactive --force-renewal --register-unsafely-without-email --preferred-challenges dns --manual-auth-hook /etc/letsencrypt/renewal-hooks/auth/certbot-auth-hook.sh certonly'`, { stdio: 'pipe', encoding: 'utf8' });
        res.send({ success: true, output: result });
    } catch (e) {
        const stderr = e.stderr;
        const stdout = e.stdout;
        const match = (stderr + stdout).match(/\[ERROR\] Response: ({.*})/);
        if (match) {
            const error = JSON.parse(match[1]);
            return res.status(400).send({ success: false, error: error.error });
        } else {
            return res.status(500).send({ success: false, error: stderr || stdout });
        }
    }

    execSync('sudo nginx -t && sudo systemctl reload nginx');
    execSync('sudo systemctl restart wings')

    app.db.prepare(`INSERT INTO renewals (username, timestamp) VALUES (?, ?)`).run(req.user.username, new Date().toISOString());
    console.log('Certificate renewed and services reloaded');
});