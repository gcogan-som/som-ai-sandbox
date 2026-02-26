import { initializeApp } from 'firebase/app';
// import { getFirestore } from 'firebase/firestore'; // Removed
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// TODO: Replace these with your actual Firebase project config from the Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyCa-trJ3FKn1WO3pTTOvZD3SfSrn03u__s",
    authDomain: "som-ai-sandbox.firebaseapp.com",
    projectId: "som-ai-sandbox",
    storageBucket: "som-ai-sandbox.firebasestorage.app",
    messagingSenderId: "57636010181",
    appId: "1:57636010181:web:cba66962f84c6e631058ac"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

import { initializeFirestore, setLogLevel } from 'firebase/firestore';

// Enable verbose logging for Firestore to debug connection/sync issues
setLogLevel('debug');

// Initialize Cloud Firestore with long polling to bypass network firewall issues
export const db = initializeFirestore(app, {
    experimentalForceLongPolling: true
});

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Firebase Storage
export const storage = getStorage(app);
