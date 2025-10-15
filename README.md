# Aryanstack-Authentication-and-Identification-System-AAIS-SSO

A comprehensive Single Sign-On (SSO) authentication system for Aryanstack websites using Node.js, Express, Ory Hydra (OAuth2/OpenID Connect), and Supabase (PostgreSQL) with a modern admin management panel.

## 🎉 Features

### SSO Backend
- **Complete OAuth2/OpenID Connect integration** with Ory Hydra
- **User management** with Supabase PostgreSQL
- **JWT-based authentication** with access and refresh tokens
- **Secure password hashing** using bcrypt
- **Token validation middleware** for protected routes
- **Session management** with refresh token storage
- **RESTful API** with comprehensive error handling
- **Rate limiting** for security
- **Postman collection** for easy API testing

### Admin Management Panel (NEW)
- **Modern Next.js dashboard** with TypeScript and Tailwind CSS
- **User management**: View, edit, delete users and manage roles
- **Application management**: Register OAuth2 apps with client credentials
- **API key management**: Generate and manage secure API tokens
- **Hydra client management**: CRUD operations for OAuth2 clients
- **Real-time statistics**: Dashboard with system metrics
- **Role-based access control**: Admin, developer, and viewer roles

## 📋 Table of Contents

- [Architecture](#architecture)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Admin Panel](#admin-panel)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

## 🏗️ Architecture

The system consists of two main components:

1. **SSO Backend** (Node.js + Express)
   - Authentication and authorization endpoints
   - OAuth2/OpenID Connect integration with Ory Hydra
   - User data storage in Supabase
   - Admin API endpoints

2. **Admin Panel** (Next.js + TypeScript)
   - Web-based management interface
   - User and application management
   - API key generation
   - System monitoring and statistics

```
┌─────────────────────────────────────────────────────────────┐
│                     AAIS SSO System                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────┐         ┌──────────────────┐         │
│  │   Admin Panel    │◄────────┤   SSO Backend    │         │
│  │  (Next.js App)   │         │ (Express Server) │         │
│  └──────────────────┘         └────────┬─────────┘         │
│                                        │                    │
│                          ┌─────────────┼─────────────┐      │
│                          │             │             │      │
│                    ┌─────▼─────┐ ┌────▼────┐ ┌─────▼─────┐│
│                    │  Supabase │ │  Hydra  │ │  Client   ││
│                    │(PostgreSQL)│ │(OAuth2) │ │   Apps    ││
│                    └───────────┘ └─────────┘ └───────────┘│
└─────────────────────────────────────────────────────────────┘
```

## 🛠️ Requirements

- Node.js 16.x or higher
- npm or yarn
- Supabase account and project
- Ory Hydra (Docker recommended)
- PostgreSQL (included with Supabase)

## 📦 Installation

1. **Clone the repository**

```bash
git clone https://github.com/aryanzkys/Aryanstack-Authentication-and-Identification-System-AAIS-SSO.git
cd Aryanstack-Authentication-and-Identification-System-AAIS-SSO
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env
```

Edit `.env` file with your configuration:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Ory Hydra Configuration
HYDRA_ADMIN_URL=http://localhost:4445
HYDRA_PUBLIC_URL=http://localhost:4444
HYDRA_CLIENT_ID=aais-sso-client
HYDRA_CLIENT_SECRET=your-client-secret
HYDRA_REDIRECT_URI=http://localhost:3000/callback

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Session Configuration
SESSION_SECRET=your-session-secret-change-this-in-production
```

## 🗄️ Database Setup

1. **Create Supabase Project**
   - Go to [Supabase](https://supabase.com/)
   - Create a new project
   - Copy your project URL and API keys

2. **Run Database Migrations**

Execute the SQL scripts in `docs/database-schema.md` in your Supabase SQL Editor:

```sql
-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create refresh_tokens table
CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
```

For detailed database setup instructions, see [docs/database-schema.md](docs/database-schema.md)

## 🐳 Ory Hydra Setup

Follow the detailed setup guide in [docs/hydra-setup.md](docs/hydra-setup.md)

**Quick Setup with Docker:**

1. Create `docker-compose.yml` (see hydra-setup.md)
2. Start Hydra: `docker-compose up -d`
3. Verify: `curl http://localhost:4445/health/ready`

The application will automatically create the OAuth2 client when it starts.

## 🏃 Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start on `http://localhost:3000` (or the port specified in `.env`)

## 🎨 Admin Panel

The Admin Management Panel provides a web interface to manage the SSO system.

### Quick Start

```bash
cd admin-panel
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

The admin panel will start on `http://localhost:3001`

### Features

- **Dashboard**: System statistics and metrics
- **User Management**: View, edit, delete users; manage roles
- **Application Management**: Register OAuth2 apps, generate client credentials
- **API Key Management**: Generate and manage secure API tokens
- **Hydra Client Management**: Manage OAuth2 clients in Ory Hydra
- **Settings**: System configuration and security settings

### Login

1. Navigate to http://localhost:3001
2. Login with admin credentials (must have admin or developer role)
3. Access the dashboard

For detailed admin panel documentation, see [admin-panel/README.md](admin-panel/README.md) and [admin-panel/DOCUMENTATION.md](admin-panel/DOCUMENTATION.md)

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/signup` | Register a new user | No |
| POST | `/login` | Login with credentials | No |
| GET | `/callback` | OAuth2 callback endpoint | No |
| GET | `/profile` | Get user profile | Yes |
| GET | `/logout` | Logout and revoke tokens | Yes |
| GET | `/health` | Health check | No |

### Request Examples

**Sign Up**
```bash
curl -X POST http://localhost:3000/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Login**
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }'
```

**Get Profile**
```bash
curl -X GET http://localhost:3000/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Logout**
```bash
curl -X GET http://localhost:3000/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 📁 Project Structure

```
.
├── src/
│   ├── config/           # Configuration files
│   │   ├── index.js      # Main config
│   │   ├── supabase.js   # Supabase client setup
│   │   └── hydra.js      # Ory Hydra client setup
│   ├── controllers/      # Route controllers
│   │   ├── authController.js     # Signup logic
│   │   ├── oauthController.js    # Login & OAuth callback
│   │   ├── userController.js     # User profile
│   │   └── logoutController.js   # Logout logic
│   ├── middleware/       # Express middleware
│   │   ├── auth.js       # JWT verification
│   │   └── errorHandler.js # Error handling
│   ├── routes/           # API routes
│   │   └── index.js      # Route definitions
│   ├── utils/            # Utility functions
│   │   ├── jwt.js        # JWT helpers
│   │   └── logger.js     # Logging utility
│   └── server.js         # Express app entry point
├── docs/                 # Documentation
│   ├── database-schema.md    # Database setup
│   └── hydra-setup.md        # Hydra setup guide
├── postman/              # Postman collection
│   └── AAIS-SSO-API.postman_collection.json
├── .env.example          # Environment variables template
├── .gitignore            # Git ignore rules
├── package.json          # Project dependencies
└── README.md             # This file
```

## 🧪 Testing with Postman

1. Import the Postman collection from `postman/AAIS-SSO-API.postman_collection.json`
2. Set the `baseUrl` variable to your server URL (default: `http://localhost:3000`)
3. Use the collection to test all API endpoints
4. After login/signup, the `accessToken` will be available for protected endpoints

