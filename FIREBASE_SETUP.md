# Firebase Authentication Setup

This app uses Firebase Authentication to enable cross-device grammar editing and syncing.

## Features

- **Secure Login**: Email/password authentication via Firebase
- **Cross-Device Access**: Edit grammar on one device, access from another
- **Protected Editing**: Only authenticated users can edit word grammar
- **User Management**: Sign up, sign in, and logout functionality
- **Optional**: Works without Firebase (local-only mode for viewing)

## Setup Instructions

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter a project name (e.g., "Quran Grammar App")
4. Disable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Authentication

1. In your Firebase project, click "Authentication" in the left sidebar
2. Click "Get started"
3. Click on the "Sign-in method" tab
4. Enable "Email/Password" provider:
   - Click on "Email/Password"
   - Toggle "Enable" to ON
   - Click "Save"

### 3. Register Your Web App

1. In Firebase Console, go to Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. Click the web icon (</>)  to add a web app
4. Enter an app nickname (e.g., "Quran Grammar Web App")
5. Check "Also set up Firebase Hosting" if you want (optional)
6. Click "Register app"
7. You'll see a config object like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

### 4. Configure Environment Variables

1. Copy the Firebase config values to your `.env` file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and update the Firebase section with your actual values:
   ```
   VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
   VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
   ```

3. **IMPORTANT**: Never commit `.env` to git (it's already in `.gitignore`)

### 5. Build and Run

```bash
# Install dependencies (if not already done)
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## How It Works

### User Flow

1. **Viewing**: Anyone can view the app and read the Quran text and grammar
2. **Editing**: Click "Word Editor" button
   - If not logged in → Auth modal appears
   - Sign up for a new account or sign in with existing credentials
   - After login → Word Editor opens
3. **Saving**: All edits are saved to:
   - Local storage (immediate)
   - Airtable cloud (if configured)
   - Associated with your user account

### Authentication Required For

- Opening the Word Editor
- Editing word grammar analysis
- Saving grammar changes to the cloud

### Works Without Auth

- Reading Quran text
- Viewing existing grammar analysis
- Listening to recitations
- All browsing features

## User Interface

### Auth Modal

When you click "Word Editor" without being logged in, a modal appears with:
- Sign up form (email, password, optional name)
- Sign in form (email, password)
- Toggle between sign up and sign in
- Form validation and error messages

### User Status Bar

When logged in, you'll see a status bar showing:
- Your avatar (first letter of your name or email)
- Display name and email
- Logout button

## Security Features

- Passwords are securely handled by Firebase (never stored locally)
- Minimum 6-character password requirement
- Email format validation
- Session management across browser restarts
- Automatic logout on all devices when you logout

## Firebase Security Rules

By default, Firebase Authentication allows any user to sign up. To restrict sign-ups to specific users:

1. Go to Firebase Console → Authentication → Settings
2. Configure authorized domains for your production URL
3. Set up Firebase Security Rules for Firestore/Realtime Database if using those services

## Backward Compatibility

- If Firebase is not configured (no credentials in `.env`), the app works in local-only mode
- Users can still edit grammar, but changes are only saved locally
- Airtable sync still works independently if configured

## Troubleshooting

### "Firebase not initialized"
- Check that all Firebase config variables are in `.env`
- Restart dev server after changing `.env`
- Verify you're using the `VITE_` prefix for all variables

### "Invalid API key"
- Double-check the API key from Firebase Console
- Make sure there are no extra spaces or quotes
- Verify the project is active in Firebase Console

### "Auth domain error"
- Add your development domain (localhost:5173) to Authorized domains
- Go to Firebase Console → Authentication → Settings → Authorized domains
- Add `localhost` if not already there

### "User not persisting after refresh"
- Firebase automatically persists auth state
- Check browser console for errors
- Verify cookies/local storage are enabled in browser

### Can't sign up new users
- Verify Email/Password provider is enabled in Firebase Console
- Check Firebase Console → Authentication → Users to see registered users
- Review any Firebase error messages in browser console

## Production Deployment

When deploying to production:

1. Add your production domain to Firebase Authorized domains
2. Use environment variables in your hosting platform (Vercel, Netlify, etc.)
3. Never expose `.env` file publicly
4. Consider using Firebase App Check for additional security
5. Set up proper CORS if hosting on custom domain

## Cost Considerations

Firebase Authentication has a generous free tier:
- Up to 10,000 monthly active users: **FREE**
- Beyond that: See [Firebase Pricing](https://firebase.google.com/pricing)

For this Quran grammar app with limited users, the free tier should be sufficient.

## Support

For issues or questions about Firebase Authentication:
- [Firebase Documentation](https://firebase.google.com/docs/auth)
- [Firebase Console](https://console.firebase.google.com/)
- [Stack Overflow - firebase-authentication tag](https://stackoverflow.com/questions/tagged/firebase-authentication)
