import React, { useState } from 'react';
import { Box } from '@mui/material';

interface StarsDisplayProps {
    rating: number;
    size?: number;
}

export const StarsDisplay: React.FC<StarsDisplayProps> = ({ rating, size = 11 }) => {
    const full = Math.floor(rating);
    const frac = rating - full;
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
            {[...Array(5)].map((_, i) => {
                const fill = i < full ? 1 : i === full ? frac : 0;
                const id = `star-${i}-${rating}`;
                return (
                    <svg key={i} width={size} height={size} viewBox="0 0 20 20">
                        <defs>
                            <linearGradient id={id}>
                                <stop offset={`${fill * 100}%`} stopColor="#D4845A" />
                                <stop offset={`${fill * 100}%`} stopColor="#2a2a2a" />
                            </linearGradient>
                        </defs>
                        <path
                            d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.49L10 14.27 5.06 16.7 6 11.21l-4-3.9 5.53-.8z"
                            fill={`url(#${id})`}
                        />
                    </svg>
                );
            })}
            <span
                style={{
                    marginLeft: 4,
                    fontSize: size - 1,
                    color: '#777',
                    fontVariantNumeric: 'tabular-nums',
                    fontFamily: 'var(--sans)',
                }}
            >
                {rating.toFixed(1)}
            </span>
        </span>
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
                background: '#151515',
                borderRadius: '10px',
                padding: '12px 16px',
                border: '1px solid #1e1e1e',
                mb: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
            }}
        >
            <span
                style={{
                    fontSize: 9.5,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: '#555',
                    fontFamily: 'var(--sans)',
                }}
            >
                Rate
            </span>
            {[1, 2, 3, 4, 5].map((s) => (
                <button
                    key={s}
                    onMouseEnter={() => setHoverStar(s)}
                    onMouseLeave={() => setHoverStar(0)}
                    onClick={() => onRate(s)}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 1,
                        transition: 'transform 0.12s',
                        transform: hoverStar >= s || userRating >= s ? 'scale(1.1)' : 'scale(1)',
                    }}
                >
                    <svg width="18" height="18" viewBox="0 0 20 20">
                        <path
                            d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.49L10 14.27 5.06 16.7 6 11.21l-4-3.9 5.53-.8z"
                            fill={hoverStar >= s || userRating >= s ? '#D4845A' : '#1e1e1e'}
                            stroke={hoverStar >= s || userRating >= s ? '#D4845A' : '#333'}
                            strokeWidth="0.5"
                        />
                    </svg>
                </button>
            ))}
            {userRating > 0 && (
                <span style={{ fontSize: 11.5, color: '#D4845A', fontFamily: 'var(--sans)' }}>Thanks!</span>
            )}
        </Box>
    );
};
