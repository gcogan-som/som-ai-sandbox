import { atom } from 'jotai';
import type { SortOption, ViewMode, FacetFilters } from '../types';

export const searchAtom = atom('');
export const categoryAtom = atom<string>('All');
export const showFavoritesAtom = atom<boolean>(false);
export const sortAtom = atom<SortOption>('Newest');
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

const getInitialFavorites = (): (string | number)[] => {
    try {
        const saved = localStorage.getItem('som_favorites');
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
};

const _favAtom = atom<(string | number)[]>(getInitialFavorites());

export const favoritesAtom = atom(
    (get) => get(_favAtom),
    (get, set, updater: (string | number)[] | ((prev: (string | number)[]) => (string | number)[])) => {
        const next = typeof updater === 'function' ? updater(get(_favAtom)) : updater;
        set(_favAtom, next);
        localStorage.setItem('som_favorites', JSON.stringify(next));
    }
);
