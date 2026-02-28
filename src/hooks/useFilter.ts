import { useCallback, useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { searchAtom, categoryAtom, sortAtom, facetsAtom, showFavoritesAtom, favoritesAtom } from '../atoms/filterAtoms';
import { activeItemsAtom } from '../atoms/appAtoms';
import type { ResourceItem } from '../types';

export function useFilter() {
    const search = useAtomValue(searchAtom);
    const category = useAtomValue(categoryAtom);
    const sort = useAtomValue(sortAtom);
    const facets = useAtomValue(facetsAtom);
    const showFavorites = useAtomValue(showFavoritesAtom);
    const favorites = useAtomValue(favoritesAtom);
    const activeItems = useAtomValue(activeItemsAtom);

    const doFilter = useCallback(
        (items: ResourceItem[]) => {
            let r = [...items];
            if (showFavorites) r = r.filter((i) => favorites.includes(i.id));
            if (category !== 'All') r = r.filter((i) => i.category === category);
            if (facets.tags.length)
                r = r.filter((i) => facets.tags.some((t) => i.tags.includes(t)));
            if (facets.offices.length)
                r = r.filter((i) => facets.offices.includes(i.office));
            if (facets.disciplines.length)
                r = r.filter((i) => facets.disciplines.includes(i.discipline));
            if (facets.authors.length)
                r = r.filter((i) => facets.authors.includes(i.author));
            if (facets.aiModels.length)
                r = r.filter((i) => i.aiModel && facets.aiModels.includes(i.aiModel));
            if (search) {
                const q = search.toLowerCase();
                r = r.filter(
                    (i) =>
                        i.title.toLowerCase().includes(q) ||
                        i.description.toLowerCase().includes(q) ||
                        i.tags.some((t) => t.includes(q)) ||
                        i.author.toLowerCase().includes(q) ||
                        i.office.toLowerCase().includes(q) ||
                        i.discipline.toLowerCase().includes(q)
                );
            }
            switch (sort) {
                case 'Newest':
                    r.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                    break;
                case 'Top Rated':
                    r.sort((a, b) => b.rating - a.rating);
                    break;
                case 'Most Used':
                    r.sort((a, b) => b.uses - a.uses);
                    break;
                default:
                    r.sort((a, b) => b.rating * b.uses - a.rating * a.uses);
            }
            return r;
        },
        [category, sort, search, facets, showFavorites, favorites]
    );

    const toolItems = useMemo(
        () => doFilter(activeItems.filter((i) => i.kind === 'tool')),
        [doFilter, activeItems]
    );
    const exampleItems = useMemo(
        () => doFilter(activeItems.filter((i) => i.kind === 'example')),
        [doFilter, activeItems]
    );
    const guideItems = useMemo(
        () => doFilter(activeItems.filter((i) => i.kind === 'guide')),
        [doFilter, activeItems]
    );
    const workflowItems = useMemo(
        () => doFilter(activeItems.filter((i) => i.kind === 'workflow')),
        [doFilter, activeItems]
    );
    const ideaItems = useMemo(
        () => doFilter(activeItems.filter((i) => i.kind === 'idea')),
        [doFilter, activeItems]
    );

    return {
        toolItems,
        exampleItems,
        guideItems,
        workflowItems,
        ideaItems,
        total: toolItems.length + exampleItems.length + guideItems.length + workflowItems.length + ideaItems.length
    };
}
