import React from 'react';
import { useAtom, useAtomValue } from 'jotai';
import {
    Box,
    Typography,
    alpha
} from '@mui/material';
import {
    Bookmark,
    BookmarkBorder,
} from '@mui/icons-material';
import type { ResourceItem } from '../../types';
import { COLORS } from '../../data/categories';
import { favoritesAtom, sortAtom } from '../../atoms/filterAtoms';
import {
    TintedSurface,
    StandardAvatar,
    InitialsAvatar,
    StandardChip,
    StandardIconButton
} from '@som/ui';
import { useAuth } from '../../lib/auth/AuthContext';
import { CatIcon } from '../shared/CatIcon';
import { VerifiedBadge } from '../shared/VerifiedBadge';

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
        <StandardChip
            label={label}
            density="compact"
            sx={{
                fontWeight: 600,
                bgcolor: 'action.selected',
                color: 'text.secondary',
            }}
        />
    );
};

export const ResourceCard: React.FC<ResourceCardProps> = ({ item, index, onClick, layout = 'grid' }) => {
    const isLearn = item.kind === 'guide';
    const accentColor = COLORS[item.category];

    const [favorites, setFavorites] = useAtom(favoritesAtom);
    const sort = useAtomValue(sortAtom);
    const { user } = useAuth();
    const isFavorite = favorites.includes(item.id);

    const renderAvatar = (name: string, color: string, size: number) => {
        if (item.authorPhotoUrl) {
            return <StandardAvatar src={item.authorPhotoUrl} size="small" sx={{ width: size, height: size }} />;
        }
        if (user?.displayName === name && user?.photoURL) {
            return <StandardAvatar src={user.photoURL} size="small" sx={{ width: size, height: size }} />;
        }
        return <InitialsAvatar name={name} color={color} size={size} />;
    };

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
                position: 'relative',
                flexDirection: 'column',
                animation: `fadeUp 0.4s ease ${index * 0.03}s both`,
                height: layout === 'list' ? 'auto' : 240,
                width: '100%',
                transition: 'all 0.2s ease',
                color: (item.vizImages?.result && layout === 'grid') ? 'common.white' : 'text.primary',
                '&:hover': {
                    bgcolor: (item.vizImages?.result && layout === 'grid') ? undefined : 'action.hover',
                    borderColor: accentColor,
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px -12px rgba(0,0,0,0.2)',
                    '& .bg-image': { transform: 'scale(1.05)' }
                },
            }}
        >
            {/* Category accent bar */}
            <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: layout === 'list' ? '100%' : 2,
                width: layout === 'list' ? 2 : '100%',
                bgcolor: accentColor,
                opacity: 0.5,
                zIndex: 10,
                transition: 'opacity 0.2s',
                '&:hover': { opacity: 0.85 },
            }} />

            {/* Background Image / Overlay Layer */}
            {(item.vizImages?.result && layout === 'grid') && (
                <>
                    {/* Full Background Image */}
                    <Box
                        className="bg-image"
                        component="img"
                        src={item.vizImages.result}
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            zIndex: 0,
                            transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                    />
                    {/* Heavy Scrim for Text Legibility */}
                    <Box sx={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.9) 100%)',
                        zIndex: 1,
                        pointerEvents: 'none'
                    }} />
                </>
            )}

            {/* List View Image */}
            {(item.vizImages?.result && layout === 'list') && (
                <Box
                    sx={{
                        width: 120,
                        height: 'auto',
                        overflow: 'hidden',
                        flexShrink: 0,
                        borderRight: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <Box
                        component="img"
                        src={item.vizImages.result}
                        alt={item.title}
                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </Box>
            )}

            <Box sx={{
                p: 1.5,
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                position: 'relative',
                zIndex: 2,
                bgcolor: (item.vizImages?.result && layout === 'grid') ? 'rgba(0,0,0,0.25)' : 'transparent',
                backdropFilter: (item.vizImages?.result && layout === 'grid') ? 'blur(2px)' : 'none',
            }}>
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
                        <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                            <Typography
                                variant="overline"
                                noWrap
                                sx={{
                                    color: (item.vizImages?.result && layout === 'grid') ? alpha('#fff', 0.8) : accentColor,
                                    fontWeight: 800,
                                    letterSpacing: '0.1em',
                                    fontSize: '10px',
                                    lineHeight: 1,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}
                            >
                                {item.category.toUpperCase()}{item.aiModel && item.category !== item.aiModel ? ` · ${item.aiModel.toUpperCase()}` : ''}
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                        <NewBadge date={item.date} />
                        {isLearn && (
                            <StandardChip
                                label="Guide"
                                density="compact"
                                sx={{
                                    bgcolor: 'action.selected',
                                    color: 'text.disabled',
                                }}
                            />
                        )}
                        {item.verified && <VerifiedBadge />}
                        {(sort === 'Top Rated' || sort === 'Most Used') && (
                            <Typography
                                variant="caption"
                                sx={{
                                    fontWeight: 800,
                                    color: 'common.white',
                                    fontSize: '10px',
                                    bgcolor: (item.vizImages?.result && layout === 'grid') ? 'rgba(255,255,255,0.2)' : alpha(accentColor, 0.8),
                                    backdropFilter: (item.vizImages?.result && layout === 'grid') ? 'blur(8px)' : 'none',
                                    px: 0.8,
                                    py: 0.2,
                                    borderRadius: '4px',
                                    lineHeight: 1,
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}
                            >
                                #{index + 1}
                            </Typography>
                        )}
                    </Box>
                </Box>

                {/* Title */}
                <Typography
                    variant="subtitle1"
                    sx={{
                        mb: 0.25,
                        lineHeight: 1.25,
                        fontWeight: 700,
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                    }}
                >
                    {item.title}
                </Typography>

                {/* Description Space Filler */}
                <Box sx={{ flex: 1, overflow: 'hidden', minHeight: '36px', mb: 1.5 }}>
                    <Typography
                        variant="caption"
                        sx={{
                            color: (item.vizImages?.result && layout === 'grid') ? 'rgba(255,255,255,0.8)' : "text.secondary",
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            lineHeight: 1.4,
                            fontWeight: 500,
                        }}
                    >
                        {item.description}
                    </Typography>
                </Box>

                {/* Tags */}
                <Box
                    sx={{
                        display: 'flex',
                        gap: 0.5,
                        mt: 'auto',
                        mb: 1.25,
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        flexWrap: 'nowrap',
                    }}
                >
                    {item.tags.map((t: string) => (
                        <StandardChip
                            key={t}
                            label={t}
                            density="compact"
                            sx={{
                                fontSize: '10px',
                                height: 20,
                                borderRadius: '100px',
                                fontWeight: 700,
                                border: '1px solid',
                                borderColor: (item.vizImages?.result && layout === 'grid') ? 'rgba(255,255,255,0.2)' : 'divider',
                                bgcolor: (item.vizImages?.result && layout === 'grid') ? 'rgba(255,255,255,0.1)' : 'transparent',
                                color: (item.vizImages?.result && layout === 'grid') ? 'rgba(255,255,255,0.9)' : 'text.secondary',
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
                        pt: 1.5,
                        mt: 0,
                        borderTop: '1px solid',
                        borderColor: (item.vizImages?.result && layout === 'grid') ? 'rgba(255,255,255,0.15)' : 'divider',
                    }}
                >
                    {/* Author Left (R2) */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {renderAvatar(item.author, accentColor, 20)}
                        <Typography variant="caption" sx={{ fontWeight: 600, color: (item.vizImages?.result && layout === 'grid') ? 'rgba(255,255,255,0.8)' : 'text.secondary' }}>
                            {item.author}
                        </Typography>
                    </Box>

                    {/* Stats Right (R2 + R4) */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: item.rating > 0 ? ((item.vizImages?.result && layout === 'grid') ? '#fff' : 'text.secondary') : 'text.disabled', fontSize: '11px' }}>
                                {item.rating > 0 ? `★ ${item.rating.toFixed(1)}` : '★ —'}
                            </Typography>
                        </Box>

                        <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.disabled', fontSize: '11px' }}>
                            {item.uses > 0 ? `${item.uses} uses` : ''}
                        </Typography>

                        <StandardIconButton
                            onClick={toggleFavorite}
                            icon={isFavorite ? Bookmark : BookmarkBorder}
                            label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                            sx={{
                                color: isFavorite ? 'text.primary' : 'text.disabled',
                                '&:hover': { color: 'text.primary' }
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </Box >
    );
};
