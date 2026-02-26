import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AuthUser, AuthState } from '../../types/auth';

interface AuthContextType extends AuthState {
    login: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

interface AuthProviderProps {
    children: React.ReactNode;
    provider: {
        login: () => Promise<AuthUser | null>;
        logout: () => Promise<void>;
        onAuthStateChanged: (callback: (user: AuthUser | null) => void) => () => void;
    };
}

export function AuthProvider({ children, provider }: AuthProviderProps) {
    const [state, setState] = useState<AuthState>({
        user: null,
        loading: true,
        error: null,
        isAuthenticated: false,
    });

    useEffect(() => {
        const unsubscribe = provider.onAuthStateChanged((user) => {
            setState({
                user,
                loading: false,
                error: null,
                isAuthenticated: !!user,
            });
        });

        return () => unsubscribe();
    }, [provider]);

    const login = async () => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const user = await provider.login();
            if (user && !user.email.endsWith('@som.com')) {
                await provider.logout();
                throw new Error('Access restricted to @som.com domains.');
            }
        } catch (error: any) {
            console.error('Login error detail:', error);
            setState(prev => ({
                ...prev,
                loading: false,
                error: error.message || 'Login failed'
            }));
        }
    };

    const logout = async () => {
        try {
            await provider.logout();
        } catch (error: any) {
            setState(prev => ({ ...prev, error: error.message }));
        }
    };

    return (
        <AuthContext.Provider value={{ ...state, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
