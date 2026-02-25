import React, { useMemo } from 'react';
import { ITEMS } from '../../data/mockItems';
import { COLORS } from '../../data/categories';
import { CatIcon } from '../shared/CatIcon';
import { StarsDisplay } from '../shared/StarRating';
import type { ResourceItem } from '../../types';

interface PopularSectionProps {
    onSelect: (item: ResourceItem) => void;
}

export const PopularSection: React.FC<PopularSectionProps> = ({ onSelect }) => {
    const offices = [...new Set(ITEMS.map((i) => i.office).filter((o) => o !== 'Firmwide'))];
    const office = useMemo(() => offices[Math.floor(Math.random() * offices.length)], []);
    const officeItems = useMemo(
        () =>
            ITEMS.filter((i) => i.office === office && i.kind === 'use')
                .sort((a, b) => b.uses - a.uses)
                .slice(0, 5),
        [office]
    );

    if (officeItems.length === 0) return null;

    return (
        <div style={{ marginBottom: 28 }}>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 14,
                }}
            >
                <span
                    style={{
                        fontSize: 11,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        color: '#555',
                        fontFamily: 'var(--sans)',
                        fontWeight: 500,
                    }}
                >
                    Popular in {office}
                </span>
            </div>
            <div
                style={{
                    display: 'flex',
                    gap: 8,
                    overflowX: 'auto',
                    paddingBottom: 8,
                    scrollSnapType: 'x mandatory',
                }}
            >
                {officeItems.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => onSelect(item)}
                        style={{
                            flexShrink: 0,
                            width: 240,
                            background: '#131313',
                            border: '1px solid #1a1a1a',
                            borderRadius: 11,
                            padding: '14px 16px',
                            cursor: 'pointer',
                            scrollSnapAlign: 'start',
                            transition: 'border-color 0.15s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#262626')}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#1a1a1a')}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                            <CatIcon category={item.category} size={12} />
                            <span
                                style={{
                                    fontSize: 9,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    color: COLORS[item.category],
                                    fontFamily: 'var(--sans)',
                                }}
                            >
                                {item.category}
                            </span>
                        </div>
                        <div
                            style={{
                                fontSize: 13.5,
                                fontWeight: 400,
                                color: '#ddd',
                                fontFamily: 'var(--serif)',
                                lineHeight: 1.25,
                                marginBottom: 6,
                            }}
                        >
                            {item.title}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <StarsDisplay rating={item.rating} size={8} />
                            <span style={{ fontSize: 9, color: '#444', fontFamily: 'var(--mono)' }}>
                                {item.uses} uses
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
