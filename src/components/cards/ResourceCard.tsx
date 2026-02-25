import React from 'react';
import { Box, Typography, Chip, alpha } from '@mui/material';
import type { ResourceItem, Tip } from '../../types';
import { COLORS } from '../../data/categories';
import { CatIcon } from '../shared/CatIcon';
import { StarsDisplay } from '../shared/StarRating';
import { VerifiedBadge } from '../shared/VerifiedBadge';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { useAtom } from 'jotai';
import { favoritesAtom } from '../../atoms/filterAtoms';

interface ResourceCardProps {
    item: ResourceItem;
    index: number;
    onClick: (item: ResourceItem) => void;
    compact?: boolean;
}

const TODAY = new Date('2026-02-25');
const daysAgo = (d: string) => Math.floor((TODAY.getTime() - new Date(d).getTime()) / 86400000);

const NewBadge: React.FC<{ date: string }> = ({ date }) => {
    const d = daysAgo(date);
    if (d > 7) return null;
    const label = d <= 1 ? 'Today' : d <= 3 ? `${d}d ago` : 'New';
    return (
        <Chip
            label={label}
            size="small"
            sx={{
                height: 16,
                fontSize: '8px',
                fontWeight: 600,
                bgcolor: (t) => alpha(t.palette.success.main, 0.12),
                color: 'success.main',
                '& .MuiChip-label': { px: 0.75 },
            }}
        />
    );
};

export const ResourceCard: React.FC<ResourceCardProps> = ({ item, index, onClick, compact }) => {
    const isLearn = item.kind === 'learn';
    const accentColor = COLORS[item.category];
    const topTip: Tip | null =
        item.tips.length > 0 ? [...item.tips].sort((a, b) => b.votes - a.votes)[0] : null;

    const [favorites, setFavorites] = useAtom(favoritesAtom);
    const isFavorite = favorites.includes(item.id);

    const toggleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        setFavorites((prev) =>
            prev.includes(item.id) ? prev.filter(id => id !== item.id) : [...prev, item.id]
        );
    };

    return (
        <Box
            onClick={() => onClick(item)}
            sx={{
                bgcolor: 'background.paper',
                borderRadius: 1,
                cursor: 'pointer',
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                flexDirection: 'column',
                animation: `fadeUp 0.4s ease ${index * 0.03}s both`,
                height: '100%',
                transition: 'all 0.2s ease',
                '&:hover': {
                    bgcolor: 'action.hover',
                    borderColor: 'text.disabled',
                    transform: 'translateY(-2px)',
                },
            }}
        >
            {/* Category accent bar */}
            <Box sx={{ height: 2, bgcolor: accentColor, opacity: 0.5, transition: 'opacity 0.2s', '&:hover': { opacity: 0.85 } }} />

            <Box sx={{ p: compact ? 1.75 : 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Header: category icon + type badges */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.25 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <Box
                            sx={{
                                width: 24,
                                height: 24,
                                borderRadius: '6px',
                                bgcolor: alpha(accentColor, 0.08),
                                border: '1px solid',
                                borderColor: alpha(accentColor, 0.15),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <CatIcon category={item.category} size={14} />
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography
                                variant="overline"
                                sx={{ color: accentColor, letterSpacing: '0.1em', lineHeight: 1 }}
                            >
                                {item.category}
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                        <NewBadge date={item.date} />
                        {isLearn && (
                            <Chip
                                label="Guide"
                                size="small"
                                sx={{
                                    height: 16,
                                    fontSize: '8px',
                                    bgcolor: 'action.selected',
                                    color: 'text.disabled',
                                    '& .MuiChip-label': { px: 0.75 },
                                }}
                            />
                        )}
                        {item.verified && <VerifiedBadge />}
                    </Box>
                </Box>

                {/* Title */}
                <Typography
                    variant="subtitle1"
                    sx={{ mb: 0.5, lineHeight: 1.25, fontWeight: 500 }}
                >
                    {item.title}
                </Typography>

                {/* Description */}
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mb: 1.25,
                        flex: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: compact ? 2 : 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.5,
                    }}
                >
                    {item.description}
                </Typography>

                {/* Top tip preview */}
                {topTip && !compact && (
                    <Box
                        sx={{
                            bgcolor: 'background.default',
                            borderRadius: '4px',
                            p: '8px 10px',
                            mb: 1.25,
                            borderLeft: `2px solid ${alpha(accentColor, 0.3)}`,
                        }}
                    >
                        <Typography
                            variant="body2"
                            color="text.disabled"
                            sx={{
                                lineHeight: 1.45,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                            }}
                        >
                            &ldquo;{topTip.text}&rdquo;
                        </Typography>
                        <Typography variant="caption" color="text.disabled" sx={{ mt: 0.25, display: 'block' }}>
                            — {topTip.author} · ▲ {topTip.votes}
                        </Typography>
                    </Box>
                )}

                {/* Tags */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.375 }}>
                    {item.tags.slice(0, 3).map((t) => (
                        <Chip
                            key={t}
                            label={t}
                            size="small"
                            sx={{
                                height: 16,
                                fontSize: '9px',
                                fontFamily: 'monospace',
                                border: 'none',
                                bgcolor: 'action.hover',
                                color: 'text.secondary',
                                '& .MuiChip-label': { px: 0.75 },
                            }}
                        />
                    ))}
                </Box>

                {/* Footer */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        pt: 1,
                        borderTop: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    {/* Author & Location */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <Box
                            sx={{
                                width: 18,
                                height: 18,
                                borderRadius: '50%',
                                bgcolor: alpha(accentColor, 0.1),
                                color: accentColor,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '8px',
                                fontWeight: 700,
                            }}
                        >
                            {item.author.split(' ').map((n) => n[0]).join('')}
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '10px' }}>
                            {item.author}
                        </Typography>
                        <Typography variant="caption" color="text.disabled" sx={{ fontSize: '10px' }}>·</Typography>
                        <Typography variant="caption" color="text.disabled" sx={{ fontSize: '10px' }}>
                            {item.office}
                        </Typography>
                    </Box>

                    {/* Stats & Actions */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <StarsDisplay rating={item.rating} size={9} />
                        {item.uses >= 10 && (
                            <Typography variant="caption" color="text.disabled" sx={{ fontFamily: 'monospace', fontSize: '9px' }}>
                                {item.uses}
                            </Typography>
                        )}
                        <Box
                            onClick={toggleFavorite}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: isFavorite ? 'error.main' : 'text.disabled',
                                '&:hover': { color: isFavorite ? 'error.light' : 'text.primary' }
                            }}
                        >
                            {isFavorite ? <Favorite sx={{ fontSize: 14 }} /> : <FavoriteBorder sx={{ fontSize: 14 }} />}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};
