# 1.) 🍔 Web Application For Food Ordering  – Final Project RPL

## 2.) Nama Kelompok & Anggota
*Kelompok 5*
*Nama Anggota*  
- Muh. Adzkal Akhdan (701230298)
- Rahmat Iqbal (701230198)
- Tiara Adiga Ramadhan (701230097)

---

## 3.) 📌 Deskripsi Singkat Aplikasi
Food Order App adalah aplikasi pemesanan makanan berbasis web yang memungkinkan pengguna melakukan pemesanan makanan secara langsung.
Aplikasi menggunakan Firebase Realtime Database sebagai media penyimpanan dan update data secara real-time.

Tersedia dua tampilan:
- *User* → melakukan pemesanan & cek status pesanan  
- *Admin* → mengelola pesanan & memperbarui status

---

## 4.) 🎯 Tujuan Sistem / Permasalahan yang Diselesaikan
- Mempermudah proses pemesanan makanan secara online tanpa harus datang langsung ke lokasi atau melakukan pemesanan manual melalui telepon.  
- Mengurangi kesalahan pencatatan pesanan, karena semua pesanan masuk ke Firebase Realtime Database secara otomatis dan terstruktur.  
- Mempercepat proses pengelolaan pesanan oleh admin, melalui dashboard admin yang menampilkan semua pesanan secara real-time.  
- Menyediakan fitur pemantauan status pesanan agar pengguna dapat mengetahui perkembangan pesanan mereka (Pending, Diproses, Dikirim, Selesai).
- Membantu digitalisasi layanan pemesanan makanan, terutama bagi UMKM atau bisnis kecil yang membutuhkan sistem sederhana dan cepat digunakan.
- Menyediakan platform yang mudah digunakan baik oleh pengguna umum maupun admin, dengan tampilan sederhana dan proses pengisian form yang jelas.

---

## 5.) 🛠 Teknologi yang Digunakan
- *HTML, CSS, JavaScript (Vanilla)*  
- *Firebase Realtime Database*  
- *Code Editor (VS Code)*
- *Browser yang mendukung*
- *Firebase SDK*

---

## 6.) ⚙ Cara Menjalankan Aplikasi

### 1 Instalasi  
Tidak diperlukan instalasi khusus. Cukup download project atau clone repository.

### 2 Cara Konfigurasi
- Masuk ke Firebase Console
- Buat project baru
- Aktifkan Realtime Database
- Ubah Rules menjadi:
  {
    "rules": {
      ".read": true,
      ".write": true
   }
  }
- Tambahkan konfigurasi web app Firebase pada file : firebase-config.js
- Pastikan Terdapat database URL nya
- Lalu salin Link URL ke file firebase-config.js

### 3 Cara Menjalankan Aplikasi
*Cukup buka file berikut di browser:
- index.html → tampilan User
- admin.html → tampilan Admin
Atau jika bisa langsung ditampilan tinggal pilih ingin masuk sebagai admin/user
menggunakan email dan password yang sesuai
*Jika ingin hosting:
Bisa menggunakan GitHub Pages, Firebase Hosting, atau InfinityFree

## 7.) Akun Demo
- (Admin)
- Username : admin
- Password : 12345
- (User)
- Username/email : kale001@gmail.com
- Password : kallenibos
- (Jika ingin buat akun baru sebagai User)
- Username/email : bebas
- Password : bebas

## 8.) Link Deployment / Link APK / Link Demo Video
- Link Deployment : https://adzkal.github.io/food-order-app/
- Link Demo Video :

## 9.) Screenshot Halaman Utama
<img width="1920" height="1200" alt="Screenshot 2025-11-30 072247" src="https://github.com/user-attachments/assets/2d334473-a4d4-4aa4-bd49-9c7ee114f24f" />
<img width="1920" height="1200" alt="Screenshot 2025-11-30 072501" src="https://github.com/user-attachments/assets/29cbe9f7-a1b1-4e47-b066-c42f13824972" />

## 10.) Catatan Tambahan
- Aplikasi ini tidak sampai ke fitur pembayaran
- Aplikasi ini menggunakan Realtime DataBase pada FireBase
- Admin wajib mengupdate status agar user melihat perubahan real-time.

## 11.) Keterangan tugas
Project ini dibuat untuk memenuhi Tugas Final Project Mata Kuliah Rekayasa Perangkat Lunak

Dosen Pengampu: *Dila Nurlaila,M.Kom.*

Program Studi: Sistem Informasi – UIN Sultan Thaha Saifuddin Jambi
