import { initializeApp, type FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { initializeFirestore, setLogLevel } from 'firebase/firestore';

function readFirebaseConfigFromEnv(): FirebaseOptions {
    const env = import.meta.env;
    const required = [
        { name: 'VITE_FIREBASE_API_KEY', value: env.VITE_FIREBASE_API_KEY },
        { name: 'VITE_FIREBASE_AUTH_DOMAIN', value: env.VITE_FIREBASE_AUTH_DOMAIN },
        { name: 'VITE_FIREBASE_PROJECT_ID', value: env.VITE_FIREBASE_PROJECT_ID },
        { name: 'VITE_FIREBASE_STORAGE_BUCKET', value: env.VITE_FIREBASE_STORAGE_BUCKET },
        { name: 'VITE_FIREBASE_MESSAGING_SENDER_ID', value: env.VITE_FIREBASE_MESSAGING_SENDER_ID },
        { name: 'VITE_FIREBASE_APP_ID', value: env.VITE_FIREBASE_APP_ID },
    ] as const;
    const missing = required.filter((r) => !r.value?.trim()).map((r) => r.name);

    if (missing.length > 0) {
        throw new Error(
            `Missing Firebase environment variables: ${missing.join(', ')}. ` +
                'Copy .env.example to .env.local and set values from the Firebase Console, ' +
                'or provide them in your deployment pipeline as build-time variables.',
        );
    }

    return {
        apiKey: env.VITE_FIREBASE_API_KEY,
        authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: env.VITE_FIREBASE_APP_ID,
    };
}

const firebaseConfig = readFirebaseConfigFromEnv();

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Enable verbose logging for Firestore to debug connection/sync issues
setLogLevel('debug');

// Initialize Cloud Firestore with long polling to bypass network firewall issues
export const db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
});

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Firebase Storage
export const storage = getStorage(app);
