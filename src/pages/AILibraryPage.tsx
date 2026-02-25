import React from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { Box, Typography, Grid } from '@mui/material';
import { searchAtom, favoritesAtom } from '../atoms/filterAtoms';
import { ITEMS } from '../data/mockItems';
import {
    selectedItemAtom,
    showSubmitAtom,
    showAboutAtom,
    showReqAtom,
} from '../atoms/modalAtoms';
import { StandardAccordion } from '@som/ui';
import { useFilter } from '../hooks/useFilter';
import { HeroSection } from '../components/hero/HeroSection';
import { LibraryFilterBar } from '../components/filters/LibraryFilterBar';
import { PopularSection } from '../components/cards/PopularSection';
import { ResourceCard } from '../components/cards/ResourceCard';
import { ResourceDetailModal } from '../components/modals/ResourceDetailModal';
import { ContributeModal } from '../components/modals/ContributeModal';
import { RequestModal } from '../components/modals/RequestModal';
import { AboutPanel } from '../components/modals/AboutPanel';

const SecHead: React.FC<{ title: string; count: number; sub: string }> = ({ title, count, sub }) => (
    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
        <Typography variant="h2" component="h2" sx={{ fontSize: '1.25rem' }}>
            {title}
        </Typography>
        <Typography variant="caption" color="text.disabled" sx={{ fontFamily: 'monospace' }}>
            ({count})
        </Typography>
    </Box>
);

export const AILibraryPage: React.FC = () => {
    const [selected, setSelected] = useAtom(selectedItemAtom);
    const [showSubmit, setShowSubmit] = useAtom(showSubmitAtom);
    const [showAbout, setShowAbout] = useAtom(showAboutAtom);
    const showReq = useAtomValue(showReqAtom);
    const setSearch = useSetAtom(searchAtom);

    const { useItems, learnItems, total } = useFilter();
    const favorites = useAtomValue(favoritesAtom);
    const favoriteItems = ITEMS.filter(i => favorites.includes(i.id));

    const handleAuthorClick = (author: string) => {
        setSearch(author);
    };

    return (
        <Box sx={{ maxWidth: 1360, mx: 'auto', px: { xs: 2, sm: 3, md: 4.5 } }}>
            <HeroSection />
            <PopularSection onSelect={setSelected} />
            <LibraryFilterBar total={total} />

            {/* Favorites Section */}
            {favoriteItems.length > 0 && (
                <Box component="section" sx={{ mb: 4.5, animation: 'fadeUp 0.4s ease both' }}>
                    <StandardAccordion
                        defaultExpanded
                        title={<SecHead title="Favorites" count={favoriteItems.length} sub="" />}
                        subtitle="Your saved resources"
                    >
                        <Grid container spacing={1.25}>
                            {favoriteItems.map((item, i) => (
                                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
                                    <ResourceCard item={item} index={i} onClick={setSelected} />
                                </Grid>
                            ))}
                        </Grid>
                    </StandardAccordion>
                </Box>
            )}

            {/* Use Section */}
            {useItems.length > 0 && (
                <Box component="section" sx={{ mb: 4.5, animation: 'fadeUp 0.4s ease both' }}>
                    <StandardAccordion
                        defaultExpanded
                        title={<SecHead title="Use" count={useItems.length} sub="" />}
                        subtitle="Tools, prompts, and workflows ready to use today"
                    >
                        <Grid container spacing={1.25}>
                            {useItems.map((item, i) => (
                                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
                                    <ResourceCard item={item} index={i} onClick={setSelected} />
                                </Grid>
                            ))}
                        </Grid>
                    </StandardAccordion>
                </Box>
            )}

            {/* Learn Section */}
            {learnItems.length > 0 && (
                <Box component="section" sx={{ mb: 4.5, animation: 'fadeUp 0.4s ease both' }}>
                    <StandardAccordion
                        defaultExpanded
                        title={<SecHead title="Learn" count={learnItems.length} sub="" />}
                        subtitle="Case studies, tutorials, and methodology guides"
                    >
                        <Grid container spacing={1.25}>
                            {learnItems.map((item, i) => (
                                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
                                    <ResourceCard item={item} index={i} onClick={setSelected} />
                                </Grid>
                            ))}
                        </Grid>
                    </StandardAccordion>
                </Box>
            )}

            {/* Empty state */}
            {total === 0 && (
                <Box sx={{ textAlign: 'center', py: 8, animation: 'fadeUp 0.3s ease' }}>
                    <Typography variant="h1" sx={{ mb: 1.5, opacity: 0.3 }}>∅</Typography>
                    <Typography variant="body1" color="text.secondary">
                        No resources match your filters. Try adjusting your search.
                    </Typography>
                </Box>
            )}

            {/* Modals */}
            {selected && (
                <ResourceDetailModal
                    item={selected}
                    onClose={() => setSelected(null)}
                    onAuthorClick={handleAuthorClick}
                />
            )}
            {showSubmit && <ContributeModal onClose={() => setShowSubmit(false)} />}
            {showAbout && <AboutPanel onClose={() => setShowAbout(false)} />}
            {showReq && <RequestModal />}
        </Box>
    );
};
