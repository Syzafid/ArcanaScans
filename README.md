# MangaDex Client – UAS Project

## Deskripsi Proyek
 ArcanaScans adalah web berbasis **Next.js** untuk membaca manga dengan integrasi API **MangaDex**. Web ini mendukung fitur pencarian manga, bookmark, autentikasi pengguna, serta panel admin untuk mengelola rekomendasi dan konten.

---

## API yang Digunakan
- **[MangaDex API](https://api.mangadex.org/)**  
  Digunakan untuk mengambil data manga, chapter, cover image, dan metadata lainnya.  
- **Proxy API (Production)** – Digunakan untuk menghindari masalah **CORS** saat aplikasi di-deploy.

---

## Fitur-Fitur Utama
1. **Autentikasi User** – Sign up, login, serta proteksi halaman library.  
2. **Bookmark** – Simpan manga favorit dengan dukungan `localStorage` & Redux Persist.  
3. **Pencarian & Filter Manga** – Berdasarkan judul, genre, bahasa, dan urutan popularitas.  
4. **Membaca Manga** – Fitur chapter viewer dengan navigasi halaman.  
5. **Admin Dashboard** – CRUD rekomendasi manga dan manajemen ranking.  
6. **Dark Mode & Theme Switcher** – Menggunakan **next-themes**.  
7. **Responsif** – Desain optimal untuk desktop & mobile.  

---

## Struktur Halaman & Routing
- `/` – Halaman utama (homepage) dengan rekomendasi manga.
- `/category` - untuk pencarian, fiter komik sesuai genre yang lebih luas dibanding di homepage  
- `/manga/[id]` – Detail manga beserta daftar chapter yang bisa di filter berdasarkan bahasa.  
- `/read/[chapterId]` – Halaman membaca manga per chapter.  
- `/library` – Bookmark manga user (hanya untuk user login).  
- `/login` & `/signup` – Autentikasi user.  
- `/admin/index` – Admin dashboard.  
- `/admin/admins` – Membuat akun admin baru.
- `/admin/users` - memlihat list user
- `/admin/bookmarks` - melihat list bookmarks user
- `/admin/content` - membuat/ menginput komik internal 
- `/admin/rankings` - membuat/mengedit rangking komik yang nantinya ditampilkan di homepage
- `/admin/recommendation` - membuat/mengedit rekomendasi komik yang nantinya ditampilkan di homepage di carousel

---

## Cara Menjalankan Secara Lokal
1. **Clone repository:**
   ```bash
   git clone https://github.com/Syzafid/ArcanaScans.git
   cd ArcanaScans
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Jalankan development server:**
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di `http://localhost:3000`.

4. **Mode Proxy di Local**  
   karena MangaDex terblokir di jaringan lokal khusus di Indonesia, set `API_URL` di `lib/mangadex.js` menjadi:
   ```js
   const API_URL = "https://api.mangadex.org";
   ```
   untuk bypass proxy lokal.

---

## Link Live Demo
- **[Live Demo di Vercel]arcanascans.vercel.app**  
