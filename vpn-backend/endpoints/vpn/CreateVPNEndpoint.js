import {app} from "../../backend.js";
import { execSync } from "child_process"

app.post("/api/vpn/create", (req, res) => {
    try {
        const { client, pass = 1 } = req.body;
        if (!client) {
            return res.status(400).json({ error: 'Client name is required' });
        }
        let exists = false;
        try {
            execSync(`tail -n +2 /etc/openvpn/easy-rsa/pki/index.txt | grep -E "/CN=${client}\\$"`);
            exists = true;
        } catch {
            exists = false;
        }
        if (exists) {
            return res.status(409).json({ error: `Client ${client} already exists` });
        }
        if (pass === 1) {
            execSync(`cd /etc/openvpn/easy-rsa/ && ./easyrsa --batch build-client-full "${client}" nopass`);
        } else {
            return res.status(400).json({ error: 'Password-protected clients are not supported via API' });
        }
        let homeDir = '/root';
        if (execSync(`[ -e "/home/${client}" ] && echo "yes" || echo "no"`).toString().trim() === 'yes') {
            homeDir = `/home/${client}`;
        }
        let tlsSig = null;
        try {
            execSync(`grep -qs "^tls-crypt" /etc/openvpn/server.conf`);
            tlsSig = 1;
        } catch {
            try {
                execSync(`grep -qs "^tls-auth" /etc/openvpn/server.conf`);
                tlsSig = 2;
            } catch {
                return res.status(500).json({ error: 'Could not determine TLS type' });
            }
        }
        const tlsBlock = tlsSig === 1
            ? `echo "<tls-crypt>" && cat /etc/openvpn/tls-crypt.key && echo "</tls-crypt>"`
            : `echo "key-direction 1" && echo "<tls-auth>" && cat /etc/openvpn/tls-auth.key && echo "</tls-auth>"`;
        const buildOvpn = (template, output) => `
      cp ${template} "${homeDir}/${output}" &&
      {
        echo "<ca>" && cat "/etc/openvpn/easy-rsa/pki/ca.crt" && echo "</ca>" &&
        echo "<cert>" && awk '/BEGIN/,/END CERTIFICATE/' "/etc/openvpn/easy-rsa/pki/issued/${client}.crt" && echo "</cert>" &&
        echo "<key>" && cat "/etc/openvpn/easy-rsa/pki/private/${client}.key" && echo "</key>" &&
        ${tlsBlock}
      } >> "${homeDir}/${output}"
    `;
        execSync(buildOvpn('/etc/openvpn/client-template.txt', `${client}.ovpn`));
        execSync(buildOvpn('/etc/openvpn/client-template-2.txt', `${client}-1.ovpn`));

        execSync(`zip -j "${homeDir}/${client}.zip" "${homeDir}/${client}.ovpn" "${homeDir}/${client}-1.ovpn" "${homeDir}/instructions.txt"`);
        execSync(`rm "${homeDir}/${client}.ovpn" "${homeDir}/${client}-1.ovpn"`);

        res.json({ message: `${client}.zip has been created at ${homeDir}.`, zip: `${homeDir}/${client}.zip` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create client' });
    }
});