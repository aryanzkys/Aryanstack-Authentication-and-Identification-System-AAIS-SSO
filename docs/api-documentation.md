# API Documentation

## Base URL

```
http://localhost:3000
```

## Authentication

Most endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## Endpoints

### 1. Health Check

Check if the API is running.

**Endpoint:** `GET /health`

**Authentication:** Not required

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-10-15T12:45:24.952Z",
  "environment": "development"
}
```

---

### 2. Sign Up

Register a new user account.

**Endpoint:** `POST /signup`

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe",
  "role": "user"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**

- `400 Bad Request`: Missing required fields
- `409 Conflict`: User with email already exists
- `500 Internal Server Error`: Server error

---

### 3. Login

Authenticate a user and receive access tokens.

**Endpoint:** `POST /login`

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "authUrl": "http://localhost:4444/oauth2/auth?client_id=..."
}
```

**Error Responses:**

- `400 Bad Request`: Missing email or password
- `401 Unauthorized`: Invalid credentials
- `500 Internal Server Error`: Server error

---

### 4. OAuth2 Callback

Handle OAuth2 authorization code callback from Ory Hydra.

**Endpoint:** `GET /callback`

**Authentication:** Not required

**Query Parameters:**
- `code` (required): Authorization code from OAuth2 provider
- `state` (optional): State parameter for CSRF protection

**Example:**
```
GET /callback?code=AUTH_CODE&state=BASE64_ENCODED_STATE
```

**Response (200 OK):**
```json
{
  "message": "Authentication successful",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "idToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  }
}
```

**Error Responses:**

- `400 Bad Request`: Missing authorization code
- `401 Unauthorized`: Invalid or expired code
- `500 Internal Server Error`: Server error

---

### 5. Get Profile

Get the current user's profile information.

**Endpoint:** `GET /profile`

**Authentication:** Required (Bearer token)

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "createdAt": "2025-10-15T12:00:00.000Z",
    "updatedAt": "2025-10-15T12:00:00.000Z"
  }
}
```

**Error Responses:**

- `401 Unauthorized`: No token provided or invalid token
- `404 Not Found`: User not found
- `500 Internal Server Error`: Server error

---

### 6. Logout

Logout the current user and revoke tokens.

**Endpoint:** `GET /logout`

**Authentication:** Required (Bearer token)

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

**Error Responses:**

- `401 Unauthorized`: No token provided or invalid token
- `500 Internal Server Error`: Server error

---

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error Name",
  "message": "Detailed error message"
}
```

### Common Error Codes

- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required or failed
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource conflict (e.g., duplicate email)
- `500 Internal Server Error`: Server-side error

---

## Rate Limiting

Currently, there is no rate limiting implemented. It's recommended to add rate limiting in production.

---

## CORS

CORS is enabled for the origins specified in the `ALLOWED_ORIGINS` environment variable.

Default allowed origins:
- `http://localhost:3000`
- `http://localhost:3001`

---

## Token Expiration

- **Access Token:** 1 hour (configurable via `JWT_EXPIRES_IN`)
- **Refresh Token:** 7 days (configurable via `JWT_REFRESH_EXPIRES_IN`)

---

## Development Tips

### Using curl

**Sign up:**
```bash
curl -X POST http://localhost:3000/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123","firstName":"John","lastName":"Doe"}'
```

**Login:**
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123"}'
```

**Get Profile:**
```bash
curl -X GET http://localhost:3000/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Logout:**
```bash
curl -X GET http://localhost:3000/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Using Postman

Import the collection from `postman/AAIS-SSO-API.postman_collection.json` and use the pre-configured requests.

---

## Security Considerations

1. **Always use HTTPS in production**
2. **Rotate JWT secrets regularly**
3. **Implement rate limiting**
4. **Enable CORS only for trusted origins**
5. **Use strong password policies**
6. **Validate all input data**
7. **Keep dependencies updated**
8. **Monitor logs for suspicious activity**
