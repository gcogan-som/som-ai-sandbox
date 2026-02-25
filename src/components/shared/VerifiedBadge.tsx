import React from 'react';
import { Verified } from '@mui/icons-material';

export const VerifiedBadge: React.FC<{ size?: number }> = ({ size = 12 }) => (
    <Verified
        sx={{
            fontSize: size,
            color: '#6AADCF', // SOM Blue for verified
        }}
    />
);
