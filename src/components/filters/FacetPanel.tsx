import React, { useRef, useEffect, useMemo } from 'react';
import { useAtom } from 'jotai';
import { facetsAtom } from '../../atoms/filterAtoms';
import { ITEMS } from '../../data/mockItems';
import type { FacetFilters } from '../../types';

interface FacetPanelProps {
    onClose: () => void;
}

export const FacetPanel: React.FC<FacetPanelProps> = ({ onClose }) => {
    const [filters, setFilters] = useAtom(facetsAtom);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const h = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) onClose();
        };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, [onClose]);

    const items = ITEMS;
    const allDisc = useMemo(() => [...new Set(items.map((i) => i.discipline))].sort(), [items]);
    const allOffice = useMemo(() => [...new Set(items.map((i) => i.office))].sort(), [items]);
    const allAuthors = useMemo(() => [...new Set(items.map((i) => i.author))].sort(), [items]);
    const allTags = useMemo(() => [...new Set(items.flatMap((i) => i.tags))].sort(), [items]);

    const toggle = (k: keyof FacetFilters, v: string) => {
        const arr = filters[k];
        setFilters({
            ...filters,
            [k]: arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v],
        });
    };

    const ct = Object.values(filters).reduce((s, a) => s + a.length, 0);

    const Section = ({
        title,
        data,
        filterKey,
    }: {
        title: string;
        data: [string, number][];
        filterKey: keyof FacetFilters;
    }) => (
        <div style={{ marginBottom: 12 }}>
            <div
                style={{
                    fontSize: 9,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: '#444',
                    fontFamily: 'var(--sans)',
                    marginBottom: 6,
                }}
            >
                {title}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                {data.map(([v, c]) => {
                    const active = filters[filterKey].includes(v);
                    return (
                        <button
                            key={v}
                            onClick={() => toggle(filterKey, v)}
                            style={{
                                fontSize: 10.5,
                                padding: '3px 9px',
                                borderRadius: 100,
                                border: `1px solid ${active ? '#D4845A55' : '#262626'}`,
                                background: active ? 'rgba(212,132,90,0.08)' : 'transparent',
                                color: active ? '#D4845A' : '#666',
                                cursor: 'pointer',
                                fontFamily: 'var(--sans)',
                                transition: 'all 0.12s',
                            }}
                        >
                            {v}
                            <span style={{ fontSize: 9, color: '#444', marginLeft: 3 }}>({c})</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div
            ref={ref}
            style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: 6,
                background: '#151515',
                border: '1px solid #262626',
                borderRadius: 13,
                padding: '18px 20px',
                zIndex: 50,
                boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                animation: 'fadeUp 0.2s ease',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 14,
                }}
            >
                <span
                    style={{
                        fontSize: 12.5,
                        color: '#ccc',
                        fontFamily: 'var(--sans)',
                        fontWeight: 500,
                    }}
                >
                    Filters
                </span>
                {ct > 0 && (
                    <button
                        onClick={() =>
                            setFilters({ tags: [], offices: [], disciplines: [], authors: [] })
                        }
                        style={{
                            fontSize: 10.5,
                            background: 'rgba(212,132,90,0.08)',
                            border: '1px solid rgba(212,132,90,0.2)',
                            borderRadius: 100,
                            padding: '2px 10px',
                            color: '#D4845A',
                            cursor: 'pointer',
                            fontFamily: 'var(--sans)',
                        }}
                    >
                        Clear all ({ct})
                    </button>
                )}
            </div>
            <Section
                title="Discipline"
                data={allDisc.map((d) => [d, items.filter((i) => i.discipline === d).length])}
                filterKey="disciplines"
            />
            <Section
                title="Office"
                data={allOffice.map((o) => [o, items.filter((i) => i.office === o).length])}
                filterKey="offices"
            />
            <Section
                title="Author"
                data={allAuthors.map((a) => [a, items.filter((i) => i.author === a).length])}
                filterKey="authors"
            />
            <Section
                title="Tags"
                data={allTags.map((t) => [t, items.filter((i) => i.tags.includes(t)).length])}
                filterKey="tags"
            />
        </div>
    );
};
