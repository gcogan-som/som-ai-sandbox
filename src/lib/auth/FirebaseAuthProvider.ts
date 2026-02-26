import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../firebase';
import type { AuthUser } from '../../types/auth';

const mapFirebaseUser = (user: User | null): AuthUser | null => {
    if (!user) return null;
    return {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
        photoURL: user.photoURL || undefined,
    };
};

export const FirebaseAuthProvider = {
    login: async (): Promise<AuthUser | null> => {
        const provider = new GoogleAuthProvider();
        // Force account selection to help with switching between personal and SOM accounts
        provider.setCustomParameters({ prompt: 'select_account' });

        const result = await signInWithPopup(auth, provider);
        return mapFirebaseUser(result.user);
    },

    logout: async (): Promise<void> => {
        await signOut(auth);
    },

    onAuthStateChanged: (callback: (user: AuthUser | null) => void) => {
        return onAuthStateChanged(auth, (user) => {
            callback(mapFirebaseUser(user));
        });
    }
};
