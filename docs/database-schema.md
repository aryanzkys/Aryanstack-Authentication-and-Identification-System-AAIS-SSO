# Database Schema for AAIS SSO

This document describes the required database tables for the AAIS SSO system.

## Supabase Tables

### 1. users table

```sql
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

-- Create index on email for faster lookups
CREATE INDEX idx_users_email ON users(email);
```

### 2. refresh_tokens table

```sql
CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster lookups
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);

-- Create index on token for faster lookups
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
```

### 3. oauth_clients table (Optional)

```sql
CREATE TABLE oauth_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id VARCHAR(255) UNIQUE NOT NULL,
  client_name VARCHAR(255) NOT NULL,
  redirect_uris TEXT[],
  allowed_scopes TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Row Level Security (RLS)

Enable RLS for security:

```sql
-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read their own data
CREATE POLICY users_select_own ON users
  FOR SELECT
  USING (auth.uid() = id);

-- Enable RLS on refresh_tokens table
ALTER TABLE refresh_tokens ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only manage their own refresh tokens
CREATE POLICY refresh_tokens_select_own ON refresh_tokens
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY refresh_tokens_delete_own ON refresh_tokens
  FOR DELETE
  USING (auth.uid() = user_id);
```

## Setup Instructions

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the table creation scripts above
4. Enable Row Level Security (optional but recommended)
5. Update your `.env` file with Supabase credentials
