import React from 'react';
import { StandardStarRating } from '@som/ui';

interface StarsDisplayProps {
    rating: number;
    size?: number;
}

export const StarsDisplay: React.FC<StarsDisplayProps> = ({ rating, size = 11 }) => {
    return (
        <StandardStarRating
            value={rating}
            size={size}
            showLabel
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
