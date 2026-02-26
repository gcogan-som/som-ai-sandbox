import React from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { Box } from '@mui/material';
import { searchAtom, viewAtom } from '../atoms/filterAtoms';
import {
    selectedItemAtom,
} from '../atoms/modalAtoms';
import { StandardAccordion, StandardSectionHeader, StandardCollectionGrid } from '@som/ui';
import { useFilter } from '../hooks/useFilter';
import { HeroSection } from '../components/hero/HeroSection';
import { LibraryFilterBar } from '../components/filters/LibraryFilterBar';
import { ResourceCard } from '../components/cards/ResourceCard';
import { ResourceDetailModal } from '../components/modals/ResourceDetailModal';

export const AILibraryPage: React.FC = () => {
    const [selected, setSelected] = useAtom(selectedItemAtom);
    const setSearch = useSetAtom(searchAtom);

    const view = useAtomValue(viewAtom);
    const { useItems, learnItems, total } = useFilter();

    const handleAuthorClick = (author: string) => {
        setSearch(author);
    };

    return (
        <Box sx={{ maxWidth: 1360, mx: 'auto', px: { xs: 2, sm: 3, md: 4.5 } }}>
            <HeroSection />
            <LibraryFilterBar total={total} />

            {/* Use Section */}
            {useItems.length > 0 && (
                <Box component="section" sx={{ mb: 4.5 }}>
                    <StandardAccordion
                        defaultExpanded
                        title={<StandardSectionHeader title="Resources" count={useItems.length} showDivider={false} sx={{ mb: 0 }} />}
                        subtitle="Tools, prompts, and workflows ready to use today"
                    >
                        <StandardCollectionGrid
                            items={useItems}
                            view={view}
                            animate={false}
                            renderItem={(item, i) => (
                                <ResourceCard item={item} index={i} onClick={setSelected} layout={view} />
                            )}
                        />
                    </StandardAccordion>
                </Box>
            )}

            {/* Learn Section */}
            {learnItems.length > 0 && (
                <Box component="section" sx={{ mb: 4.5 }}>
                    <StandardAccordion
                        defaultExpanded
                        title={<StandardSectionHeader title="Guides" count={learnItems.length} showDivider={false} sx={{ mb: 0 }} />}
                        subtitle="Case studies, tutorials, and methodology guides"
                    >
                        <StandardCollectionGrid
                            items={learnItems}
                            view={view}
                            animate={false}
                            renderItem={(item, i) => (
                                <ResourceCard item={item} index={i} onClick={setSelected} layout={view} />
                            )}
                        />
                    </StandardAccordion>
                </Box>
            )}

            {/* Empty state */}
            {total === 0 && (
                <StandardCollectionGrid
                    items={[]}
                    view={view}
                    renderItem={() => null}
                />
            )}

            {selected && (
                <ResourceDetailModal
                    item={selected}
                    onClose={() => setSelected(null)}
                    onAuthorClick={handleAuthorClick}
                />
            )}
        </Box>
    );
};
