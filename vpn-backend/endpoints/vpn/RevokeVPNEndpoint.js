import {app, authenticateToken} from "../../backend.js";
import { execSync } from "child_process"

app.delete('/vpn/revoke/:client', authenticateToken,(req, res) => {
    try {
        const clientNumber = parseInt(req.params.client);
        if (!clientNumber || clientNumber < 1) {
            return res.status(400).json({ error: 'Invalid client ID' });
        }
        const client = execSync(
            `tail -n +2 /etc/openvpn/easy-rsa/pki/index.txt | grep "^V" | cut -d '=' -f 2 | sed -n "${clientNumber}p"`
        ).toString().trim();

        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }
        execSync(`
  cd /etc/openvpn/easy-rsa/ &&
  ./easyrsa --batch revoke ${client} &&
  EASYRSA_CRL_DAYS=3650 ./easyrsa gen-crl &&
  rm -f /etc/openvpn/crl.pem &&
  cp /etc/openvpn/easy-rsa/pki/crl.pem /etc/openvpn/crl.pem &&
  chmod 644 /etc/openvpn/crl.pem &&
  find /home/ -maxdepth 2 -name "${client}.ovpn" -delete &&
  rm -f "/root/${client}.ovpn" &&
  sed -i "/^${client},.*/d" /etc/openvpn/ipp.txt &&
  cp /etc/openvpn/easy-rsa/pki/index.txt /etc/openvpn/easy-rsa/pki/index.txt.bk
`, { shell: '/bin/bash' });
        res.json({ message: `Certificate for client ${client} revoked.` });
    } catch (error) {
        console.error('Revoke error:', error.message);
        console.error('stderr:', error.stderr?.toString());
        res.status(500).json({ error: 'Failed to revoke client' });
    }
});