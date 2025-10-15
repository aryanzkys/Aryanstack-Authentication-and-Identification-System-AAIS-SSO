# AAIS Admin Panel - Complete Guide

## Overview

The AAIS Admin Panel is a comprehensive web-based management interface for the Aryanstack Authentication and Identification System. It provides administrators with tools to manage users, applications, API keys, and OAuth2 clients.

## Features

### 1. Authentication & Authorization
- Admin login via AAIS SSO backend
- Role-based access control (RBAC):
  - **Admin**: Full system access
  - **Developer**: Manage apps and API keys
  - **Viewer**: Read-only access
- JWT token-based session management

### 2. Dashboard
- Real-time system statistics
- User metrics (total, active)
- Application count
- API key count
- Recent login activity

### 3. User Management
- View all registered users with pagination
- Search and filter users
- Edit user profiles
- Assign/change user roles
- Deactivate/delete user accounts
- View user creation and last activity dates

### 4. Application Management
- Register new OAuth2 applications
- Generate client credentials (client_id, client_secret)
- Configure redirect URIs
- Set OAuth2 scopes
- Manage application status (active/inactive)
- Automatic registration with Ory Hydra

### 5. API Key Management
- Generate secure API tokens
- Associate keys with applications
- Set expiration dates
- Revoke keys
- Track key usage (last used timestamp)
- View key status

### 6. Ory Hydra Client Management
- View OAuth2 clients registered in Hydra
- Create new OAuth2 clients
- Update client configurations
- Delete OAuth2 clients
- Sync with Hydra Admin API

### 7. Settings
- User profile management
- System configuration view
- Security settings
- Password change
- Danger zone (clear sessions, reset system)

## Architecture

### Technology Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Radix UI primitives
- Lucide icons

**Backend Integration:**
- AAIS SSO API (Node.js + Express)
- Supabase PostgreSQL
- Ory Hydra Admin API

### Project Structure

```
admin-panel/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home/redirect page
│   ├── globals.css              # Global styles
│   ├── login/                   # Login page
│   ├── dashboard/               # Dashboard page
│   ├── users/                   # User management
│   ├── applications/            # Application management
│   ├── api-keys/                # API key management
│   ├── hydra-clients/           # Hydra client management
│   └── settings/                # Settings page
├── components/
│   ├── ui/                      # Reusable UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── ...
│   └── layout/                  # Layout components
│       ├── sidebar.tsx
│       └── dashboard-layout.tsx
├── lib/                         # Utilities and configurations
│   ├── api.ts                   # API client (axios)
│   ├── supabase.ts              # Supabase client
│   └── utils.ts                 # Helper functions
├── types/                       # TypeScript type definitions
│   └── index.ts
├── public/                      # Static assets
├── .env.example                 # Environment variables template
├── next.config.js               # Next.js configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies
```

## Installation & Setup

### Prerequisites

1. Node.js 16.x or higher
2. AAIS SSO backend running
3. Supabase project configured
4. Ory Hydra instance running

### Step 1: Install Dependencies

```bash
cd admin-panel
npm install
```

### Step 2: Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
# API Configuration
NEXT_PUBLIC_SSO_API_URL=http://localhost:3000
NEXT_PUBLIC_ADMIN_API_URL=http://localhost:3000/admin

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Ory Hydra Configuration
NEXT_PUBLIC_HYDRA_PUBLIC_URL=http://localhost:4444
HYDRA_ADMIN_URL=http://localhost:4445

# JWT Configuration
JWT_SECRET=your-jwt-secret
```

### Step 3: Run Development Server

```bash
npm run dev
```

The admin panel will be available at http://localhost:3001

### Step 4: Login

1. Navigate to http://localhost:3001
2. You'll be redirected to the login page
3. Enter admin credentials
4. Upon successful authentication, you'll be redirected to the dashboard

## API Integration

The admin panel communicates with the AAIS SSO backend via REST APIs.

### Backend Endpoints

#### Authentication
```
POST /login
- Authenticates admin user
- Returns JWT access token
```

#### Dashboard
```
GET /admin/stats
- Returns dashboard statistics
- Requires admin role
```

#### User Management
```
GET /admin/users
- List all users with pagination
- Query params: page, limit

PUT /admin/users/:userId/role
- Update user role
- Body: { role: 'admin' | 'developer' | 'viewer' | 'user' }

PUT /admin/users/:userId/deactivate
- Deactivate user account

DELETE /admin/users/:userId
- Delete user account
```

#### Application Management
```
GET /admin/applications
- List all registered applications

POST /admin/applications
- Register new OAuth2 application
- Body: { name, description, redirectUris, scopes }

PUT /admin/applications/:appId
- Update application
- Body: { name, description, redirectUris, scopes, isActive }

DELETE /admin/applications/:appId
- Delete application
```

### Authentication Flow

1. User enters credentials on login page
2. Frontend calls `POST /login` endpoint
3. Backend validates credentials in Supabase
4. If valid and user has admin/developer role:
   - Backend generates JWT access token
   - Frontend stores token in localStorage
5. Frontend redirects to dashboard
6. All subsequent API calls include token in Authorization header
7. Backend validates token on each request

### Token Management

- Access tokens stored in localStorage
- Token included in Authorization header: `Bearer <token>`
- Expired tokens trigger redirect to login
- Logout clears token from localStorage

## Database Schema

### Required Tables

#### users (existing, updated)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(50) DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### applications (new)
```sql
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  client_id VARCHAR(255) UNIQUE NOT NULL,
  client_secret VARCHAR(255) NOT NULL,
  redirect_uris TEXT[],
  scopes TEXT[],
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);
```

#### api_keys (new)
```sql
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  key VARCHAR(255) UNIQUE NOT NULL,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  last_used_at TIMESTAMP WITH TIME ZONE
);
```

## Security

### Authentication
- JWT-based authentication
- Role-based access control
- Secure password hashing (bcrypt)

### Authorization
- Admin/Developer roles required for access
- Middleware checks on all protected routes
- Token validation on every request

### Data Protection
- HTTPS in production
- Environment variables for secrets
- SQL injection prevention via parameterized queries
- XSS protection via React
- CSRF protection

### Rate Limiting
- API rate limiting on backend
- Prevents brute force attacks
- Configurable limits per endpoint

## Development

### Running Tests

```bash
npm run test
```

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

### Building for Production

```bash
npm run build
npm start
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

### Docker

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3001
CMD ["npm", "start"]
```

### Environment Variables in Production

Ensure all environment variables are set:
- Use secrets management (AWS Secrets Manager, etc.)
- Enable HTTPS
- Configure CORS properly
- Set secure session cookies

## Troubleshooting

### Login Issues
- Verify SSO backend is running
- Check credentials are correct
- Ensure user has admin/developer role
- Check browser console for errors

### API Connection Errors
- Verify NEXT_PUBLIC_SSO_API_URL is correct
- Check backend is accessible
- Verify CORS settings
- Check network tab in browser DevTools

### Build Errors
- Clear .next folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run type-check`

## Contributing

See main repository CONTRIBUTING.md for guidelines.

## License

MIT - See LICENSE file in root directory
