const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');

const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, JSON.stringify({}), 'utf8');

function loadUsers() {
    try { return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8') || '{}'); }
    catch (e) { return {}; }
}
function saveUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}
function genCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Configure nodemailer transporter via env vars
const transporter = (function(){
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    if (!host || !user || !pass) {
        console.warn('SMTP not configured - emails will be logged to console. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS to enable real sending.');
        return null;
    }
    return nodemailer.createTransport({
        host,
        port: Number(port) || 587,
        secure: false,
        auth: { user, pass }
    });
})();

async function sendEmail(to, subject, bodyText, bodyHtml) {
    if (!transporter) {
        console.log('--- EMAIL (simulated) ---');
        console.log('From:', process.env.FROM_EMAIL || 'baseamsophy80@gmail.com');
        console.log('To:', to);
        console.log('Subject:', subject);
        console.log('Text body:\n', bodyText);
        console.log('HTML body:\n', bodyHtml);
        console.log('-------------------------');
        return { ok: true, simulated: true };
    }
    const from = process.env.FROM_EMAIL || 'baseamsophy80@gmail.com'; // default sender
    try {
        await transporter.sendMail({ from, to, subject, text: bodyText, html: bodyHtml });
        return { ok: true, simulated: false };
    } catch (err) {
        console.error('sendMail error', err);
        return { ok: false, error: err.message || String(err) };
    }
}

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Create account: store password and send verification code
app.post('/api/create-account', async (req, res) => {
    const { email, password } = req.body || {};
    console.log('POST /api/create-account', { email: email || null });
    if (!email || !password) return res.json({ ok: false, msg: 'Email and password required.' });
    const users = loadUsers();
    const key = email.toLowerCase();
    if (users[key]) return res.json({ ok: false, msg: 'Account already exists.' });
    const code = genCode();
    const expiry = Date.now() + 10 * 60 * 1000;
    users[key] = { password, verified: false, lastCode: code, lastCodeExpiry: expiry, createdAt: Date.now() };
    saveUsers(users);

    const subject = `Snackers Account Verification Code`;
    const bodyText = `Hello,

This is your Snackers Account Verification code: ${code}
It will expire in 10 minutes.

If you did NOT request this, ignore this message or contact info@snackers.com.

Thanks,
Snackers Team`;

    const bodyHtml = `
        <div style="font-family:Arial, sans-serif; color:#111;">
            <p>Hello,</p>
            <p>This is your <strong>Snackers Account Verification</strong> code:</p>
            <p style="font-size:22px; font-weight:700; color:#FF6B00; letter-spacing:2px;">${code}</p>
            <p>It will expire in 10 minutes.</p>
            <p>If you did NOT request this, ignore this message or contact <a href="mailto:info@snackers.com">info@snackers.com</a>.</p>
            <p>Thanks,<br/>Snackers Team</p>
        </div>
    `;

    const sent = await sendEmail(email, subject, bodyText, bodyHtml);
    // expose code for dev when transporter not configured or DEV_EXPOSE_CODES=true
    const expose = (!sent.simulated && process.env.DEV_EXPOSE_CODES === 'true') || sent.simulated;
    return res.json({
        ok: !!sent.ok,
        msg: sent.ok ? 'Verification code sent to email.' : 'Failed to send email (check SMTP).',
        debugCode: expose ? code : undefined,
        error: sent.error
    });
});

