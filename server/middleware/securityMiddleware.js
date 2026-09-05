const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');

const securityRouter = express.Router();

// 1. Helmet: Mengatur header keamanan HTTP untuk mencegah serangan seperti XSS, clickjacking, dll.
securityRouter.use(helmet());

// 2. COOKIE-PARSER: Wajib untuk menangani cookies (HttpOnly untuk JWT)
securityRouter.use(cookieParser());

// 3. CORS: Batasi akses hanya dari domain frontend yang dipercaya.
const corsOptions = {
    origin: 'http://localhost:3000', // Sesuaikan dengan domain frontend Anda
    credentials: true, // Izinkan cookies
    optionsSuccessStatus: 200
};
securityRouter.use(cors(corsOptions));

// 4. RATE LIMITING: Mencegah serangan Brute Force pada login/register dan transaksi.
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 10, // batasi setiap IP hingga 10 permintaan per windowMs
    message: 'Terlalu banyak permintaan login. Silakan coba lagi nanti.'
});
securityRouter.use('/api/auth/login', authLimiter);

// 5. CSRF PROTECTION: Hasilkan dan verifikasi token CSRF.
const csrfProtection = csrf({ cookie: true });

// Middleware ini akan memvalidasi token CSRF pada permintaan POST/PUT/DELETE.
// Token CSRF harus dikirim oleh klien dalam header 'CSRF-Token'.
securityRouter.use(csrfProtection);

module.exports = securityRouter;
