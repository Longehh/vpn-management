import { OSUtils } from 'node-os-utils';
import {app, authenticateToken} from "../../backend.js";
const osutils = new OSUtils();
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
app.get('/stats', async (req, res) => {
    const systemDetails = await osutils.overview();
    const diskUsage = await getDiskUsage();

    const cpuUsage = Math.round((systemDetails.cpu.usage + Number.EPSILON) * 100) / 100

    const statistics = {
        memory: {
            total: systemDetails.memory.total,
            used: systemDetails.memory.used,
        },
        cpu: {
            usage: cpuUsage
        },
        disk: {
            used: formatBytes(diskUsage.used),
            total: formatBytes(diskUsage.total)
        }
    }

    res.json({statistics})
});

function formatBytes(bytes) {
    if (bytes >= 1_000_000_000_000) return (bytes / 1_000_000_000_000).toFixed(2) + ' TB';
    if (bytes >= 1_000_000_000)     return (bytes / 1_000_000_000).toFixed(2) + ' GB';
    if (bytes >= 1_000_000)         return (bytes / 1_000_000).toFixed(2) + ' MB';
    return bytes + ' B';
}

async function getDiskUsage() {
    const { stdout } = await execAsync("df -B1 /");
    const lines = stdout.trim().split('\n');
    const parts = lines[1].split(/\s+/);

    return {
        total: parseInt(parts[1]),
        used: parseInt(parts[2]),
        available: parseInt(parts[3]),
        usagePercentage: parseFloat(parts[4].replace('%', '')),
    };
}