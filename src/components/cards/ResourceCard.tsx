import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import type { ResourceItem } from '../../types';
import { COLORS } from '../../data/categories';
import { CatIcon } from '../shared/CatIcon';
import { StarsDisplay } from '../shared/StarRating';
import { VerifiedBadge } from '../shared/VerifiedBadge';
import { Bookmark, BookmarkBorder } from '@mui/icons-material';
import { useAtom } from 'jotai';
import { favoritesAtom } from '../../atoms/filterAtoms';
import { TintedSurface, InitialsAvatar } from '@som/ui';

export interface ResourceCardProps {
    item: ResourceItem;
    index: number;
    onClick: (item: ResourceItem) => void;
    compact?: boolean;
    layout?: 'grid' | 'list';
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
                fontWeight: 600,
                bgcolor: 'action.selected',
                color: 'text.secondary',
                '& .MuiChip-label': { px: 0.75 },
            }}
        />
    );
};

export const ResourceCard: React.FC<ResourceCardProps> = ({ item, index, onClick, compact, layout = 'grid' }) => {
    const isLearn = item.kind === 'learn';
    const accentColor = COLORS[item.category];

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
                flexDirection: layout === 'list' ? 'row' : 'column',
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
            <Box sx={{
                height: layout === 'list' ? '100%' : 2,
                width: layout === 'list' ? 2 : '100%',
                bgcolor: accentColor,
                opacity: 0.5,
                transition: 'opacity 0.2s',
                '&:hover': { opacity: 0.85 },
                flexShrink: 0
            }} />

            <Box sx={{ p: compact ? 1.75 : 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Header: category icon + type badges */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.25 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <TintedSurface
                            color={accentColor}
                            tintAlpha={0.08}
                            borderAlpha={0.15}
                            sx={{
                                width: 24,
                                height: 24,
                                borderRadius: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <CatIcon category={item.category} size={14} />
                        </TintedSurface>
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
                        flex: layout === 'list' ? 'none' : 1,
                        display: '-webkit-box',
                        WebkitLineClamp: layout === 'list' ? 1 : (compact ? 2 : 3),
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.5,
                    }}
                >
                    {item.description}
                </Typography>

                {/* Tags */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.375 }}>
                    {item.tags.slice(0, 3).map((t) => (
                        <Chip
                            key={t}
                            label={t}
                            size="small"
                            sx={{
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
                        <InitialsAvatar name={item.author} color={accentColor} size={18} />
                        <Typography variant="caption" color="text.secondary">
                            {item.author}
                        </Typography>
                        <Typography variant="caption" color="text.disabled">·</Typography>
                        <Typography variant="caption" color="text.disabled">
                            {item.office}
                        </Typography>
                    </Box>

                    {/* Stats & Actions */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <StarsDisplay rating={item.rating} size={9} />
                        {item.uses >= 10 && (
                            <Typography variant="caption" color="text.disabled">
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
                                color: isFavorite ? 'text.secondary' : 'text.disabled',
                                '&:hover': { color: 'text.primary' }
                            }}
                        >
                            {isFavorite ? <Bookmark sx={{ fontSize: 14 }} /> : <BookmarkBorder sx={{ fontSize: 14 }} />}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};
