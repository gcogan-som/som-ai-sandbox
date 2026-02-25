import { atom } from 'jotai';
import type { SortOption, ViewMode, FacetFilters } from '../types';

export const searchAtom = atom('');
export const categoryAtom = atom<string>('All');
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
