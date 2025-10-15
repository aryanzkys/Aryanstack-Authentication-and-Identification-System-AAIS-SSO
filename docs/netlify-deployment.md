# AAIS SSO - Deployment Guide for Netlify

This guide explains how to deploy the complete AAIS SSO system to Netlify with the proper domain configuration.

## 🌐 Domain Structure

The AAIS SSO system is deployed across multiple domains on Netlify:

| Component | Function | Domain | Port (Dev) |
|-----------|----------|--------|------------|
| **AAIS Auth Server** | Handle tokens, callbacks, and communication with Ory Hydra + Supabase | `https://auth.aryanstack.netlify.app` | 3000 |
| **AAIS Login UI** | User login/signup interface | `https://login.aryanstack.netlify.app` | 3002 |
| **AAIS Management Panel** | Admin panel to manage clients, API, and users | `https://panel.aryanstack.netlify.app` | 3001 |
| **Ory Hydra Instance** | Authorization Server (IdP) | `https://naughty-rubin-41sxbvuozm.projects.oryapis.com` | N/A |

## 🚀 Deployment Steps

### 1. Deploy Auth Server (Backend)

The Auth Server needs to be deployed as Netlify Functions since it's a Node.js/Express backend.

**Option A: Netlify Functions (Recommended)**

1. Create a new site on Netlify
2. Set site name to `auth-aryanstack`
3. Configure build settings:
   ```
   Build command: npm run build
   Publish directory: .netlify/functions
   Functions directory: netlify/functions
   ```

4. Add environment variables in Netlify dashboard:
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   HYDRA_ADMIN_URL=https://naughty-rubin-41sxbvuozm.projects.oryapis.com/admin
   HYDRA_PUBLIC_URL=https://naughty-rubin-41sxbvuozm.projects.oryapis.com
   HYDRA_CLIENT_ID=aais-sso-client
   HYDRA_CLIENT_SECRET=your-client-secret
   HYDRA_REDIRECT_URI=https://auth.aryanstack.netlify.app/callback
   JWT_SECRET=your-super-secret-jwt-key
   SESSION_SECRET=your-session-secret
   ALLOWED_ORIGINS=https://login.aryanstack.netlify.app,https://panel.aryanstack.netlify.app
   ```

5. Create `netlify.toml` in root:
   ```toml
   [build]
     command = "npm install"
     functions = "netlify/functions"
     publish = "."

   [[redirects]]
     from = "/api/*"
     to = "/.netlify/functions/:splat"
     status = 200

   [[redirects]]
     from = "/*"
     to = "/.netlify/functions/:splat"
     status = 200
   ```

6. Create `netlify/functions` directory and wrap Express app

**Option B: Deploy to a Node.js hosting service**

Consider deploying to:
- Heroku
- Railway
- Render
- DigitalOcean App Platform

### 2. Deploy Login UI

1. Create a new site on Netlify
2. Set site name to `login-aryanstack`
3. Point to `login-ui` directory
4. Configure build settings:
   ```
   Base directory: login-ui
   Build command: npm run build
   Publish directory: login-ui/.next
   ```

5. Add environment variables:
   ```
   NEXT_PUBLIC_API_BASE_URL=https://auth.aryanstack.netlify.app
   NEXT_PUBLIC_HYDRA_CLIENT_ID=aais-sso-client
   NEXT_PUBLIC_HYDRA_REDIRECT_URI=https://login.aryanstack.netlify.app/callback
   NEXT_PUBLIC_HYDRA_PUBLIC_URL=https://naughty-rubin-41sxbvuozm.projects.oryapis.com
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   NODE_ENV=production
   ```

6. Deploy from GitHub

### 3. Deploy Admin Panel

1. Create a new site on Netlify
2. Set site name to `panel-aryanstack`
3. Point to `admin-panel` directory
4. Configure build settings:
   ```
   Base directory: admin-panel
   Build command: npm run build
   Publish directory: admin-panel/.next
   ```

5. Add environment variables:
   ```
   NEXT_PUBLIC_SSO_API_URL=https://auth.aryanstack.netlify.app
   NEXT_PUBLIC_ADMIN_API_URL=https://auth.aryanstack.netlify.app/admin
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   NEXT_PUBLIC_HYDRA_PUBLIC_URL=https://naughty-rubin-41sxbvuozm.projects.oryapis.com
   HYDRA_ADMIN_URL=https://naughty-rubin-41sxbvuozm.projects.oryapis.com/admin
   NEXT_PUBLIC_APP_URL=https://panel.aryanstack.netlify.app
   JWT_SECRET=your-super-secret-jwt-key
   NODE_ENV=production
   ```

6. Deploy from GitHub

### 4. Configure Ory Hydra (Ory Cloud)

Your Hydra instance is already running on Ory Cloud:
`https://naughty-rubin-41sxbvuozm.projects.oryapis.com`

