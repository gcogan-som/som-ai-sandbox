import React from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { Box, Typography } from '@mui/material';
import { searchAtom, viewAtom } from '../atoms/filterAtoms';
import {
    selectedItemAtom,
} from '../atoms/modalAtoms';
import { StandardAccordion, StandardSectionHeader, StandardCollectionGrid, StandardButton } from '@som/ui';
import { useFilter } from '../hooks/useFilter';
import { HeroSection } from '../components/hero/HeroSection';
import { LibraryFilterBar } from '../components/filters/LibraryFilterBar';
import { ResourceCard } from '../components/cards/ResourceCard';
import { ResourceDetailModal } from '../components/modals/ResourceDetailModal';

export const AILibraryPage: React.FC = () => {
    const [selected, setSelected] = useAtom(selectedItemAtom);
    const setSearch = useSetAtom(searchAtom);

    const view = useAtomValue(viewAtom);
    const { toolItems, exampleItems, guideItems, workflowItems, ideaItems, total } = useFilter();

    // Deep Linking: Handle URL hash for sharing (e.g., #resource-id)
    React.useEffect(() => {
        const handleHashChange = () => {
            const hashId = window.location.hash.replace('#', '');
            if (hashId) {
                // Find item in all possible list collections
                const allItems = [...toolItems, ...exampleItems, ...guideItems, ...workflowItems, ...ideaItems];
                const found = allItems.find(i => String(i.id) === hashId);
                if (found) {
                    setSelected(found);
                }
            }
        };

        handleHashChange();
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, [toolItems, exampleItems, guideItems, workflowItems, ideaItems, setSelected]);

    const handleAuthorClick = (author: string) => {
        setSearch(author);
    };

    const renderSection = (items: any[], title: string, subtitle: string) => {
        if (items.length === 0) return null;
        return (
            <Box component="section" sx={{ mb: 4.5 }}>
                <StandardAccordion
                    defaultExpanded
                    title={<StandardSectionHeader title={title} count={items.length} showDivider={false} sx={{ mb: 0 }} />}
                    subtitle={subtitle}
                >
                    <StandardCollectionGrid
                        items={items}
                        view={view}
                        animate={false}
                        renderItem={(item, i) => (
                            <ResourceCard item={item} index={i} onClick={setSelected} layout={view} />
                        )}
                    />
                </StandardAccordion>
            </Box>
        );
    };

    return (
        <Box sx={{ maxWidth: 1360, mx: 'auto', px: { xs: 2, sm: 3, md: 4.5 } }}>
            <HeroSection />
            <LibraryFilterBar total={total} />

            {renderSection(toolItems, 'AI Tools & Components', 'Plugins, platforms, and custom experts')}
            {renderSection(exampleItems, 'Examples & Visualization', 'Prompts, outputs, and visual inspiration')}
            {renderSection([...guideItems, ...workflowItems], 'Methodologies & Workflows', 'Step-by-step tutorials and multi-tool processes')}
            {renderSection(ideaItems, 'Future Concepts', 'Early-stage ideas and potential applications')}

            {/* Empty state */}
            {total === 0 && (
                <Box sx={{
                    py: 12,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px dashed',
                    borderColor: 'divider',
                    borderRadius: 4,
                    bgcolor: 'background.paper',
                    mt: 4
                }}>
                    <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1, fontWeight: 700 }}>
                        No results found
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.disabled', mb: 3 }}>
                        Try adjusting your search or filters to find what you're looking for.
                    </Typography>
                    <StandardButton
                        variant="secondary"
                        onClick={() => {
                            setSearch('');
                            // Note: LibraryFilterBar handles resetting other atoms when category is set to 'All'
                            // but we can be explicit here if needed for better UX
                            window.location.hash = '';
                        }}
                    >
                        Clear Search
                    </StandardButton>
                </Box>
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
