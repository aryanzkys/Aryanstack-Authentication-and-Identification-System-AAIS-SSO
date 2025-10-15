# Ory Hydra Setup Guide

This guide explains how to set up Ory Hydra for the AAIS SSO system.

## Installation

### Using Docker (Recommended)

1. **Install Docker and Docker Compose**
   - Follow the official Docker installation guide for your platform

2. **Create a docker-compose.yml file**

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
      - "4444:4444" # Public port
      - "4445:4445" # Admin port
    command: serve all --dev
    environment:
      - URLS_SELF_ISSUER=http://localhost:4444
      - URLS_CONSENT=http://localhost:3000/consent
      - URLS_LOGIN=http://localhost:3000/login
      - DSN=postgres://hydra:secret@postgres:5432/hydra?sslmode=disable
      - SECRETS_SYSTEM=youReallyNeedToChangeThis
      - OIDC_SUBJECT_IDENTIFIERS_SUPPORTED_TYPES=public,pairwise
      - OIDC_SUBJECT_IDENTIFIERS_PAIRWISE_SALT=youReallyNeedToChangeThis
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
    ports:
      - "5432:5432"

volumes:
  hydra-postgres:
```

3. **Start Hydra**

```bash
docker-compose up -d
```

4. **Verify Hydra is running**

```bash
# Check health
curl http://localhost:4445/health/ready

# Should return: {"status":"ok"}
```

## Creating OAuth2 Client

### Using Hydra CLI

```bash
# Create a client
docker-compose exec hydra \
  hydra create client \
    --endpoint http://localhost:4445 \
    --id aais-sso-client \
    --secret your-client-secret \
    --grant-types authorization_code,refresh_token \
    --response-types code,id_token \
    --scope openid,profile,email,offline_access \
    --callbacks http://localhost:3000/callback
```

### Using HTTP API

```bash
curl -X POST http://localhost:4445/admin/clients \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "aais-sso-client",
    "client_secret": "your-client-secret",
    "grant_types": ["authorization_code", "refresh_token"],
    "response_types": ["code", "id_token"],
    "redirect_uris": ["http://localhost:3000/callback"],
    "scope": "openid profile email offline_access",
    "token_endpoint_auth_method": "client_secret_basic"
  }'
```

## Configuration

Update your `.env` file with Hydra configuration:

```env
HYDRA_ADMIN_URL=http://localhost:4445
HYDRA_PUBLIC_URL=http://localhost:4444
HYDRA_CLIENT_ID=aais-sso-client
HYDRA_CLIENT_SECRET=your-client-secret
HYDRA_REDIRECT_URI=http://localhost:3000/callback
HYDRA_LOGOUT_REDIRECT_URI=http://localhost:3000/
```

## OAuth2 Flow

### Authorization Code Flow

1. **Authorization Request**
   ```
   GET /oauth2/auth?
     client_id=aais-sso-client&
     response_type=code&
     scope=openid+profile+email&
     redirect_uri=http://localhost:3000/callback&
     state=random_state_string
   ```

2. **User Login** (handled by your app)
   - User provides credentials
   - App validates credentials
   - App accepts login challenge

3. **Consent** (handled by your app or skipped)
   - User consents to scopes
   - App accepts consent challenge

4. **Authorization Code**
   - Hydra redirects to callback with code
   - `http://localhost:3000/callback?code=...&state=...`

5. **Token Exchange**
   ```bash
   POST /oauth2/token
   Content-Type: application/x-www-form-urlencoded
   
   grant_type=authorization_code&
   code=AUTHORIZATION_CODE&
   redirect_uri=http://localhost:3000/callback&
   client_id=aais-sso-client&
   client_secret=your-client-secret
   ```

6. **Response**
   ```json
   {
     "access_token": "...",
     "token_type": "bearer",
     "expires_in": 3600,
     "refresh_token": "...",
     "id_token": "..."
   }
   ```

## Testing

### Test Authorization Endpoint

```bash
# This should redirect to login URL
curl -i "http://localhost:4444/oauth2/auth?client_id=aais-sso-client&response_type=code&scope=openid&redirect_uri=http://localhost:3000/callback&state=test"
```

### Introspect Token

```bash
curl -X POST http://localhost:4445/admin/oauth2/introspect \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "token=YOUR_ACCESS_TOKEN"
```

### Revoke Token

```bash
curl -X POST http://localhost:4445/oauth2/revoke \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -u "aais-sso-client:your-client-secret" \
  -d "token=YOUR_TOKEN"
```

## Production Considerations

1. **Use HTTPS in production**
   - Update all URLs to use https://
   - Use valid SSL certificates

2. **Secure secrets**
   - Use strong random secrets
   - Store secrets securely (e.g., AWS Secrets Manager, HashiCorp Vault)

3. **Database**
   - Use managed PostgreSQL service
   - Enable SSL connections
   - Regular backups

4. **Monitoring**
   - Enable Hydra metrics
   - Monitor logs
   - Set up alerts

5. **Security**
   - Keep Hydra updated
   - Review security best practices
   - Implement rate limiting

## Troubleshooting

### Hydra not starting

- Check Docker logs: `docker-compose logs hydra`
- Verify PostgreSQL is running
- Check database connection string

### Client not found

- List clients: `docker-compose exec hydra hydra list clients --endpoint http://localhost:4445`
- Recreate client if needed

### Token validation fails

- Verify token is not expired
- Check client credentials
- Ensure scopes match

## References

- [Ory Hydra Documentation](https://www.ory.sh/docs/hydra)
- [OAuth 2.0 Specification](https://oauth.net/2/)
- [OpenID Connect](https://openid.net/connect/)
