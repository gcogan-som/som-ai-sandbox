import React, { useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { StandardFilterBar } from '@som/ui';
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

/**
 * LibraryFilterBar
 * 
 * App-specific wrapper that binds the foundation StandardFilterBar 
 * to Jotai State and application data (Categories, Icons, etc).
 */
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
    const placeholder = useRotatingHint();

    // Map categories to FilterOption format
    const filters = CATEGORIES.map(c => ({
        value: c,
        label: c,
        color: c !== 'All' ? COLORS[c as CategoryName] : undefined
    }));

    return (
        <StandardFilterBar
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder={placeholder}

            filters={filters}
            selectedFilters={[category]}
            onFilterToggle={(val) => {
                setCategory(val);
                if (val === 'All') {
                    setSort('Newest');
                    setShowFavorites(false);
                    setFacets({ tags: [], offices: [], disciplines: [], authors: [] });
                }
            }}

            showTrending
            trendingActive={sort === 'Trending'}
            onTrendingToggle={() => setSort(sort === 'Trending' ? 'Newest' : 'Trending')}

            showSaved
            savedActive={showFavorites}
            savedCount={favorites.length}
            onSavedToggle={() => setShowFavorites(!showFavorites)}

            resultsCount={total}

            onFacetToggle={() => setShowFacets(!showFacets)}
            facetPanelActive={showFacets || facetCount > 0}
            facetCount={facetCount}

            sortOptions={SORT_OPTIONS as any}
            activeSort={sort}
            onSortChange={(val) => setSort(val as any)}

            view={view}
            onViewToggle={setView}

            sx={{ mb: 2.5 }}

            // Render the facet panel as a child when active
            renderExtra={showFacets ? <FacetPanel onClose={() => setShowFacets(false)} /> : undefined}
        />
    );
};
