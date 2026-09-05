document.addEventListener('DOMContentLoaded', async () => {
    // 1. Ambil data dasbor dari rute yang dilindungi di backend
    try {
        const response = await fetch('/api/dashboard/data', {
            method: 'GET',
            credentials: true // Kirim HttpOnly JWT cookie untuk autentikasi
        });

        if (!response.ok) {
            // Jika token tidak valid atau kedaluwarsa, server akan merespons dengan 401
            window.location.href = 'index.html'; // Alihkan kembali ke login
            return;
        }

        const data = await response.json();

        // 2. Perbarui tampilan dengan data dari server
        // Mencegah XSS (OWASP Top 10): Selalu gunakan `.textContent` saat memasukkan data yang bersumber dari pengguna/server.
        // Jangan pernah menggunakan `.innerHTML` untuk data yang tidak dipercaya.
        const welcomeMessageEl = document.getElementById('welcomeMessage');
        if (data.phone) {
            // Demonstrasi: Menampilkan nomor ponsel pengguna
            welcomeMessageEl.textContent = `Selamat datang, +62 ${data.phone}`;
        }
    } catch (error) {
        console.error('Terjadi kesalahan:', error);
    }
});
