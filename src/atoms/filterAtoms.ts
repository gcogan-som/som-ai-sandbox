import { atom } from 'jotai';
import type { SortOption, ViewMode, FacetFilters } from '../types';

export const searchAtom = atom('');
export const categoryAtom = atom<string>('All');
export const showFavoritesAtom = atom<boolean>(false);
export const sortAtom = atom<SortOption>('Trending');
export const viewAtom = atom<ViewMode>('grid');
export const facetsAtom = atom<FacetFilters>({
    tags: [],
    offices: [],
    disciplines: [],
    authors: [],
});
export const facetCountAtom = atom((get) => {
    const f = get(facetsAtom);
    return Object.values(f).reduce((s, a) => s + a.length, 0);
});

const getInitialFavorites = (): number[] => {
    try {
        const saved = localStorage.getItem('som_favorites');
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
};

const _favAtom = atom<number[]>(getInitialFavorites());

export const favoritesAtom = atom(
    (get) => get(_favAtom),
    (get, set, updater: number[] | ((prev: number[]) => number[])) => {
        const next = typeof updater === 'function' ? updater(get(_favAtom)) : updater;
        set(_favAtom, next);
        localStorage.setItem('som_favorites', JSON.stringify(next));
    }
);