// Send code to existing account (login or password reset)
app.post('/api/send-code', async (req, res) => {
    const { email, purpose } = req.body || {};
    console.log('POST /api/send-code', { email: email || null, purpose });
    if (!email) return res.json({ ok: false, msg: 'Email required.' });
    const users = loadUsers();
    const key = email.toLowerCase();
    const user = users[key];
    if (!user) return res.json({ ok: false, msg: 'No account found for this email.' });
    const code = genCode();
    const expiry = Date.now() + 10 * 60 * 1000;
    user.lastCode = code;
    user.lastCodeExpiry = expiry;
    users[key] = user;
    saveUsers(users);

    const subject = `Snackers ${purpose || 'Verification'} Code`;
    const bodyText = `Hello,

This is your Snackers ${purpose || 'Verification'} code: ${code}
It will expire in 10 minutes.

If you did NOT request this, ignore this message or contact info@snackers.com.

Thanks,
Snackers Team`;

    const bodyHtml = `
        <div style="font-family:Arial, sans-serif; color:#111;">
            <p>Hello,</p>
            <p>This is your <strong>Snackers ${purpose || 'Verification'}</strong> code:</p>
            <p style="font-size:22px; font-weight:700; color:#FF6B00; letter-spacing:2px;">${code}</p>
            <p>It will expire in 10 minutes.</p>
            <p>If you did NOT request this, ignore this message or contact <a href="mailto:info@snackers.com">info@snackers.com</a>.</p>
            <p>Thanks,<br/>Snackers Team</p>
        </div>
    `;

    const sent = await sendEmail(email, subject, bodyText, bodyHtml);
    const expose = (!sent.simulated && process.env.DEV_EXPOSE_CODES === 'true') || sent.simulated;
    return res.json({
        ok: !!sent.ok,
        msg: sent.ok ? `${purpose || 'Verification'} code sent.` : 'Failed to send email.',
        debugCode: expose ? code : undefined,
        error: sent.error
    });
});

// Verify code
app.post('/api/verify-code', (req, res) => {
    const { email, code } = req.body || {};
    if (!email || !code) return res.json({ ok: false, msg: 'Email and code required.' });
    const users = loadUsers();
    const key = email.toLowerCase();
    const user = users[key];
    if (!user || !user.lastCode) return res.json({ ok: false, msg: 'No code stored for this email.' });
    if (user.lastCode !== String(code)) return res.json({ ok: false, msg: 'Invalid code.' });
    if (Date.now() > (user.lastCodeExpiry || 0)) return res.json({ ok: false, msg: 'Code expired.' });
    user.verified = true;
    user.lastCode = null;
    user.lastCodeExpiry = null;
    users[key] = user;
    saveUsers(users);
    res.json({ ok: true, msg: 'Code verified.' });
});

// Login (password or code)
app.post('/api/login', (req, res) => {
    const { email, password, code } = req.body || {};
    if (!email) return res.json({ ok: false, msg: 'Email required.' });
    const users = loadUsers();
    const key = email.toLowerCase();
    const user = users[key];
    if (!user) return res.json({ ok: false, msg: 'No account for this email.' });
    if (code) {
        if (user.lastCode && user.lastCode === String(code) && Date.now() <= (user.lastCodeExpiry || 0)) {
            user.verified = true;
            user.lastCode = null;
            user.lastCodeExpiry = null;
            users[key] = user;
            saveUsers(users);
            return res.json({ ok: true, msg: 'Logged in with code.' });
        }
        return res.json({ ok: false, msg: 'Invalid or expired code.' });
    }
    if (password && user.password === password) {
        return res.json({ ok: true, msg: 'Logged in with password.' });
    }
    res.json({ ok: false, msg: 'Incorrect password.' });
});

// Reset password (verify code + set new password)
app.post('/api/reset-password', (req, res) => {
    const { email, code, newPassword } = req.body || {};
    if (!email || !code || !newPassword) return res.json({ ok: false, msg: 'Email, code and newPassword required.' });
    const users = loadUsers();
    const key = email.toLowerCase();
    const user = users[key];
    if (!user || !user.lastCode) return res.json({ ok: false, msg: 'No code stored for this email.' });
    if (user.lastCode !== String(code)) return res.json({ ok: false, msg: 'Invalid code.' });
    if (Date.now() > (user.lastCodeExpiry || 0)) return res.json({ ok: false, msg: 'Code expired.' });
    user.password = newPassword;
    user.lastCode = null;
    user.lastCodeExpiry = null;
    users[key] = user;
    saveUsers(users);
    res.json({ ok: true, msg: 'Password updated.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Snackers server running on http://localhost:${PORT}`));
