# Development Guide

This guide will help you set up your development environment and contribute to the AAIS SSO project.

## Prerequisites

- Node.js 16.x or higher
- npm 8.x or higher
- Git
- Docker and Docker Compose (for Ory Hydra)
- A Supabase account

## Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/aryanzkys/Aryanstack-Authentication-and-Identification-System-AAIS-SSO.git
cd Aryanstack-Authentication-and-Identification-System-AAIS-SSO
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and configure your environment:

```env
PORT=3000
NODE_ENV=development

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Ory Hydra
HYDRA_ADMIN_URL=http://localhost:4445
HYDRA_PUBLIC_URL=http://localhost:4444
HYDRA_CLIENT_ID=aais-sso-client
HYDRA_CLIENT_SECRET=dev-client-secret

# JWT
JWT_SECRET=dev-jwt-secret-change-in-production
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Session
SESSION_SECRET=dev-session-secret-change-in-production

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### 4. Set Up Supabase

1. Go to [Supabase](https://supabase.com/) and create a new project
2. Navigate to the SQL Editor
3. Run the database schema from `docs/database-schema.md`:

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

4. Copy your Supabase URL and keys to `.env`

### 5. Set Up Ory Hydra with Docker

1. Create `docker-compose.yml` in the project root (see `docs/hydra-setup.md` for full configuration):

```yaml
version: '3.7'

services:
  hydra-migrate:
    image: oryd/hydra:v2.2.0
    environment:
      - DSN=postgres://hydra:secret@postgres:5432/hydra?sslmode=disable
    command: migrate sql -e --yes
    restart: on-failure
    depends_on:
      - postgres

  hydra:
    image: oryd/hydra:v2.2.0
    ports:
      - "4444:4444"
      - "4445:4445"
    command: serve all --dev
    environment:
      - URLS_SELF_ISSUER=http://localhost:4444
      - URLS_CONSENT=http://localhost:3000/consent
      - URLS_LOGIN=http://localhost:3000/login
      - DSN=postgres://hydra:secret@postgres:5432/hydra?sslmode=disable
      - SECRETS_SYSTEM=youReallyNeedToChangeThis
    restart: unless-stopped
    depends_on:
      - hydra-migrate

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_USER=hydra
      - POSTGRES_PASSWORD=secret
      - POSTGRES_DB=hydra
    volumes:
      - hydra-postgres:/var/lib/postgresql/data

volumes:
  hydra-postgres:
```

2. Start Hydra:

```bash
docker-compose up -d
```

3. Verify Hydra is running:

```bash
curl http://localhost:4445/health/ready
```

## Running the Application

### Development Mode (with auto-reload)

```bash
npm run dev
```

The server will start on `http://localhost:3000` and automatically restart when you make changes.

### Production Mode

```bash
npm start
```

## Project Structure

```
.
├── src/
│   ├── config/           # Configuration files
│   │   ├── index.js      # Main configuration
│   │   ├── supabase.js   # Supabase client setup
│   │   └── hydra.js      # Hydra OAuth2 client setup
│   ├── controllers/      # Request handlers
│   │   ├── authController.js     # Signup
│   │   ├── oauthController.js    # Login & OAuth callback
│   │   ├── userController.js     # User profile
│   │   └── logoutController.js   # Logout
│   ├── middleware/       # Express middleware
│   │   ├── auth.js       # JWT verification
│   │   └── errorHandler.js # Error handling
│   ├── routes/           # Route definitions
│   │   └── index.js      # All routes
│   ├── utils/            # Utility functions
│   │   ├── jwt.js        # JWT helpers
│   │   └── logger.js     # Logging
│   └── server.js         # Express app entry point
├── docs/                 # Documentation
├── postman/              # Postman collection
├── .env.example          # Environment template
└── package.json          # Dependencies
```

## Development Workflow

### 1. Make Changes

- Edit files in `src/`
- Server will auto-reload if using `npm run dev`

