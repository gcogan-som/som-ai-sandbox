import React, { useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { Star, StarOutline, StarHalf } from '@mui/icons-material';

interface StarsDisplayProps {
    rating: number;
    size?: number;
}

export const StarsDisplay: React.FC<StarsDisplayProps> = ({ rating, size = 11 }) => {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;

    return (
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.25 }}>
            {[...Array(5)].map((_, i) => {
                const active = i < full || (i === full && half);
                const sx = {
                    fontSize: size,
                    color: active ? 'text.primary' : 'text.disabled',
                };
                if (i < full) return <Star key={i} sx={sx} />;
                if (i === full && half) return <StarHalf key={i} sx={sx} />;
                return <StarOutline key={i} sx={sx} />;
            })}
            <Typography
                variant="caption"
                sx={{
                    ml: 0.5,
                    fontSize: size - 1,
                    color: 'text.secondary',
                    fontFamily: 'monospace',
                }}
            >
                {rating.toFixed(1)}
            </Typography>
        </Box>
    );
};

interface InteractiveRatingProps {
    onRate: (rating: number) => void;
    userRating: number;
}

export const InteractiveRating: React.FC<InteractiveRatingProps> = ({ onRate, userRating }) => {
    const [hoverStar, setHoverStar] = useState(0);

    return (
        <Box
            sx={{
                bgcolor: 'action.hover',
                borderRadius: 1,
                p: 1.5,
                border: '1px solid',
                borderColor: 'divider',
                mb: 2.5,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
            }}
        >
            <Typography variant="overline" color="text.disabled" sx={{ fontWeight: 600 }}>
                Rate
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
                {[1, 2, 3, 4, 5].map((s) => {
                    const active = hoverStar >= s || userRating >= s;
                    return (
                        <IconButton
                            key={s}
                            onMouseEnter={() => setHoverStar(s)}
                            onMouseLeave={() => setHoverStar(0)}
                            onClick={() => onRate(s)}
                            size="small"
                            sx={{
                                p: 0.25,
                                color: active ? 'text.primary' : 'text.disabled',
                                transition: 'transform 0.1s ease',
                                '&:hover': { transform: 'scale(1.1)', bgcolor: 'transparent' }
                            }}
                        >
                            {active
                                ? <Star sx={{ fontSize: 18 }} />
                                : <StarOutline sx={{ fontSize: 18 }} />
                            }
                        </IconButton>
                    );
                })}
            </Box>
            {userRating > 0 && (
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Thanks!
                </Typography>
            )}
        </Box>
    );
};
