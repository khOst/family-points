# Firebase Setup Guide

## 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Follow the setup wizard

## 2. Enable Authentication
1. In your Firebase project, go to Authentication
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider

## 3. Create Firestore Database
1. Go to Firestore Database
2. Click "Create database"
3. Choose "Start in test mode" for now
4. Select a location

## 4. Get Configuration
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Web" icon to add a web app
4. Register your app and copy the config object

## 5. Setup Environment Variables
1. Copy `.env.example` to `.env`
2. Fill in your Firebase configuration values:
```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
```

## 6. Update Security Rules (Optional)
For development, you can start with test mode rules. For production, implement proper security rules.

## 7. Test the Integration
1. Run `npm run dev`
2. Try registering a new user
3. Check Firebase console to see if user and data are created