# Uplift Well-being Platform

A comprehensive mental health and wellness platform with Google OAuth authentication and MongoDB integration.

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- Google OAuth credentials

### Environment Configuration

1. **Set up your MongoDB password**: Replace `<db_password>` in `.env.local` with your actual MongoDB password
2. **Environment files are already created**:
   - `.env.local` - Server environment variables
   - `.env` - Frontend environment variables

### Installation

1. **Install frontend dependencies**:
   ```bash
   npm install
   ```

2. **Install server dependencies**:
   ```bash
   cd server
   npm install
   cd ..
   ```

### Running the Application

#### Option 1: Run both frontend and backend together
```bash
npm run dev:full
```

#### Option 2: Run separately
```bash
# Terminal 1 - Frontend (runs on http://localhost:8081)
npm run dev

# Terminal 2 - Backend (runs on http://localhost:3001)
npm run dev:server
```

### Google OAuth Setup

The Google OAuth is configured with your credentials in the `.env.local` file:
- **Client ID**: Set in `GOOGLE_CLIENT_ID` environment variable
- **Client Secret**: Set in `GOOGLE_CLIENT_SECRET` environment variable

Make sure to add these authorized redirect URIs in your Google Console:
- `http://localhost:3001/api/auth/google/callback`

### MongoDB Configuration

Your MongoDB connection string is configured in `.env.local`. Make sure to:
1. Replace `<db_password>` with your actual MongoDB password
2. Ensure your MongoDB cluster is accessible

### Key Features

- **Google OAuth Authentication**: One-click sign-in with Google
- **MongoDB Integration**: All data stored in MongoDB Atlas
- **Modern UI**: Built with shadcn/ui and Tailwind CSS
- **React 18**: Latest React with hooks and modern patterns
- **Express.js Backend**: RESTful API with passport authentication

### API Endpoints

- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - Google OAuth callback
- `POST /api/auth/register` - Traditional registration
- `POST /api/auth/login` - Traditional login
- `GET /api/auth/profile` - Get user profile
- And more...

### Project Structure

```
├── src/                  # Frontend React app
│   ├── components/       # UI components
│   ├── pages/           # Page components
│   ├── lib/             # Utilities and API client
│   └── hooks/           # Custom React hooks
├── server/              # Backend Express app
│   ├── src/
│   │   ├── controllers/ # Route controllers
│   │   ├── models/      # MongoDB models
│   │   ├── routes/      # API routes
│   │   └── config/      # Database and passport config
└── .env.local          # Environment variables
```

### Troubleshooting

1. **MongoDB Connection Issues**: Ensure your IP is whitelisted in MongoDB Atlas
2. **Google OAuth Issues**: Check that redirect URIs are correctly configured
3. **CORS Issues**: Frontend runs on 8081, backend on 3001 - CORS is configured for this

### Next Steps

1. Replace `<db_password>` in `.env.local` with your MongoDB password
2. Run `npm run dev:full` to start both frontend and backend
3. Navigate to `http://localhost:8081` to use the application

The application now uses MongoDB instead of PostgreSQL and includes full Google OAuth integration!
