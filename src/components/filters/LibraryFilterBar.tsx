import React, { useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import {
    searchAtom,
    categoryAtom,
    sortAtom,
    viewAtom,
    facetCountAtom,
} from '../../atoms/filterAtoms';
import { CATEGORIES, SORT_OPTIONS, COLORS } from '../../data/categories';
import { useRotatingHint } from '../../hooks/useRotatingHint';
import { FacetPanel } from './FacetPanel';
import type { CategoryName } from '../../types';

interface LibraryFilterBarProps {
    total: number;
}

export const LibraryFilterBar: React.FC<LibraryFilterBarProps> = ({ total }) => {
    const [search, setSearch] = useAtom(searchAtom);
    const [category, setCategory] = useAtom(categoryAtom);
    const [sort, setSort] = useAtom(sortAtom);
    const [view, setView] = useAtom(viewAtom);
    const facetCount = useAtomValue(facetCountAtom);
    const [showFacets, setShowFacets] = useState(false);
    const placeholder = useRotatingHint();

    return (
        <div style={{ position: 'relative', marginBottom: 20 }}>
            {/* Search */}
            <div style={{ position: 'relative', marginBottom: 12 }}>
                <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#444"
                    strokeWidth="2"
                    strokeLinecap="round"
                    style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}
                >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={placeholder}
                    style={{
                        width: '100%',
                        background: '#151515',
                        border: '1px solid #1e1e1e',
                        borderRadius: 11,
                        padding: '10px 14px 10px 38px',
                        color: '#ccc',
                        fontSize: 13,
                        fontFamily: 'var(--sans)',
                        outline: 'none',
                        boxSizing: 'border-box',
                        transition: 'border-color 0.15s',
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#333')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = '#1e1e1e')}
                />
            </div>

            {/* Category pills + controls row */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    flexWrap: 'wrap',
                }}
            >
                {/* Category pills */}
                <div
                    style={{
                        display: 'flex', gap: 3, flex: 1, flexWrap: 'wrap',
                    }}
                >
                    {CATEGORIES.map((c) => {
                        const active = category === c;
                        return (
                            <button
                                key={c}
                                onClick={() => setCategory(c)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 5,
                                    padding: '5px 11px',
                                    borderRadius: 100,
                                    border: `1px solid ${active ? (c === 'All' ? '#555' : COLORS[c as CategoryName] + '55') : '#262626'}`,
                                    background: active
                                        ? c === 'All'
                                            ? 'rgba(255,255,255,0.05)'
                                            : `${COLORS[c as CategoryName]}12`
                                        : 'transparent',
                                    color: active ? (c === 'All' ? '#ccc' : COLORS[c as CategoryName]) : '#555',
                                    fontSize: 11,
                                    fontFamily: 'var(--sans)',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {c !== 'All' && (
                                    <span
                                        style={{
                                            width: 6,
                                            height: 6,
                                            borderRadius: '50%',
                                            background: COLORS[c as CategoryName],
                                            opacity: active ? 1 : 0.3,
                                        }}
                                    />
                                )}
                                {c}
                            </button>
                        );
                    })}
                </div>

                {/* Facet toggle */}
                <button
                    onClick={() => setShowFacets(!showFacets)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '5px 11px',
                        borderRadius: 100,
                        border: `1px solid ${facetCount > 0 ? '#D4845A55' : '#262626'}`,
                        background: facetCount > 0 ? 'rgba(212,132,90,0.06)' : 'transparent',
                        color: facetCount > 0 ? '#D4845A' : '#555',
                        fontSize: 11,
                        fontFamily: 'var(--sans)',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                    }}
                >
                    <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    >
                        <line x1="4" y1="6" x2="20" y2="6" />
                        <line x1="8" y1="12" x2="16" y2="12" />
                        <line x1="11" y1="18" x2="13" y2="18" />
                    </svg>
                    Filters{facetCount > 0 ? ` (${facetCount})` : ''}
                </button>

                {/* Sort */}
                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as any)}
                    style={{
                        background: '#151515',
                        border: '1px solid #262626',
                        borderRadius: 100,
                        padding: '5px 11px',
                        color: '#777',
                        fontSize: 11,
                        fontFamily: 'var(--sans)',
                        outline: 'none',
                        cursor: 'pointer',
                    }}
                >
                    {SORT_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>

                {/* View toggle */}
                <div
                    style={{
                        display: 'flex',
                        background: '#151515',
                        borderRadius: 100,
                        border: '1px solid #262626',
                        overflow: 'hidden',
                    }}
                >
                    {(['grid', 'list'] as const).map((v) => (
                        <button
                            key={v}
                            onClick={() => setView(v)}
                            style={{
                                padding: '5px 9px',
                                background: view === v ? '#1e1e1e' : 'transparent',
                                border: 'none',
                                color: view === v ? '#ccc' : '#444',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            {v === 'grid' ? (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                    <rect x="3" y="3" width="7" height="7" rx="1" />
                                    <rect x="14" y="3" width="7" height="7" rx="1" />
                                    <rect x="3" y="14" width="7" height="7" rx="1" />
                                    <rect x="14" y="14" width="7" height="7" rx="1" />
                                </svg>
                            ) : (
                                <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <line x1="3" y1="6" x2="21" y2="6" />
                                    <line x1="3" y1="12" x2="21" y2="12" />
                                    <line x1="3" y1="18" x2="21" y2="18" />
                                </svg>
                            )}
                        </button>
                    ))}
                </div>

                {/* Count */}
                <span
                    style={{
                        fontSize: 10.5,
                        color: '#444',
                        fontFamily: 'var(--mono)',
                        whiteSpace: 'nowrap',
                    }}
                >
                    {total} results
                </span>
            </div>

            {/* Facet panel */}
            {showFacets && <FacetPanel onClose={() => setShowFacets(false)} />}
        </div>
    );
};
