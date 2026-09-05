const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // Diasumsikan model Mongoose
require('dotenv').config();

const registerUser = async (req, res) => {
    const { phone, password } = req.body;

    try {
        // Cek apakah pengguna sudah ada
        const existingUser = await User.findOne({ phone });
        if (existingUser) return res.status(400).json({ message: 'Pengguna sudah terdaftar.' });

        // 1. ENKRIPSI PASSWORD: Menggunakan hashing bcrypt yang kuat.
        const hashedPassword = await bcrypt.hash(password, 12); // Salt rounds = 12

        // Simpan pengguna baru ke database dengan password yang sudah di-hash
        const newUser = new User({ phone, password: hashedPassword, balance: 0 });
        await newUser.save();

        res.status(201).json({ message: 'Pengguna berhasil terdaftar.' });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan server.' });
    }
};

const loginUser = async (req, res) => {
    const { phone, password } = req.body;

    try {
        // Cari pengguna berdasarkan nomor ponsel
        const user = await User.findOne({ phone });
        if (!user) return res.status(400).json({ message: 'Kredensial tidak valid.' });

        // 2. VERIFIKASI PASSWORD: Bandingkan kata sandi yang diinput dengan yang di-hash di DB.
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: 'Kredensial tidak valid.' });

        // 3. GENERATE JWT TOKEN: Buat token yang ditandatangani.
        const token = jwt.sign({ id: user._id, phone: user.phone }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // 4. SECURE SESSION (HttpOnly Cookie): Kirim JWT sebagai HttpOnly cookie.
        res.cookie('token', token, {
            httpOnly: true, // JavaScript sisi klien tidak bisa mengakses cookie ini. Mencegah XSS stealing token.
            secure: process.env.NODE_ENV === 'production', // Hanya dikirim melalui HTTPS di produksi.
            sameSite: 'strict', // Mencegah serangan CSRF.
            maxAge: 3600000 // 1 jam dalam milidetik
        });

        res.status(200).json({ message: 'Login berhasil.', userId: user._id });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan server.' });
    }
};

module.exports = { registerUser, loginUser };
