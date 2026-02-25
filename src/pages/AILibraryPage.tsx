import React from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { searchAtom } from '../atoms/filterAtoms';
import {
    selectedItemAtom,
    showSubmitAtom,
    showAboutAtom,
    showReqAtom,
} from '../atoms/modalAtoms';
import { useFilter } from '../hooks/useFilter';
import { HeroSection } from '../components/hero/HeroSection';
import { LibraryFilterBar } from '../components/filters/LibraryFilterBar';
import { PopularSection } from '../components/cards/PopularSection';
import { ResourceCard } from '../components/cards/ResourceCard';
import { ResourceDetailModal } from '../components/modals/ResourceDetailModal';
import { ContributeModal } from '../components/modals/ContributeModal';
import { RequestModal } from '../components/modals/RequestModal';
import { AboutPanel } from '../components/modals/AboutPanel';

export const AILibraryPage: React.FC = () => {
    const [selected, setSelected] = useAtom(selectedItemAtom);
    const [showSubmit, setShowSubmit] = useAtom(showSubmitAtom);
    const [showAbout, setShowAbout] = useAtom(showAboutAtom);
    const showReq = useAtomValue(showReqAtom);
    const setSearch = useSetAtom(searchAtom);

    const { useItems, learnItems, total } = useFilter();

    const handleAuthorClick = (author: string) => {
        setSearch(author);
    };

    const SecHead = ({
        title,
        count,
        sub,
    }: {
        title: string;
        count: number;
        sub: string;
    }) => (
        <div style={{ marginBottom: 16, animation: 'fadeUp 0.4s ease both' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <h2
                    style={{
                        fontSize: 22,
                        fontWeight: 400,
                        color: '#ddd',
                        margin: 0,
                        fontFamily: 'var(--serif)',
                    }}
                >
                    {title}
                </h2>
                <span
                    style={{
                        fontSize: 12,
                        color: '#333',
                        fontFamily: 'var(--mono)',
                    }}
                >
                    ({count})
                </span>
            </div>
            <p
                style={{
                    fontSize: 12,
                    color: '#444',
                    margin: '3px 0 0',
                    fontFamily: 'var(--sans)',
                }}
            >
                {sub}
            </p>
        </div>
    );

    return (
        <div
            style={{
                maxWidth: 1360,
                margin: '0 auto',
                padding: '0 36px',
            }}
        >
            <HeroSection />
            <PopularSection onSelect={setSelected} />
            <LibraryFilterBar total={total} />

            {/* Use Section */}
            {useItems.length > 0 && (
                <section style={{ marginBottom: 36 }}>
                    <SecHead
                        title="Use"
                        count={useItems.length}
                        sub="Tools, prompts, and workflows ready to use today"
                    />
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                            gap: 10,
                        }}
                    >
                        {useItems.map((item, i) => (
                            <ResourceCard key={item.id} item={item} index={i} onClick={setSelected} />
                        ))}
                    </div>
                </section>
            )}

            {/* Learn Section */}
            {learnItems.length > 0 && (
                <section style={{ marginBottom: 36 }}>
                    <SecHead
                        title="Learn"
                        count={learnItems.length}
                        sub="Case studies, tutorials, and methodology guides"
                    />
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                            gap: 10,
                        }}
                    >
                        {learnItems.map((item, i) => (
                            <ResourceCard key={item.id} item={item} index={i} onClick={setSelected} />
                        ))}
                    </div>
                </section>
            )}

            {/* Empty */}
            {total === 0 && (
                <div
                    style={{
                        textAlign: 'center',
                        padding: '60px 0',
                        animation: 'fadeUp 0.3s ease',
                    }}
                >
                    <div style={{ fontSize: 32, marginBottom: 12 }}>∅</div>
                    <p
                        style={{
                            fontSize: 14,
                            color: '#555',
                            fontFamily: 'var(--sans)',
                        }}
                    >
                        No resources match your filters. Try adjusting your search.
                    </p>
                </div>
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
        </div>
    );
};
