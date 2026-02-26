import React from 'react';
import { StandardProfileMenu } from '@som/ui';
import { useAuth } from '../../lib/auth/AuthContext';

/**
 * AuthButton wrapper for Sandbox.
 * Composes the StandardProfileMenu with local Firebase auth logic.
 */
export const AuthButton: React.FC = () => {
    const { user, isAuthenticated, login, logout, loading } = useAuth();

    return (
        <StandardProfileMenu
            loading={loading}
            isAuthenticated={isAuthenticated}
            user={user}
            onLogin={login}
            onLogout={logout}
        />
    );
};
