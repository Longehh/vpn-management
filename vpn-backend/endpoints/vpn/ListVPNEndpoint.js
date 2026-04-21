import {app} from "../../backend.js";
import {execSync} from "child_process";

app.get('/api/vpn/list', (req, res) => {
    try {
        const output = execSync(
            `tail -n +2 /etc/openvpn/easy-rsa/pki/index.txt | grep "^V"`
        ).toString();

        const clients = output
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map((line, index) => ({
                id: index + 1,
                name: line.split('=').pop()
            }));

        res.json({ clients });
    } catch (error) {
        res.status(500).json({ error: 'No Clients Found' });
    }
});