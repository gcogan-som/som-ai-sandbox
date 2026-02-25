import React, { useState } from 'react';
import type { ResourceItem, Tip } from '../../types';
import { COLORS } from '../../data/categories';
import { CatIcon } from '../shared/CatIcon';
import { StarsDisplay } from '../shared/StarRating';
import { VerifiedBadge } from '../shared/VerifiedBadge';

interface ResourceCardProps {
    item: ResourceItem;
    index: number;
    onClick: (item: ResourceItem) => void;
    compact?: boolean;
}

const TODAY = new Date('2026-02-25');
const daysAgo = (d: string) => Math.floor((TODAY.getTime() - new Date(d).getTime()) / 86400000);

const NewBadge: React.FC<{ date: string }> = ({ date }) => {
    const d = daysAgo(date);
    if (d > 7) return null;
    const label = d <= 1 ? 'Today' : d <= 3 ? `${d}d ago` : 'New';
    return (
        <span
            style={{
                fontSize: 8,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                padding: '2px 5px',
                borderRadius: 3,
                background: 'rgba(138,188,138,0.12)',
                color: '#8BC78A',
                fontFamily: 'var(--sans)',
                fontWeight: 600,
            }}
        >
            {label}
        </span>
    );
};

export const ResourceCard: React.FC<ResourceCardProps> = ({ item, index, onClick, compact }) => {
    const [hovered, setHovered] = useState(false);
    const isLearn = item.kind === 'learn';
    const topTip: Tip | null =
        item.tips.length > 0 ? [...item.tips].sort((a, b) => b.votes - a.votes)[0] : null;

    return (
        <div
            onClick={() => onClick(item)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: hovered ? '#181818' : '#131313',
                borderRadius: 13,
                cursor: 'pointer',
                overflow: 'hidden',
                border: `1px solid ${hovered ? '#262626' : '#1a1a1a'}`,
                transition: 'all 0.3s cubic-bezier(0.25,0.46,0.45,0.94)',
                transform: hovered ? 'translateY(-2px)' : 'none',
                animation: `fadeUp 0.4s ease ${index * 0.03}s both`,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Accent bar */}
            <div
                style={{
                    height: 2,
                    background: COLORS[item.category],
                    opacity: hovered ? 0.85 : 0.3,
                    transition: 'opacity 0.3s',
                }}
            />
            <div
                style={{
                    padding: compact ? '14px 16px 13px' : '16px 18px 15px',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {/* Header */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: 9,
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <div
                            style={{
                                width: 28,
                                height: 28,
                                borderRadius: 7,
                                background: `${COLORS[item.category]}14`,
                                border: `1px solid ${COLORS[item.category]}25`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <CatIcon category={item.category} size={14} />
                        </div>
                        <span
                            style={{
                                fontSize: 9,
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                color: COLORS[item.category],
                                fontFamily: 'var(--sans)',
                                fontWeight: 500,
                            }}
                        >
                            {item.category}
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                        <NewBadge date={item.date} />
                        {isLearn && (
                            <span
                                style={{
                                    fontSize: 7.5,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    padding: '2px 5px',
                                    borderRadius: 3,
                                    background: 'rgba(255,255,255,0.04)',
                                    color: '#666',
                                    fontFamily: 'var(--sans)',
                                    fontWeight: 600,
                                }}
                            >
                                Guide
                            </span>
                        )}
                        {item.verified && <VerifiedBadge />}
                    </div>
                </div>

                {/* Title */}
                <h3
                    style={{
                        fontSize: compact ? 14 : 15.5,
                        fontWeight: 400,
                        color: '#e4e4e4',
                        margin: '0 0 5px',
                        fontFamily: 'var(--serif)',
                        lineHeight: 1.25,
                    }}
                >
                    {item.title}
                </h3>

                {/* Description */}
                <p
                    style={{
                        fontSize: 11.5,
                        color: '#555',
                        lineHeight: 1.5,
                        margin: '0 0 10px',
                        fontFamily: 'var(--sans)',
                        display: '-webkit-box',
                        WebkitLineClamp: compact ? 2 : 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        flex: 1,
                    }}
                >
                    {item.description}
                </p>

                {/* Top tip preview */}
                {topTip && !compact && (
                    <div
                        style={{
                            background: '#171717',
                            borderRadius: 7,
                            padding: '8px 10px',
                            marginBottom: 10,
                            borderLeft: `2px solid ${COLORS[item.category]}30`,
                        }}
                    >
                        <p
                            style={{
                                fontSize: 11,
                                color: '#777',
                                lineHeight: 1.45,
                                margin: 0,
                                fontFamily: 'var(--sans)',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                            }}
                        >
                            &ldquo;{topTip.text}&rdquo;
                        </p>
                        <div style={{ fontSize: 9.5, color: '#555', marginTop: 3, fontFamily: 'var(--sans)' }}>
                            — {topTip.author} · ▲ {topTip.votes}
                        </div>
                    </div>
                )}

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: 11 }}>
                    {item.tags.slice(0, 3).map((t) => (
                        <span
                            key={t}
                            style={{
                                fontSize: 9,
                                color: '#555',
                                background: '#171717',
                                padding: '2px 7px',
                                borderRadius: 100,
                                fontFamily: 'var(--mono)',
                            }}
                        >
                            {t}
                        </span>
                    ))}
                </div>

                {/* Footer */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: 9,
                        borderTop: '1px solid #1a1a1a',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div
                            style={{
                                width: 19,
                                height: 19,
                                borderRadius: '50%',
                                background: `${COLORS[item.category]}1a`,
                                color: COLORS[item.category],
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 8,
                                fontWeight: 600,
                                fontFamily: 'var(--sans)',
                            }}
                        >
                            {item.author
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                        </div>
                        <span style={{ fontSize: 10.5, color: '#555', fontFamily: 'var(--sans)' }}>
                            {item.author}
                        </span>
                        <span style={{ fontSize: 9, color: '#333' }}>·</span>
                        <span style={{ fontSize: 10, color: '#444', fontFamily: 'var(--sans)' }}>
                            {item.office}
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {item.tips.length > 0 && (
                            <span
                                style={{
                                    fontSize: 10,
                                    color: '#555',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                }}
                            >
                                <svg
                                    width="10"
                                    height="10"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#555"
                                    strokeWidth="2"
                                >
                                    <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                                </svg>
                                {item.tips.length}
                            </span>
                        )}
                        <StarsDisplay rating={item.rating} size={9} />
                        {item.uses >= 10 && (
                            <span style={{ fontSize: 9.5, color: '#444', fontFamily: 'var(--mono)' }}>
                                {item.uses}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
