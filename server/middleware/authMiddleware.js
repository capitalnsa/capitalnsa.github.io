const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    // 1. Ambil token dari HttpOnly cookie
    const token = req.cookies.token;

    // Cek apakah token ada
    if (!token) {
        return res.status(401).json({ message: 'Akses ditolak. Tidak ada token yang disediakan.' });
    }

    try {
        // 2. Verifikasi token
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Melampirkan data pengguna ke permintaan
        next(); // Lanjut ke rute berikutnya
    } catch (error) {
        // Jika verifikasi gagal (misalnya, token kedaluwarsa atau dimanipulasi)
        res.clearCookie('token'); // Hapus cookie
        return res.status(401).json({ message: 'Akses ditolak. Token tidak valid.' });
    }
};

module.exports = verifyToken;
