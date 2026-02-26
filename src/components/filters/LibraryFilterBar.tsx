import React, { useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import {
    Box, Typography, Chip, Menu, MenuItem, IconButton, alpha,
} from '@mui/material';
import { GridView, ViewList, FilterList, Sort, TrendingUp, Bookmark } from '@mui/icons-material';
import { StandardSearchInput } from '@som/ui';
import {
    searchAtom,
    categoryAtom,
    sortAtom,
    viewAtom,
    facetCountAtom,
    showFavoritesAtom,
    favoritesAtom,
    facetsAtom,
} from '../../atoms/filterAtoms';
import { CATEGORIES, SORT_OPTIONS, COLORS } from '../../data/categories';
import { useRotatingHint } from '../../hooks/useRotatingHint';
import { FacetPanel } from './FacetPanel';
import type { CategoryName } from '../../types';

interface LibraryFilterBarProps {
    total: number;
}

export const LibraryFilterBar: React.FC<LibraryFilterBarProps> = ({ total }) => {
    const [search, setSearch] = useAtom(searchAtom);
    const [category, setCategory] = useAtom(categoryAtom);
    const [sort, setSort] = useAtom(sortAtom);
    const [view, setView] = useAtom(viewAtom);
    const [showFavorites, setShowFavorites] = useAtom(showFavoritesAtom);
    const [, setFacets] = useAtom(facetsAtom);
    const favorites = useAtomValue(favoritesAtom);
    const facetCount = useAtomValue(facetCountAtom);
    const [showFacets, setShowFacets] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const placeholder = useRotatingHint();

    return (
        <Box sx={{ position: 'relative', mb: 2.5 }}>
            {/* Search */}
            <StandardSearchInput
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClear={() => setSearch('')}
                placeholder={placeholder}
                sx={{ mb: 1.5 }}
                fullWidth
            />

            {/* Controls row */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
                {/* Category chips */}
                <Box sx={{ display: 'flex', gap: 0.5, flex: 1, flexWrap: 'wrap' }}>
                    {CATEGORIES.map((c) => {
                        const active = category === c;
                        const accentColor = c !== 'All' ? COLORS[c as CategoryName] : undefined;
                        return (
                            <Chip
                                key={c}
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        {c !== 'All' && (
                                            <Box
                                                component="span"
                                                sx={{
                                                    width: 6,
                                                    height: 6,
                                                    borderRadius: '50%',
                                                    bgcolor: accentColor,
                                                    opacity: active ? 1 : 0.4,
                                                    display: 'inline-block',
                                                }}
                                            />
                                        )}
                                        {c}
                                    </Box>
                                }
                                onClick={() => {
                                    setCategory(c);
                                    if (c === 'All') {
                                        setSort('Newest');
                                        setShowFavorites(false);
                                        setFacets({ tags: [], offices: [], disciplines: [], authors: [] });
                                    }
                                }}
                                size="small"
                                variant={active ? 'filled' : 'outlined'}
                                sx={{
                                    cursor: 'pointer',
                                    height: 24,
                                    fontSize: '0.75rem',
                                    ...(active && accentColor ? {
                                        bgcolor: `${accentColor}18`,
                                        borderColor: `${accentColor}55`,
                                        color: accentColor,
                                    } : {}),
                                }}
                            />
                        );
                    })}
                    <Chip
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <TrendingUp
                                    sx={{
                                        fontSize: 14,
                                        color: sort === 'Trending' ? '#FF9800' : 'text.disabled',
                                        opacity: sort === 'Trending' ? 1 : 0.6
                                    }}
                                />
                                Trending
                            </Box>
                        }
                        onClick={() => setSort(sort === 'Trending' ? 'Newest' : 'Trending')}
                        size="small"
                        variant={sort === 'Trending' ? 'filled' : 'outlined'}
                        sx={{
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            height: 24,
                            fontSize: '0.75rem',
                            ...(sort === 'Trending' && {
                                bgcolor: alpha('#FF9800', 0.1),
                                color: '#FF9800',
                                borderColor: alpha('#FF9800', 0.4),
                                '&:hover': { bgcolor: alpha('#FF9800', 0.2) }
                            }),
                        }}
                    />
                    <Chip
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Bookmark
                                    sx={{
                                        fontSize: 14,
                                        color: showFavorites ? '#E91E63' : 'text.disabled',
                                        opacity: showFavorites ? 1 : 0.6
                                    }}
                                />
                                {`Saved ${favorites.length > 0 ? `(${favorites.length})` : ''}`}
                            </Box>
                        }
                        onClick={() => setShowFavorites(!showFavorites)}
                        size="small"
                        variant={showFavorites ? 'filled' : 'outlined'}
                        sx={{
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            height: 24,
                            fontSize: '0.75rem',
                            ...(showFavorites && {
                                bgcolor: alpha('#E91E63', 0.1),
                                color: '#E91E63',
                                borderColor: alpha('#E91E63', 0.4),
                                '&:hover': { bgcolor: alpha('#E91E63', 0.2) }
                            }),
                        }}
                    />
                </Box>

                {/* Facet toggle */}
                <IconButton
                    size="small"
                    onClick={() => setShowFacets(!showFacets)}
                    sx={{
                        bgcolor: facetCount > 0 || showFacets ? 'action.selected' : 'transparent',
                        border: '1px solid',
                        borderColor: 'divider',
                        color: 'text.secondary',
                        borderRadius: 1,
                        p: 0.5,
                        '&:hover': { bgcolor: 'action.hover' }
                    }}
                >
                    <FilterList sx={{ fontSize: 18 }} />
                </IconButton>

                {/* Sort toggle */}
                <IconButton
                    size="small"
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    sx={{
                        bgcolor: anchorEl ? 'action.selected' : 'transparent',
                        border: '1px solid',
                        borderColor: 'divider',
                        color: 'text.secondary',
                        borderRadius: 1,
                        p: 0.5,
                        '&:hover': { bgcolor: 'action.hover' }
                    }}
                >
                    <Sort sx={{ fontSize: 18 }} />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                    PaperProps={{
                        sx: { mt: 1, border: '1px solid', borderColor: 'divider', boxShadow: 3 }
                    }}
                >
                    {SORT_OPTIONS.map((s) => (
                        <MenuItem
                            key={s}
                            selected={sort === s}
                            onClick={() => {
                                setSort(s as any);
                                setAnchorEl(null);
                            }}
                            sx={{ fontSize: '0.875rem' }}
                        >
                            {s}
                        </MenuItem>
                    ))}
                </Menu>

                {/* View toggles */}
                <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
                    <IconButton
                        size="small"
                        onClick={() => setView('grid')}
                        sx={{
                            bgcolor: view === 'grid' ? 'action.selected' : 'transparent',
                            border: '1px solid',
                            borderColor: 'divider',
                            color: view === 'grid' ? 'text.primary' : 'text.disabled',
                            borderRadius: 1,
                            p: 0.5,
                            '&:hover': { bgcolor: 'action.hover' }
                        }}
                    >
                        <GridView sx={{ fontSize: 18 }} />
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={() => setView('list')}
                        sx={{
                            bgcolor: view === 'list' ? 'action.selected' : 'transparent',
                            border: '1px solid',
                            borderColor: 'divider',
                            color: view === 'list' ? 'text.primary' : 'text.disabled',
                            borderRadius: 1,
                            p: 0.5,
                            '&:hover': { bgcolor: 'action.hover' }
                        }}
                    >
                        <ViewList sx={{ fontSize: 18 }} />
                    </IconButton>
                </Box>

                {/* Count */}
                <Typography variant="caption" color="text.disabled" sx={{ whiteSpace: 'nowrap' }}>
                    {total} results
                </Typography>
            </Box>

            {/* Facet panel */}
            {showFacets && <FacetPanel onClose={() => setShowFacets(false)} />}
        </Box>
    );
};
