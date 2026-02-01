# 🎯 QA Portfolio Website

Portfolio website untuk QA Engineer dengan fitur CRUD admin dashboard.

## ✨ Fitur

- ✅ **Portfolio Management** - Tambah, edit, hapus project
- ✅ **Admin Dashboard** - Kelola konten tanpa edit kode
- ✅ **Responsive Design** - Tampil bagus di HP, tablet, desktop
- ✅ **Firebase Integration** - Database & storage gratis
- ✅ **Authentication** - Login admin yang aman
- ✅ **Modern UI** - Clean design dengan Tailwind CSS

## 🛠️ Tech Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Firebase (Firestore + Storage + Auth)
- **Hosting:** Vercel
- **Icons:** Lucide React

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Firebase
1. Buat project di [Firebase Console](https://console.firebase.google.com)
2. Copy config ke `src/config/firebase.js`
3. Enable Firestore, Storage, dan Authentication

### 3. Jalankan Development Server
```bash
npm run dev
```

Buka browser: `http://localhost:5173`

### 4. Build untuk Production
```bash
npm run build
```

## 📁 Struktur Project

```
qa-portfolio/
├── src/
│   ├── components/      # Komponen reusable
│   ├── pages/           # Halaman website
│   │   └── admin/       # Halaman admin
│   ├── config/          # Konfigurasi Firebase
│   ├── App.jsx          # Main routing
│   └── main.jsx         # Entry point
├── public/              # Static assets
└── package.json         # Dependencies
```

## 🔐 Admin Access

**URL:** `/admin/login`

Buat user admin di Firebase Authentication:
1. Firebase Console → Authentication → Users
2. Add user dengan email & password
3. Login pakai credential tersebut

## 📚 Dokumentasi Lengkap

Baca file `PANDUAN_SETUP.md` untuk tutorial step-by-step lengkap dari nol.

## 🐛 Troubleshooting

Lihat file `CHEAT_SHEET.md` untuk quick reference dan common fixes.

## 📄 License

MIT License - Bebas dipakai untuk portfolio pribadi.

---

**Built with ❤️ for QA Engineers**
