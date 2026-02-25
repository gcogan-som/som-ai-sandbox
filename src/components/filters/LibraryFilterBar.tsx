import React, { useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import {
    Box, Typography, Chip, Select, MenuItem, ToggleButtonGroup, ToggleButton,
    type SelectChangeEvent,
} from '@mui/material';
import { GridView, ViewList, FilterList } from '@mui/icons-material';
import { StandardSearchInput } from '@som/ui';
import {
    searchAtom,
    categoryAtom,
    sortAtom,
    viewAtom,
    facetCountAtom,
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
    const facetCount = useAtomValue(facetCountAtom);
    const [showFacets, setShowFacets] = useState(false);
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
                                onClick={() => setCategory(c)}
                                size="small"
                                variant={active ? 'filled' : 'outlined'}
                                sx={{
                                    cursor: 'pointer',
                                    ...(active && accentColor ? {
                                        bgcolor: `${accentColor}18`,
                                        borderColor: `${accentColor}55`,
                                        color: accentColor,
                                    } : {}),
                                }}
                            />
                        );
                    })}
                </Box>

                {/* Facet toggle */}
                <Chip
                    icon={<FilterList sx={{ fontSize: 14 }} />}
                    label={`Filters${facetCount > 0 ? ` (${facetCount})` : ''}`}
                    onClick={() => setShowFacets(!showFacets)}
                    size="small"
                    variant={facetCount > 0 ? 'filled' : 'outlined'}
                    sx={{ cursor: 'pointer' }}
                />

                {/* Sort */}
                <Select
                    value={sort}
                    onChange={(e: SelectChangeEvent) => setSort(e.target.value as typeof SORT_OPTIONS[number])}
                    size="small"
                    variant="outlined"
                    sx={{
                        fontSize: '11px',
                        height: 28,
                        '& .MuiSelect-select': { py: 0.5, px: 1.25 },
                    }}
                >
                    {SORT_OPTIONS.map((s) => (
                        <MenuItem key={s} value={s} sx={{ fontSize: '11px' }}>{s}</MenuItem>
                    ))}
                </Select>

                {/* View toggle */}
                <ToggleButtonGroup
                    value={view}
                    exclusive
                    onChange={(_, v) => v && setView(v)}
                    size="small"
                >
                    <ToggleButton value="grid" sx={{ px: 1, py: 0.5 }}>
                        <GridView sx={{ fontSize: 14 }} />
                    </ToggleButton>
                    <ToggleButton value="list" sx={{ px: 1, py: 0.5 }}>
                        <ViewList sx={{ fontSize: 14 }} />
                    </ToggleButton>
                </ToggleButtonGroup>

                {/* Count */}
                <Typography variant="caption" color="text.disabled" sx={{ fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                    {total} results
                </Typography>
            </Box>

            {/* Facet panel */}
            {showFacets && <FacetPanel onClose={() => setShowFacets(false)} />}
        </Box>
    );
};