1. Register OAuth2 clients via Ory Cloud Console:

**Client 1: AAIS Login UI**
```json
{
  "client_id": "aais-sso-client",
  "client_name": "AAIS Login UI",
  "client_secret": "your-client-secret",
  "redirect_uris": [
    "https://login.aryanstack.netlify.app/callback",
    "https://auth.aryanstack.netlify.app/callback"
  ],
  "grant_types": ["authorization_code", "refresh_token"],
  "response_types": ["code", "id_token"],
  "scope": "openid profile email",
  "token_endpoint_auth_method": "client_secret_basic"
}
```

**Client 2: AAIS Admin Panel**
```json
{
  "client_id": "aais-admin-panel",
  "client_name": "AAIS Admin Panel",
  "client_secret": "your-admin-panel-client-secret",
  "redirect_uris": [
    "https://panel.aryanstack.netlify.app/callback",
    "https://auth.aryanstack.netlify.app/callback"
  ],
  "grant_types": ["authorization_code", "refresh_token"],
  "response_types": ["code", "id_token"],
  "scope": "openid profile email admin",
  "token_endpoint_auth_method": "client_secret_basic"
}
```

## 🔧 Netlify Configuration Files

### Auth Server - `netlify.toml`

```toml
[build]
  command = "npm install"
  functions = "netlify/functions"
  publish = "."

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/.netlify/functions/api/:splat"
  status = 200

[functions]
  node_bundler = "esbuild"
```

### Login UI - `netlify.toml`

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"
  NEXT_TELEMETRY_DISABLED = "1"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### Admin Panel - `netlify.toml`

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"
  NEXT_TELEMETRY_DISABLED = "1"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

## 🗄️ Database Setup (Supabase)

Make sure your Supabase database has the following tables:

1. **users** - User accounts
2. **refresh_tokens** - Token storage
3. **applications** - OAuth2 applications
4. **api_keys** - API keys

Run the SQL scripts in `docs/database-schema.md`

## 🔐 Security Checklist

- [ ] All environment variables set in Netlify dashboard
- [ ] JWT_SECRET is unique and secure
- [ ] SESSION_SECRET is unique and secure
- [ ] CORS origins properly configured
- [ ] Hydra client secrets are secure
- [ ] Supabase service role key is protected
- [ ] HTTPS enforced on all domains
- [ ] Rate limiting configured

## 🧪 Testing

1. **Test Login Flow:**
   - Visit `https://login.aryanstack.netlify.app`
   - Click "Continue with AAIS"
   - Should redirect to Ory Hydra
   - Complete authentication
   - Should redirect back with token

2. **Test Admin Panel:**
   - Visit `https://panel.aryanstack.netlify.app`
   - Login with admin credentials
   - Verify dashboard loads
   - Test user management features

3. **Test API:**
   ```bash
   # Signup
   curl -X POST https://auth.aryanstack.netlify.app/signup \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"Test123!"}'
   
   # Login
   curl -X POST https://auth.aryanstack.netlify.app/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"Test123!"}'
   ```

## 🐛 Troubleshooting

### CORS Errors
- Verify `ALLOWED_ORIGINS` includes all frontend domains
- Check Netlify function headers

### OAuth Redirect Issues
- Verify redirect URIs match exactly in Hydra
- Check `HYDRA_REDIRECT_URI` environment variable

### Function Timeouts
- Netlify functions have 10s timeout (26s on Pro)
- Optimize database queries
- Consider upgrading Netlify plan

### Build Failures
- Check Node.js version (18+)
- Verify all dependencies in package.json
- Check build logs in Netlify dashboard

## 📊 Monitoring

Monitor your deployments:
- Netlify Analytics
- Netlify Functions logs
- Supabase dashboard
- Ory Cloud monitoring

## 🔄 CI/CD

Connect repositories to Netlify for automatic deployments:

1. Push to `main` branch
2. Netlify auto-builds and deploys
3. Environment variables persist
4. Zero-downtime deployments

## 📝 Notes

- Free tier Netlify has limitations (125k function requests/month)
- Consider Netlify Pro for production use
- Keep environment variables synced across all sites
- Use Netlify's secret management
- Enable deploy notifications

---

**Deployment Complete!** 🎉

Your AAIS SSO system is now running on:
- Auth: https://auth.aryanstack.netlify.app
- Login: https://login.aryanstack.netlify.app
- Admin: https://panel.aryanstack.netlify.app
