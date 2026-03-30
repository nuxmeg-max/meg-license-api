# MEG License API — Vercel Setup

## 🚀 Deploy ke Vercel

### 1. Install Vercel CLI
```
npm i -g vercel
```

### 2. Deploy
```
cd license-vercel
vercel deploy --prod
```
Catat URL: `https://your-project.vercel.app`

### 3. Setup Environment Variables
Di Vercel Dashboard → Project → Settings → Environment Variables:

| Variable | Value |
|---|---|
| `SECRET_TOKEN` | Buat sendiri, contoh: `MegBot2026!@#` |
| `KV_REST_API_URL` | Dari Vercel KV (lihat langkah 4) |
| `KV_REST_API_TOKEN` | Dari Vercel KV (lihat langkah 4) |

### 4. Setup Vercel KV (Database)
1. Vercel Dashboard → Storage → Create → KV Database
2. Connect ke project ini
3. `KV_REST_API_URL` dan `KV_REST_API_TOKEN` otomatis masuk ke env vars

---

## ⚙️ Setup di Bot License MEG (config.js)
```js
global.vercelApiUrl      = 'https://your-project.vercel.app'
global.vercelSecretToken = 'MegBot2026!@#'
```

## ⚙️ Setup di Bot JB MEG (config.js)
```js
global.vercelApiUrl      = 'https://your-project.vercel.app'
global.vercelSecretToken = 'MegBot2026!@#'
```

---

## 💬 Command di Bot License MEG

| Command | Keterangan |
|---|---|
| `.addbot 628xxx` | Tambah lisensi — bot JB bisa aktif |
| `.delbot 628xxx` | Cabut lisensi — bot JB tidak bisa aktif |
| `.listbot` | Lihat semua bot terdaftar |

---

## 🔄 Alur Sistem

```
Owner/Reseller
    ↓ .addbot 628xxx
Bot License MEG
    ↓ POST /api/add
Vercel KV (database)
    
Bot JB pelanggan startup
    ↓ GET /api/check?number=628xxx
Vercel KV (database)
    ↓ licensed: true/false
Bot JB → aktif atau sock.logout() + process.exit()
```
