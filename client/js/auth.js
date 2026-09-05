document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    // 1. Ambil token CSRF saat halaman dimuat.
    // Server harus memiliki endpoint GET '/api/csrf-token' yang mengembalikan token.
    fetch('/api/csrf-token', { method: 'GET', credentials: true })
        .then(response => response.json())
        .then(data => {
            if (data.csrfToken) {
                document.getElementById('csrfToken').value = data.csrfToken;
            }
        })
        .catch(error => console.error('Gagal mengambil token CSRF:', error));

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('password').value;
            const csrfToken = document.getElementById('csrfToken').value;

            // 2. Kirim data login ke server secara aman menggunakan Fetch API
            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // 3. Wajib: Sertakan token CSRF dalam header
                        'CSRF-Token': csrfToken
                    },
                    body: JSON.stringify({ phone, password }),
                    // 4. Wajib: Izinkan cookie dikirim (dan diterima untuk HttpOnly JWT cookie)
                    credentials: true
                });

                const data = await response.json();

                if (response.ok) {
                    // Login sukses, alihkan ke dasbor
                    window.location.href = 'dashboard.html';
                } else {
                    // Login gagal, tampilkan pesan kesalahan
                    alert(data.message || 'Login gagal.');
                }
            } catch (error) {
                console.error('Terjadi kesalahan:', error);
                alert('Gagal terhubung ke server.');
            }
        });
    }
});
