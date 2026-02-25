import React from 'react';
import { Box, Typography } from '@mui/material';
import { ITEMS } from '../../data/mockItems';

export const HeroSection: React.FC = () => {
    const stats = [
        { v: ITEMS.filter((i) => i.kind === 'use').length, l: 'Resources' },
        { v: ITEMS.filter((i) => i.kind === 'learn').length, l: 'Guides' },
        { v: new Set(ITEMS.map((i) => i.author)).size, l: 'Contributors' },
        { v: new Set(ITEMS.map((i) => i.office).filter((o) => o !== 'Firmwide')).size, l: 'Offices' },
    ];

    return (
        <Box component="section" sx={{ pt: '46px', pb: '30px', animation: 'slideDown 0.5s ease' }}>
            <Typography
                variant="h1"
                sx={{
                    fontSize: 44,
                    fontWeight: 400,
                    m: '0 0 8px',
                    fontFamily: 'var(--serif)',
                    lineHeight: 1.08,
                    letterSpacing: '-0.03em',
                    background: 'linear-gradient(140deg, #eee 0%, #666 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}
            >
                Collective Intelligence
            </Typography>
            <Typography
                sx={{
                    fontSize: 14,
                    color: '#555',
                    maxWidth: 460,
                    lineHeight: 1.6,
                    m: '0 0 24px',
                    fontFamily: 'var(--sans)',
                }}
            >
                Discover and build on AI resources created across every office and discipline.
            </Typography>
            <Box sx={{ display: 'flex', gap: '30px' }}>
                {stats.map((s) => (
                    <Box key={s.l}>
                        <Box
                            sx={{
                                fontSize: 23,
                                fontWeight: 300,
                                fontFamily: 'var(--serif)',
                                color: '#ddd',
                            }}
                        >
                            {s.v}
                        </Box>
                        <Box
                            sx={{
                                fontSize: 9,
                                textTransform: 'uppercase',
                                letterSpacing: '0.12em',
                                color: '#555',
                                mt: '1px',
                            }}
                        >
                            {s.l}
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};
