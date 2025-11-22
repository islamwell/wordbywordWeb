/**
 * Firebase Configuration and Authentication Module
 * Handles user authentication for cross-device grammar editing
 */

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  updateProfile
} from 'firebase/auth';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

// Initialize Firebase
let app;
let auth;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
} catch (error) {
  console.error('Firebase initialization error:', error);
}

/**
 * Check if Firebase is configured
 */
export function isFirebaseConfigured(): boolean {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId
  );
}

/**
 * Sign up a new user
 */
export async function signUp(email: string, password: string, displayName?: string) {
  if (!auth) throw new Error('Firebase not initialized');

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Set display name if provided
    if (displayName && userCredential.user) {
      await updateProfile(userCredential.user, { displayName });
    }

    return { success: true, user: userCredential.user };
  } catch (error: any) {
    console.error('Sign up error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Sign in an existing user
 */
export async function signIn(email: string, password: string) {
  if (!auth) throw new Error('Firebase not initialized');

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    console.error('Sign in error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Sign out the current user
 */
export async function logout() {
  if (!auth) throw new Error('Firebase not initialized');

  try {
    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    console.error('Logout error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get the current user
 */
export function getCurrentUser(): User | null {
  return auth ? auth.currentUser : null;
}

/**
 * Subscribe to auth state changes
 */
export function onAuthChange(callback: (user: User | null) => void) {
  if (!auth) return () => {};
  return onAuthStateChanged(auth, callback);
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return Boolean(auth && auth.currentUser);
}

export { auth };
