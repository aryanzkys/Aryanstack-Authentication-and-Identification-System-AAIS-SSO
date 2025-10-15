# AAIS Admin Panel

Admin Management Panel for the Aryanstack Authentication and Identification System (AAIS) SSO.

## Features

- **User Management**: View, edit, and manage user accounts and roles
- **Application Management**: Register OAuth2 applications and manage client credentials
- **API Key Management**: Generate and manage API keys for external integrations
- **Hydra Client Management**: CRUD operations for OAuth2 clients in Ory Hydra
- **Dashboard**: Real-time statistics and system overview
- **Role-Based Access**: Admin, developer, and viewer roles

## Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Backend**: Node.js + Express (AAIS SSO API)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Ory Hydra OAuth2/OpenID Connect

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn
- Running AAIS SSO backend server
- Supabase account
- Ory Hydra instance

### Installation

1. **Install dependencies**

```bash
cd admin-panel
npm install
```

2. **Configure environment variables**

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
NEXT_PUBLIC_SSO_API_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

3. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser.

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
admin-panel/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── login/             # Login page
│   ├── dashboard/         # Dashboard page
│   ├── users/             # User management
│   ├── applications/      # Application management
│   ├── api-keys/          # API key management
│   ├── hydra-clients/     # Hydra client management
│   └── settings/          # Settings page
├── components/            # React components
│   ├── ui/               # UI components (shadcn/ui)
│   └── layout/           # Layout components
├── lib/                   # Utility functions
│   ├── api.ts            # API client
│   ├── supabase.ts       # Supabase client
│   └── utils.ts          # Helper functions
├── types/                 # TypeScript types
└── public/               # Static files
```

## Features

### Dashboard
- System statistics (users, applications, API keys)
- Recent activity
- Quick actions

### User Management
- View all registered users
- Edit user profiles and roles
- Deactivate/delete users
- Role assignment (admin, developer, user, viewer)

### Application Management
- Register new OAuth2 applications
- Generate client credentials (client_id, client_secret)
- Configure redirect URIs and scopes
- Manage application status

### API Key Management
- Generate secure API tokens
- Set expiration dates
- Revoke keys
- Track usage

### Hydra Client Management
- View OAuth2 clients registered in Hydra
- Create/update/delete clients
- Sync with Hydra Admin API
- Configure grant types and scopes

## API Endpoints (Backend)

The admin panel communicates with these backend endpoints:

```
GET    /admin/stats                 # Dashboard statistics
GET    /admin/users                 # List all users
PUT    /admin/users/:id/role        # Update user role
DELETE /admin/users/:id             # Delete user
GET    /admin/applications          # List applications
POST   /admin/applications          # Create application
PUT    /admin/applications/:id      # Update application
DELETE /admin/applications/:id      # Delete application
```

## Security

- Admin authentication via AAIS SSO
- Role-based access control (RBAC)
- JWT token validation on all API requests
- Secure credential storage in Supabase
- HTTPS required in production

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SSO_API_URL` | AAIS SSO backend URL |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `NEXT_PUBLIC_HYDRA_PUBLIC_URL` | Ory Hydra public URL |
| `HYDRA_ADMIN_URL` | Ory Hydra admin URL |

## Development

### Running in Development Mode

```bash
npm run dev
```

The app will run on port 3001 to avoid conflicts with the SSO backend (port 3000).

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Configure environment variables
4. Deploy

### Docker

```bash
docker build -t aais-admin-panel .
docker run -p 3001:3001 aais-admin-panel
```

## License

MIT

## Support

For issues and questions, please refer to the main AAIS SSO repository documentation.
