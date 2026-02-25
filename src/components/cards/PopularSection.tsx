import React, { useState, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { ITEMS } from '../../data/mockItems';
import { COLORS } from '../../data/categories';
import { CatIcon } from '../shared/CatIcon';
import { StarsDisplay } from '../shared/StarRating';
import { StandardAccordion } from '@som/ui';
import type { ResourceItem } from '../../types';

interface PopularSectionProps {
    onSelect: (item: ResourceItem) => void;
}

export const PopularSection: React.FC<PopularSectionProps> = ({ onSelect }) => {
    const offices = [...new Set(ITEMS.map((i) => i.office).filter((o) => o !== 'Firmwide'))];
    const [office] = useState(() => offices[Math.floor(Math.random() * offices.length)]);
    const officeItems = useMemo(
        () =>
            ITEMS.filter((i) => i.office === office && i.kind === 'use')
                .sort((a, b) => b.uses - a.uses)
                .slice(0, 5),
        [office]
    );

    if (officeItems.length === 0) return null;

    return (
        <Box sx={{ mb: 3.5, animation: 'fadeUp 0.4s ease both' }}>
            <StandardAccordion
                defaultExpanded
                title={`Popular in ${office}`}
                subtitle="Trending tools right now"
            >
                <Box
                    sx={{
                        display: 'flex',
                        gap: 1,
                        overflowX: 'auto',
                        pb: 1,
                        scrollSnapType: 'x mandatory',
                        '&::-webkit-scrollbar': { height: 4 },
                        '&::-webkit-scrollbar-thumb': { bgcolor: 'divider', borderRadius: 2 },
                    }}
                >
                    {officeItems.map((item) => (
                        <Box
                            key={item.id}
                            onClick={() => onSelect(item)}
                            sx={{
                                flexShrink: 0,
                                width: 240,
                                bgcolor: 'background.paper',
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 1,
                                p: 1.75,
                                cursor: 'pointer',
                                scrollSnapAlign: 'start',
                                transition: 'all 0.15s ease',
                                '&:hover': {
                                    bgcolor: 'action.hover',
                                    borderColor: 'text.disabled',
                                },
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1 }}>
                                <CatIcon category={item.category} size={12} />
                                <Typography
                                    variant="overline"
                                    sx={{ color: COLORS[item.category], letterSpacing: '0.1em', lineHeight: 1 }}
                                >
                                    {item.category}
                                </Typography>
                            </Box>
                            <Typography variant="h5" sx={{ fontWeight: 400, lineHeight: 1.25, mb: 0.75 }}>
                                {item.title}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                <StarsDisplay rating={item.rating} size={8} />
                                <Typography variant="caption" color="text.disabled" sx={{ fontFamily: 'monospace' }}>
                                    {item.uses} uses
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </StandardAccordion>
        </Box>
    );
};
