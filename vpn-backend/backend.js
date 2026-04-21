import express from 'express';
import { registerEndpoints } from './handlers/RegisterEndpoints.js';
import cookieParser from 'cookie-parser';
import Database from 'better-sqlite3';
import cors from 'cors';
import jwt from 'jsonwebtoken';
const app = express();
import dotenv from 'dotenv';
import bcrypt from "bcryptjs";
app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: "https://localhost:3000", credentials: true }));
dotenv.config();

const db = new Database('admin.db');

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        can_modify_vpn INTEGER NOT NULL DEFAULT 0,
        can_delete INTEGER NOT NULL DEFAULT 0,
        can_create_users INTEGER NOT NULL DEFAULT 0,
        can_view_admin INTEGER NOT NULL DEFAULT 1
    )
`);




// Migrate existing table if permissions columns are missing
const cols = db.prepare("PRAGMA table_info(users)").all().map(c => c.name);
if (!cols.includes('can_modify_vpn')) {
    db.exec(`ALTER TABLE users ADD COLUMN can_modify_vpn INTEGER NOT NULL DEFAULT 0`);
    db.exec(`ALTER TABLE users ADD COLUMN can_delete INTEGER NOT NULL DEFAULT 0`);
    db.exec(`ALTER TABLE users ADD COLUMN can_create_users INTEGER NOT NULL DEFAULT 0`);
    db.exec(`ALTER TABLE users ADD COLUMN can_view_admin INTEGER NOT NULL DEFAULT 1`);
    // Give existing admin user all permissions
    db.exec(`UPDATE users SET can_modify_vpn=1, can_delete=1, can_create_users=1, can_view_admin=1 WHERE username='admin'`);
    console.log('Migrated users table with permission columns');
}

const hashed = bcrypt.hashSync("password", 10);

db.prepare(`
        INSERT INTO users (username, password, can_modify_vpn, can_delete, can_create_users, can_view_admin)
        VALUES (?, ?, ?, ?, ?, ?)
    `).run(
    "Longeh", hashed,
    1,
    1,
    1,
    1,
);

const JWT_SECRET = process.env.JWT_SECRET_KEY || 'change_this_secret_in_production';

console.log("Registering API Endpoints...");
registerEndpoints().then(r => console.log("All API Endpoints Registered!"));


function authenticateToken(req, res, next) {
    const token = req.cookies.admin_token;
    if (!token) return res.status(401).json({ error: 'No token provided' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid or expired token' });
        req.user = user;
        next();
    });
}

function requirePermission(permission) {
    return (req, res, next) => {
        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
        if (!user || !user[permission]) {
            return res.status(403).json({ error: 'You do not have permission to do this' });
        }
        next();
    };
}

app.listen(30000, () => {
    console.log("Server is running on port 30000");
});

app.db = db;

export {
    app, authenticateToken, requirePermission
}