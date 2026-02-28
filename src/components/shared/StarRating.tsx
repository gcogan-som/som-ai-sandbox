import React from 'react';
import { StandardStarRating } from '@som/ui';

interface StarsDisplayProps {
    rating: number;
    size?: number;
    compact?: boolean;
}

export const StarsDisplay: React.FC<StarsDisplayProps> = ({ rating, size = 11, compact = false }) => {
    return (
        <StandardStarRating
            value={rating}
            size={size}
            showLabel={!compact}
            compact={compact}
        />
    );
};

interface InteractiveRatingProps {
    onRate: (rating: number) => void;
    userRating: number;
}

export const InteractiveRating: React.FC<InteractiveRatingProps> = ({ onRate, userRating }) => {
    return (
        <StandardStarRating
            value={userRating}
            onChange={onRate}
            interactiveLabel="Rate"
        />
    );
};
