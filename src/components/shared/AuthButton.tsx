import React from 'react';
import { Button, Avatar, Tooltip, Box } from '@mui/material';
import { useAuth } from '../../lib/auth/AuthContext';
import { Google as GoogleIcon } from '@mui/icons-material';



/**
 * Standard SOM-branded Auth Button.
 * Displays "Sign In" when logged out, and user profile when logged in.
 */
export const AuthButton: React.FC = () => {
    const { user, isAuthenticated, login, logout, loading } = useAuth();

    if (loading) {
        return (
            <Button size="small" disabled sx={{ opacity: 0.5, fontSize: '10px' }}>
                ...
            </Button>
        );
    }

    if (isAuthenticated && user) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Tooltip title={`${user.displayName} (${user.email})`}>
                    <Avatar
                        src={user.photoURL}
                        alt={user.displayName}
                        onClick={() => logout()}
                        sx={{
                            width: 28,
                            height: 28,
                            cursor: 'pointer',
                            border: '1px solid',
                            borderColor: 'divider',
                            '&:hover': { opacity: 0.8 }
                        }}
                    >
                        {user.displayName?.charAt(0)}
                    </Avatar>
                </Tooltip>
            </Box>
        );
    }

    return (
        <Button
            size="small"
            variant="contained"
            onClick={() => login()}
            startIcon={<GoogleIcon sx={{ fontSize: '14px !important' }} />}
            sx={{
                height: 28,
                fontSize: '11px',
                fontWeight: 700,
                px: 1.5,
                bgcolor: '#0F9D58', // Google Green
                color: 'white',
                '&:hover': { bgcolor: '#0B8043' },
                textTransform: 'none',
                borderRadius: '4px'
            }}
        >
            SOM Login
        </Button>
    );
};
