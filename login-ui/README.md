# AAIS Login UI

A beautiful, minimal, and secure login interface for the Aryanstack Authentication and Identification System (AAIS).

🔗 **Live Demo:** https://aais-login.netlify.app

## ✨ Features

- **Elegant Design**: Clean, minimal old-money aesthetic with monochrome palette
- **Secure Authentication**: Integration with AAIS SSO backend and Ory Hydra OAuth2
- **Smooth Animations**: Subtle Framer Motion transitions for enhanced UX
- **Responsive Layout**: Works seamlessly on desktop and mobile devices
- **Multiple Auth Methods**: 
  - Email/Password login
  - OAuth2 via Ory Hydra ("Continue with AAIS")
  - Optional Supabase Auth providers (Google, GitHub)

## 🎨 Design

- **Typography**: Playfair Display (serif) for headings, Inter (sans-serif) for body text
- **Colors**: White background, charcoal text, soft gold accents
- **Components**: shadcn/ui components with custom styling
- **Layout**: Centered card with rounded corners (2xl)

## 🚀 Quick Start

### Prerequisites

- Node.js 16.x or higher
- AAIS SSO backend running (http://localhost:3000)
- Ory Hydra instance (optional, for OAuth2)
- Supabase project (optional, for alternative auth)

### Installation

```bash
cd login-ui
npm install
```

### Configuration

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
NEXT_PUBLIC_HYDRA_CLIENT_ID=aais-sso-client
NEXT_PUBLIC_HYDRA_REDIRECT_URI=http://localhost:3002/callback
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3002](http://localhost:3002) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
login-ui/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with fonts
│   ├── page.tsx           # Home page (redirects to login)
│   └── globals.css        # Global styles
├── pages/                 # Next.js Pages Router
│   ├── login.tsx          # Login page
│   ├── signup.tsx         # Signup page
│   ├── callback.tsx       # OAuth2 callback handler
│   ├── _app.tsx           # App wrapper
│   └── _document.tsx      # HTML document
├── components/
│   └── ui/                # Reusable UI components
│       ├── button.tsx     # Button component
│       ├── input.tsx      # Input component
│       ├── card.tsx       # Card component
│       └── label.tsx      # Label component
├── lib/
│   ├── api.ts             # API client (Axios)
│   ├── supabaseClient.ts  # Supabase client
│   └── utils.ts           # Utility functions
├── public/                # Static assets
├── .env.example           # Environment variables template
├── next.config.js         # Next.js configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies
```

## 🔐 Authentication Flow

### Standard Login

1. User enters email and password
2. Frontend calls `POST /login` on AAIS backend
3. Backend validates credentials
4. Returns JWT access token
5. Token stored in localStorage
6. User redirected to dashboard/app

### OAuth2 Flow ("Continue with AAIS")

1. User clicks "Continue with AAIS"
2. Redirects to Ory Hydra authorization endpoint
3. User authenticates via Hydra
4. Hydra redirects to `/callback` with authorization code
5. Frontend exchanges code for tokens via `GET /callback`
6. Tokens stored and user redirected

### Signup Flow

1. User fills registration form
2. Frontend calls `POST /signup`
3. Backend creates user in Supabase
4. User registered in Ory Hydra
5. Redirect to OAuth2 authorization
6. Complete authentication flow

## 🎯 Pages

### Login Page (`/login`)

- Email and password fields
- "Sign In" button
- "Continue with AAIS" OAuth button
- Links to signup and password reset
- Error handling with animated messages
- Loading states

### Signup Page (`/signup`)

- Name fields (first/last)
- Email and password fields
- Password confirmation
- Validation (min 8 characters, matching passwords)
- "Create Account" button
- Link to login page

### Callback Page (`/callback`)

- Handles OAuth2 authorization code
- Exchanges code for tokens via backend
- Shows loading, success, or error states
- Auto-redirects on success
- Manual redirect button on error

## 🛠️ Technologies

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **HTTP Client**: Axios
- **Auth Backend**: AAIS SSO + Ory Hydra
- **Database**: Supabase (optional)

## 🎨 Customization

### Colors

Edit `tailwind.config.js` to customize the color scheme:

```js
colors: {
  gold: {
    DEFAULT: "#D4AF37",  // Gold accent
    light: "#F4E4C1",
  },
}
```

### Fonts

Edit `app/layout.tsx` to change fonts:

```tsx
const inter = Inter({ subsets: ['latin'] })
const playfair = Playfair_Display({ subsets: ['latin'] })
```

### Animations

Edit Framer Motion settings in page components:

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
```

## 📡 API Integration

The login UI communicates with these AAIS backend endpoints:

```
POST /signup
- Creates new user account
- Body: { email, password, firstName?, lastName? }

POST /login
- Authenticates user
- Body: { email, password }
- Returns: { accessToken, user, authUrl? }

GET /callback
- Handles OAuth2 callback
- Query: ?code=xxx&state=yyy
- Returns: { accessToken, idToken, refreshToken, user }
```

## 🔒 Security

- HTTPS enforced in production
- JWT tokens stored in localStorage
- CSRF protection via state parameter
- Password validation (min 8 characters)
- Rate limiting on backend
- Secure cookie handling
- Environment variables for secrets

## 🚢 Deployment

### Netlify (Recommended)

1. Push code to GitHub
2. Connect repository to Netlify
3. Configure environment variables
4. Deploy

### Vercel

```bash
npm install -g vercel
vercel
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3002
CMD ["npm", "start"]
```

## 🐛 Troubleshooting

### Login not working

- Verify AAIS backend is running on port 3000
- Check `NEXT_PUBLIC_API_BASE_URL` in `.env`
- Verify credentials are correct
- Check browser console for errors

### OAuth redirect fails

- Verify `NEXT_PUBLIC_HYDRA_REDIRECT_URI` matches registered redirect URI
- Check Ory Hydra is running
- Verify client ID is correct

### Styling issues

- Run `npm install` to ensure Tailwind is installed
- Check `tailwind.config.js` paths include your files
- Verify `globals.css` is imported in `_app.tsx`

## 📄 License

MIT - See LICENSE file in root directory

## 🤝 Contributing

See main repository CONTRIBUTING.md for guidelines.

---

**Secured by Aryanstack Authentication and Identification System**