### 2. Test Your Changes

Use Postman or curl:

```bash
# Health check
curl http://localhost:3000/health

# Sign up
curl -X POST http://localhost:3000/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","firstName":"Test","lastName":"User"}'

# Login
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### 3. Check Logs

The application uses a simple logger that outputs to console:

```
[INFO] timestamp message
[ERROR] timestamp error
[WARN] timestamp warning
[DEBUG] timestamp debug (only in development)
```

### 4. Debugging

**Enable detailed logging:**

Set `NODE_ENV=development` in `.env` to see debug logs.

**Check Hydra logs:**

```bash
docker-compose logs -f hydra
```

**Check Supabase logs:**

Go to your Supabase dashboard → Logs

## Testing

### Manual Testing with Postman

1. Import `postman/AAIS-SSO-API.postman_collection.json`
2. Set `baseUrl` to `http://localhost:3000`
3. Run the requests in order:
   - Sign Up
   - Login (saves token)
   - Get Profile (uses saved token)
   - Logout

### Testing with curl

See `docs/api-documentation.md` for curl examples.

## Common Development Tasks

### Adding a New Endpoint

1. **Create or update controller** in `src/controllers/`

```javascript
// src/controllers/myController.js
const myFunction = async (req, res, next) => {
  try {
    // Your logic here
    res.json({ message: 'Success' });
  } catch (error) {
    next(error);
  }
};

module.exports = { myFunction };
```

2. **Add route** in `src/routes/index.js`

```javascript
const { myFunction } = require('../controllers/myController');

router.get('/my-endpoint', verifyToken, myFunction);
```

3. **Test the endpoint**

```bash
curl http://localhost:3000/my-endpoint
```

### Adding Middleware

1. **Create middleware** in `src/middleware/`

```javascript
// src/middleware/myMiddleware.js
const myMiddleware = (req, res, next) => {
  // Your logic
  next();
};

module.exports = { myMiddleware };
```

2. **Use in routes**

```javascript
const { myMiddleware } = require('../middleware/myMiddleware');

router.get('/endpoint', myMiddleware, controller);
```

### Adding a New Database Table

1. **Create migration SQL** in Supabase SQL Editor:

```sql
CREATE TABLE my_table (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

2. **Document in** `docs/database-schema.md`

3. **Use in controller** via Supabase client:

```javascript
const { supabaseAdmin } = require('../config/supabase');

const { data, error } = await supabaseAdmin
  .from('my_table')
  .select('*');
```

## Troubleshooting

### Server won't start

- Check if port 3000 is available: `lsof -i :3000`
- Verify `.env` file exists and is configured
- Check for syntax errors: `node -c src/server.js`

### Hydra connection fails

- Ensure Docker is running: `docker ps`
- Check Hydra is healthy: `curl http://localhost:4445/health/ready`
- Review Hydra logs: `docker-compose logs hydra`

### Database queries fail

- Verify Supabase credentials in `.env`
- Check tables exist in Supabase dashboard
- Review Supabase logs

### JWT token invalid

- Verify `JWT_SECRET` matches between token creation and verification
- Check token hasn't expired
- Ensure correct token format: `Bearer TOKEN`

## Code Style

- Use ES6+ features (const, arrow functions, async/await)
- Use meaningful variable names
- Add JSDoc comments for functions
- Handle all errors with try/catch
- Use the logger utility instead of console.log

Example:

```javascript
/**
 * Get user by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User object
 */
const getUserById = async (userId) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    logger.error('Error fetching user:', error);
    throw error;
  }
};
```

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [Ory Hydra Documentation](https://www.ory.sh/docs/hydra)
- [Supabase Documentation](https://supabase.com/docs)
- [JWT.io](https://jwt.io/)
- [OAuth 2.0 RFC](https://oauth.net/2/)

## Getting Help

- Check existing documentation
- Review GitHub issues
- Ask in project discussions
- Consult Hydra/Supabase community forums
