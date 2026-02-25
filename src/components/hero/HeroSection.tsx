import React from 'react';
import { Box, Typography } from '@mui/material';
import { sectionLabelSx } from '@som/ui';
import { ITEMS } from '../../data/mockItems';

export const HeroSection: React.FC = () => {
    const stats = [
        { v: ITEMS.filter((i) => i.kind === 'use').length, l: 'Resources' },
        { v: ITEMS.filter((i) => i.kind === 'learn').length, l: 'Guides' },
        { v: new Set(ITEMS.map((i) => i.author)).size, l: 'Contributors' },
        { v: new Set(ITEMS.map((i) => i.office).filter((o) => o !== 'Firmwide')).size, l: 'Offices' },
    ];

    return (
        <Box component="section" sx={{ pt: 5.75, pb: 3.75, animation: 'slideDown 0.5s ease' }}>
            <Typography
                variant="h1"
                sx={{
                    fontSize: { xs: 32, md: 44 },
                    fontWeight: 300,
                    mb: 1,
                    lineHeight: 1.08,
                    letterSpacing: '-0.03em',
                    color: 'text.primary',
                }}
            >
                AI Sandbox
            </Typography>
            <Typography
                variant="subtitle1"
                color="text.secondary"
                sx={{ maxWidth: 460, lineHeight: 1.6, mb: 3 }}
            >
                A playground to share how SOM is using ai, driving the car as we're building it.
            </Typography>
            <Box sx={{ display: 'flex', gap: 3.75 }}>
                {stats.map((s) => (
                    <Box key={s.l}>
                        <Typography variant="h2" sx={{ fontWeight: 300, letterSpacing: '-0.02em' }}>
                            {s.v}
                        </Typography>
                        <Typography
                            variant="overline"
                            color="text.disabled"
                            sx={{ ...sectionLabelSx, display: 'block', mt: 0.25 }}
                        >
                            {s.l}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};