## 🔐 Security

This application implements several security best practices:

- **Password Hashing**: Uses bcrypt with salt rounds
- **JWT Tokens**: Secure token-based authentication
- **Helmet**: Security headers
- **CORS**: Configurable cross-origin resource sharing
- **Session Security**: HTTP-only cookies in production
- **Input Validation**: Request validation
- **SQL Injection Protection**: Parameterized queries via Supabase
- **Environment Variables**: Sensitive data stored in .env

### Security Recommendations

1. Always use HTTPS in production
2. Change all default secrets in `.env`
3. Enable Row Level Security (RLS) in Supabase
4. Implement rate limiting for production
5. Regular security audits and dependency updates
6. Use strong password policies
7. Enable 2FA for admin accounts

## 🔧 Development

### Adding New Features

1. Create controller in `src/controllers/`
2. Add route in `src/routes/`
3. Add middleware if needed in `src/middleware/`
4. Update documentation
5. Add to Postman collection

### Code Style

- Use ES6+ features
- Follow existing code structure
- Add JSDoc comments for functions
- Handle errors appropriately
- Log important events

## 🐛 Troubleshooting

### Common Issues

**Port already in use**
```bash
# Change PORT in .env or kill the process
lsof -ti:3000 | xargs kill
```

**Database connection failed**
- Verify Supabase URL and keys
- Check if tables exist
- Review database logs in Supabase dashboard

**Hydra connection failed**
- Ensure Hydra is running: `docker-compose ps`
- Check Hydra logs: `docker-compose logs hydra`
- Verify HYDRA_ADMIN_URL and HYDRA_PUBLIC_URL

**Token verification fails**
- Check JWT_SECRET matches
- Verify token hasn't expired
- Ensure Authorization header format: `Bearer TOKEN`

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Review Hydra and Supabase docs

## 🙏 Acknowledgments

- [Ory Hydra](https://www.ory.sh/hydra) - OAuth2 and OpenID Connect
- [Supabase](https://supabase.com/) - PostgreSQL database
- [Express](https://expressjs.com/) - Web framework
- Node.js community for excellent packages