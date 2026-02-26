import React from 'react';
import { StandardVerifiedBadge } from '@som/ui';

export const VerifiedBadge: React.FC<{ size?: number }> = ({ size = 12 }) => (
    <StandardVerifiedBadge size={size} />
);
