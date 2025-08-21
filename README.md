# Uplift Well-being Platform

A comprehensive mental health and wellness platform built with React (JavaScript) and Node.js, featuring MongoDB for data storage and Google OAuth for authentication.

## 🚀 Project Overview

Uplift is a wellness platform that helps users:
- Track their mood and emotional state
- Keep a personal journal
- Practice meditation and mindfulness
- Set and track wellness goals
- Connect with a supportive community
- Access crisis resources
- Get AI-powered wellness guidance

## 🛠️ Technology Stack

### Frontend
- **React 18** with JavaScript/JSX
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **React Router** for navigation
- **TanStack Query** for data management

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Google OAuth 2.0** for authentication
- **JWT** for session management
- **Passport.js** for OAuth strategy
- **bcryptjs** for password hashing

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Google Cloud Console account (for OAuth setup)
- npm or yarn package manager

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd uplift-well-being
```

### 2. Install Dependencies

Install frontend dependencies:
```bash
npm install
```

Install backend dependencies:
```bash
cd server
npm install
cd ..
```

### 3. Database Setup

#### Option A: Local MongoDB
1. Install MongoDB on your system
2. Start MongoDB service
3. The database will be created automatically when the server starts

#### Option B: MongoDB Atlas
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Use it in the environment variables

### 4. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback` (development)
6. Note down your Client ID and Client Secret

### 5. Environment Configuration

Create environment files:

**Server environment** (`server/.env`):
```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/uplift_wellbeing

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Session Configuration
SESSION_SECRET=your-session-secret-key

# Frontend URL
FRONTEND_URL=http://localhost:8080

# Server Configuration
PORT=5000

# AI Configuration (Optional)
GEMINI_API_KEY=your-gemini-api-key

# Node Environment
NODE_ENV=development
```

**Frontend environment** (`.env`):
```env
# Frontend Configuration
VITE_API_URL=http://localhost:5000/api
```

### 6. Running the Application

#### Development Mode

1. Start the backend server:
```bash
cd server
npm run dev
```

2. In a new terminal, start the frontend:
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:8080
- Backend API: http://localhost:5000

## 🔐 Authentication Flow

The application supports two authentication methods:

### 1. Google OAuth
- Click "Continue with Google" button
- Redirects to Google OAuth
- Automatically creates user account
- Redirects back to dashboard

### 2. Traditional Email/Password
- Register with email and password
- Login with credentials
- Password reset functionality available

## 📁 Project Structure

```
uplift-well-being/
├── src/                          # Frontend source code
│   ├── components/              # React components
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── GoogleAuthButton.jsx
│   │   └── ...
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Utilities and API client
│   ├── pages/                   # Page components
│   └── main.jsx                # App entry point
├── server/                      # Backend source code
│   ├── src/
│   │   ├── config/             # Database and OAuth config
│   │   ├── controllers/        # Route controllers
│   │   ├── middleware/         # Express middleware
│   │   ├── models/             # MongoDB models
│   │   ├── routes/             # API routes
│   │   └── server.js           # Server entry point
│   └── package.json
├── public/                      # Static assets
├── package.json                 # Frontend dependencies
└── README.md
```

## 🗄️ Database Models

The application uses the following MongoDB models:

- **User**: User accounts and profiles
- **MoodEntry**: Daily mood tracking entries
- **JournalEntry**: Personal journal entries
- **MeditationSession**: Meditation practice records
- **WellnessGoal**: Personal wellness goals
- **CommunityPost**: Community forum posts
- **CrisisResource**: Mental health crisis resources

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Mood Tracking
- `POST /api/mood` - Create mood entry
- `GET /api/mood` - Get mood entries
- `PUT /api/mood/:id` - Update mood entry
- `DELETE /api/mood/:id` - Delete mood entry

### Journal
- `POST /api/journal` - Create journal entry
- `GET /api/journal` - Get journal entries
- `GET /api/journal/:id` - Get specific journal entry
- `PUT /api/journal/:id` - Update journal entry
- `DELETE /api/journal/:id` - Delete journal entry

### Meditation
- `POST /api/meditation` - Create meditation session
- `GET /api/meditation` - Get meditation sessions
- `GET /api/meditation/stats` - Get meditation statistics

### Goals
- `POST /api/goals` - Create wellness goal
- `GET /api/goals` - Get wellness goals
- `PUT /api/goals/:id` - Update wellness goal
- `PATCH /api/goals/:id/increment-streak` - Increment goal streak

### Community
- `POST /api/community` - Create community post
- `GET /api/community` - Get community posts
- `PATCH /api/community/:id/like` - Like community post

### Crisis Resources
- `GET /api/crisis` - Get crisis resources

### AI Chat
- `POST /api/ai/chat` - Send chat message to AI
- `GET /api/ai/wellness-tips` - Get wellness tips

## 🚨 Important Security Notes

1. **Environment Variables**: Never commit `.env` files to version control
2. **JWT Secret**: Use a strong, random JWT secret in production
3. **Google OAuth**: Ensure redirect URIs match your domain in production
4. **MongoDB**: Use MongoDB Atlas or secure your local MongoDB instance
5. **HTTPS**: Use HTTPS in production for secure authentication

## 🧪 Testing the Application

1. Start both frontend and backend servers
2. Navigate to http://localhost:8080
3. Try registering with email or Google OAuth
4. Test all features: mood tracking, journaling, meditation, goals, community

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in environment variables

2. **Google OAuth Error**
   - Verify Google Client ID and Secret
   - Check redirect URIs in Google Console
   - Ensure frontend URL is correct

3. **CORS Issues**
   - Check frontend URL in server CORS configuration
   - Ensure ports match environment variables

4. **Build Errors**
   - Clear node_modules and reinstall dependencies
   - Check for TypeScript references in JavaScript files

### Getting Help

If you encounter issues:
1. Check the console for error messages
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Check that both frontend and backend servers are running

For additional support, please open an issue in the repository.