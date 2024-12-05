/**
 * @file The FirebaseConfig file is used to manage the Firebase configuration, callable functions, Firebase App Check, Firebase Emulator, and initialize the Firebase app.
 */
import { initializeApp } from 'firebase/app';
import {
  connectFunctionsEmulator,
  getFunctions,
  httpsCallable,
} from 'firebase/functions';

// Firebase configuration.
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase app and functions.
// Initialize Firebase app.
const app = initializeApp(firebaseConfig);

// Get Functions instance.
const functions = getFunctions(app);

// Connect to the Firebase Emulator locally if enabled.
if (import.meta.env.VITE_USE_LOCAL_FUNCTIONS === 'true') {
  connectFunctionsEmulator(functions, 'localhost', 5001);
}

// Export the callable function.
export const saveFormData = httpsCallable(functions, 'saveFormData');