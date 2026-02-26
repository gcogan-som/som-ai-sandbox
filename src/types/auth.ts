export interface AuthUser {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
    accessToken?: string;
    office?: string;
}

export interface AuthState {
    user: AuthUser | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
}

export interface AuthProviderInterface {
    login: () => Promise<void>;
    logout: () => Promise<void>;
}
