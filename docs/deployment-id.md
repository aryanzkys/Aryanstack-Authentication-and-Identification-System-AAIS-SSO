# Konfigurasi Domain AAIS SSO - Panduan Deployment Netlify

## 🌐 Struktur Domain

Sistem AAIS SSO telah dikonfigurasi untuk di-deploy di Netlify dengan struktur domain berikut:

| Komponen | Fungsi | Domain Produksi | Port (Dev) |
|----------|--------|-----------------|------------|
| **AAIS Auth Server (Backend)** | Menangani token, callback, dan komunikasi dengan Ory Hydra + Supabase | `https://auth.aryanstack.netlify.app` | 3000 |
| **AAIS Login UI** | Tampilan login/signup untuk user | `https://login.aryanstack.netlify.app` | 3002 |
| **AAIS Management Panel** | Admin panel untuk kelola client, API, dan user | `https://panel.aryanstack.netlify.app` | 3001 |
| **Ory Hydra Instance** | Authorization Server (IdP) | `https://naughty-rubin-41sxbvuozm.projects.oryapis.com` | N/A |

## ✅ Perubahan yang Telah Dilakukan

### 1. Update Environment Variables

Semua file `.env.example` telah diperbarui untuk menggunakan domain produksi:

**Auth Server (Backend) - `.env.example`**
```env
AUTH_SERVER_URL=https://auth.aryanstack.netlify.app
LOGIN_UI_URL=https://login.aryanstack.netlify.app
ADMIN_PANEL_URL=https://panel.aryanstack.netlify.app
HYDRA_ADMIN_URL=https://naughty-rubin-41sxbvuozm.projects.oryapis.com/admin
HYDRA_PUBLIC_URL=https://naughty-rubin-41sxbvuozm.projects.oryapis.com
```

**Login UI - `login-ui/.env.example`**
```env
NEXT_PUBLIC_API_BASE_URL=https://auth.aryanstack.netlify.app
NEXT_PUBLIC_HYDRA_REDIRECT_URI=https://login.aryanstack.netlify.app/callback
NEXT_PUBLIC_HYDRA_PUBLIC_URL=https://naughty-rubin-41sxbvuozm.projects.oryapis.com
```

**Admin Panel - `admin-panel/.env.example`**
```env
NEXT_PUBLIC_SSO_API_URL=https://auth.aryanstack.netlify.app
NEXT_PUBLIC_APP_URL=https://panel.aryanstack.netlify.app
NEXT_PUBLIC_HYDRA_PUBLIC_URL=https://naughty-rubin-41sxbvuozm.projects.oryapis.com
```

### 2. File Konfigurasi Netlify

Telah dibuat file `netlify.toml` untuk setiap komponen:

- **Auth Server**: `netlify.toml` (root) - Konfigurasi Netlify Functions
- **Login UI**: `login-ui/netlify.toml` - Konfigurasi Next.js
- **Admin Panel**: `admin-panel/netlify.toml` - Konfigurasi Next.js

### 3. Serverless Function Wrapper

Telah dibuat wrapper untuk Express backend di `netlify/functions/api.js` menggunakan `serverless-http`.

## 🚀 Cara Deploy

### Step 1: Deploy Auth Server

1. Login ke [Netlify](https://app.netlify.com)
2. Klik "Add new site" → "Import an existing project"
3. Pilih repository GitHub Anda
4. Atur konfigurasi:
   - **Site name**: `auth-aryanstack`
   - **Build command**: `npm install`
   - **Publish directory**: `.`
   - **Functions directory**: `netlify/functions`

5. Tambahkan Environment Variables di Netlify Dashboard:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `HYDRA_ADMIN_URL`
   - `HYDRA_PUBLIC_URL`
   - `HYDRA_CLIENT_ID`
   - `HYDRA_CLIENT_SECRET`
   - `JWT_SECRET`
   - `SESSION_SECRET`
   - `ALLOWED_ORIGINS`

6. Deploy!

### Step 2: Deploy Login UI

1. Klik "Add new site" di Netlify
2. Pilih repository yang sama
3. Atur konfigurasi:
   - **Site name**: `login-aryanstack`
   - **Base directory**: `login-ui`
   - **Build command**: `npm run build`
   - **Publish directory**: `login-ui/.next`

4. Tambahkan Environment Variables:
   - `NEXT_PUBLIC_API_BASE_URL=https://auth.aryanstack.netlify.app`
   - `NEXT_PUBLIC_HYDRA_CLIENT_ID=aais-sso-client`
   - `NEXT_PUBLIC_HYDRA_REDIRECT_URI=https://login.aryanstack.netlify.app/callback`
   - `NEXT_PUBLIC_HYDRA_PUBLIC_URL=https://naughty-rubin-41sxbvuozm.projects.oryapis.com`
   - `NODE_ENV=production`

5. Deploy!

### Step 3: Deploy Admin Panel

1. Klik "Add new site" di Netlify
2. Pilih repository yang sama
3. Atur konfigurasi:
   - **Site name**: `panel-aryanstack`
   - **Base directory**: `admin-panel`
   - **Build command**: `npm run build`
   - **Publish directory**: `admin-panel/.next`

4. Tambahkan Environment Variables:
   - `NEXT_PUBLIC_SSO_API_URL=https://auth.aryanstack.netlify.app`
   - `NEXT_PUBLIC_ADMIN_API_URL=https://auth.aryanstack.netlify.app/admin`
   - `NEXT_PUBLIC_APP_URL=https://panel.aryanstack.netlify.app`
   - `NEXT_PUBLIC_HYDRA_PUBLIC_URL=https://naughty-rubin-41sxbvuozm.projects.oryapis.com`
   - `NODE_ENV=production`

5. Deploy!

### Step 4: Konfigurasi Ory Hydra

Di Ory Cloud Console, daftarkan OAuth2 clients:

**Client untuk Login UI:**
```json
{
  "client_id": "aais-sso-client",
  "redirect_uris": [
    "https://login.aryanstack.netlify.app/callback",
    "https://auth.aryanstack.netlify.app/callback"
  ]
}
```

**Client untuk Admin Panel:**
```json
{
  "client_id": "aais-admin-panel",
  "redirect_uris": [
    "https://panel.aryanstack.netlify.app/callback",
    "https://auth.aryanstack.netlify.app/callback"
  ]
}
```

## 🔧 Testing

Setelah deployment, test sistem Anda:

1. **Test Login UI**: `https://login.aryanstack.netlify.app`
2. **Test Admin Panel**: `https://panel.aryanstack.netlify.app`
3. **Test API**: `https://auth.aryanstack.netlify.app/health`

## 📝 Catatan Penting

- Pastikan semua environment variables sudah diset dengan benar
- Verifikasi CORS settings di backend
- Test OAuth flow secara menyeluruh
- Monitor Netlify function logs untuk debugging

## 🎉 Selesai!

Sistem AAIS SSO Anda sekarang berjalan di:
- **Auth Server**: https://auth.aryanstack.netlify.app
- **Login UI**: https://login.aryanstack.netlify.app  
- **Admin Panel**: https://panel.aryanstack.netlify.app
