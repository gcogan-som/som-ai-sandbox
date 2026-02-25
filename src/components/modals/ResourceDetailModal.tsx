import React, { useState } from 'react';
import type { ResourceItem, Tip } from '../../types';
import { COLORS } from '../../data/categories';
import { CatIcon } from '../shared/CatIcon';
import { InteractiveRating } from '../shared/StarRating';
import { VerifiedBadge } from '../shared/VerifiedBadge';

interface ResourceDetailModalProps {
    item: ResourceItem;
    onClose: () => void;
    onAuthorClick: (author: string) => void;
}

export const ResourceDetailModal: React.FC<ResourceDetailModalProps> = ({
    item,
    onClose,
    onAuthorClick,
}) => {
    const [userRating, setUserRating] = useState(0);
    const [newTip, setNewTip] = useState('');
    const [tips, setTips] = useState<Tip[]>(item.tips);
    const [bookmarked, setBookmarked] = useState(false);
    const isLearn = item.kind === 'learn';

    const addTip = () => {
        if (!newTip.trim()) return;
        setTips([...tips, { author: 'You', text: newTip.trim(), votes: 0 }]);
        setNewTip('');
    };
    const voteTip = (idx: number) =>
        setTips(tips.map((t, j) => (j === idx ? { ...t, votes: t.votes + 1 } : t)));
    const sorted = [...tips].sort((a, b) => b.votes - a.votes);

    const actionLabel = isLearn
        ? 'Read Full Guide'
        : item.category === 'Gems'
            ? 'Open in Gemini'
            : item.category === 'AI Studio'
                ? 'Open in AI Studio'
                : item.category === 'Krea'
                    ? 'Open in Krea'
                    : item.category === 'Notebooks'
                        ? 'Open Notebook'
                        : item.category === 'Workflows'
                            ? 'View Full Workflow'
                            : 'Copy Prompt';

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0,0,0,0.7)',
                backdropFilter: 'blur(16px)',
                animation: 'fadeIn 0.2s ease',
            }}
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: '#131313',
                    borderRadius: 18,
                    maxWidth: 600,
                    width: '92%',
                    border: '1px solid #262626',
                    overflow: 'hidden',
                    animation: 'slideUp 0.3s ease',
                    maxHeight: '88vh',
                    overflowY: 'auto',
                }}
            >
                <div style={{ height: 3, background: COLORS[item.category] }} />
                <div style={{ padding: '24px 28px 28px' }}>
                    {/* Header */}
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: 16,
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div
                                style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 9,
                                    background: `${COLORS[item.category]}14`,
                                    border: `1px solid ${COLORS[item.category]}25`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <CatIcon category={item.category} size={18} />
                            </div>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <span
                                        style={{
                                            fontSize: 10,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.1em',
                                            color: COLORS[item.category],
                                            fontFamily: 'var(--sans)',
                                            fontWeight: 500,
                                        }}
                                    >
                                        {item.category}
                                        {isLearn ? ' · Guide' : ''}
                                    </span>
                                    {item.verified && (
                                        <span
                                            style={{
                                                fontSize: 8.5,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 3,
                                                color: '#6AADCF',
                                            }}
                                        >
                                            <VerifiedBadge size={10} /> Verified
                                        </span>
                                    )}
                                </div>
                                <div
                                    style={{
                                        fontSize: 10.5,
                                        color: '#555',
                                        fontFamily: 'var(--sans)',
                                        marginTop: 1,
                                    }}
                                >
                                    {item.discipline} · {item.office}
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 5 }}>
                            <button
                                onClick={() => setBookmarked(!bookmarked)}
                                style={{
                                    background: '#1a1a1a',
                                    border: '1px solid #262626',
                                    borderRadius: 7,
                                    width: 32,
                                    height: 32,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                }}
                            >
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill={bookmarked ? '#D4845A' : 'none'}
                                    stroke={bookmarked ? '#D4845A' : '#666'}
                                    strokeWidth="2"
                                >
                                    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                                </svg>
                            </button>
                            <button
                                onClick={onClose}
                                style={{
                                    background: '#1a1a1a',
                                    border: '1px solid #262626',
                                    borderRadius: 7,
                                    width: 32,
                                    height: 32,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    color: '#666',
                                    fontSize: 16,
                                }}
                            >
                                ×
                            </button>
                        </div>
                    </div>

                    {/* Title & Description */}
                    <h2
                        style={{
                            fontSize: 24,
                            fontWeight: 400,
                            color: '#eee',
                            margin: '0 0 12px',
                            fontFamily: 'var(--serif)',
                            lineHeight: 1.2,
                        }}
                    >
                        {item.title}
                    </h2>
                    <p
                        style={{
                            fontSize: 13.5,
                            color: '#888',
                            lineHeight: 1.7,
                            margin: '0 0 20px',
                            fontFamily: 'var(--sans)',
                        }}
                    >
                        {item.description}
                    </p>

                    {/* Clickable author */}
                    <div
                        onClick={() => {
                            onAuthorClick(item.author);
                            onClose();
                        }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            background: '#161616',
                            borderRadius: 10,
                            padding: '12px 14px',
                            border: '1px solid #1e1e1e',
                            marginBottom: 16,
                            cursor: 'pointer',
                            transition: 'border-color 0.15s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#333')}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#1e1e1e')}
                    >
                        <div
                            style={{
                                width: 32,
                                height: 32,
                                borderRadius: '50%',
                                background: `${COLORS[item.category]}1a`,
                                color: COLORS[item.category],
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 12,
                                fontWeight: 600,
                                fontFamily: 'var(--sans)',
                            }}
                        >
                            {item.author
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div
                                style={{
                                    fontSize: 13,
                                    color: '#ccc',
                                    fontFamily: 'var(--sans)',
                                    fontWeight: 500,
                                }}
                            >
                                {item.author}
                            </div>
                            <div style={{ fontSize: 10.5, color: '#555', fontFamily: 'var(--sans)' }}>
                                {item.office} · {item.discipline}
                            </div>
                        </div>
                        <div
                            style={{
                                fontSize: 10.5,
                                color: '#666',
                                fontFamily: 'var(--sans)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                            }}
                        >
                            View all
                            <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#666"
                                strokeWidth="2"
                                strokeLinecap="round"
                            >
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </div>
                    </div>

                    {/* Stats */}
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: 1,
                            background: '#1e1e1e',
                            borderRadius: 10,
                            overflow: 'hidden',
                            marginBottom: 20,
                        }}
                    >
                        {[
                            { l: 'Rating', v: `${item.rating} / 5.0` },
                            { l: isLearn ? 'Views' : 'Uses', v: item.uses.toLocaleString() },
                        ].map((m) => (
                            <div key={m.l} style={{ background: '#151515', padding: '11px 13px' }}>
                                <div
                                    style={{
                                        fontSize: 9,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.1em',
                                        color: '#555',
                                        fontFamily: 'var(--sans)',
                                        marginBottom: 2,
                                    }}
                                >
                                    {m.l}
                                </div>
                                <div
                                    style={{
                                        fontSize: 13,
                                        color: '#aaa',
                                        fontFamily: 'var(--sans)',
                                        fontWeight: 500,
                                    }}
                                >
                                    {m.v}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 22 }}>
                        {item.tags.map((t) => (
                            <span
                                key={t}
                                style={{
                                    fontSize: 10.5,
                                    color: '#777',
                                    background: '#1a1a1a',
                                    padding: '3px 10px',
                                    borderRadius: 100,
                                    fontFamily: 'var(--mono)',
                                }}
                            >
                                {t}
                            </span>
                        ))}
                    </div>

                    {/* Pro Tips */}
                    <div style={{ marginBottom: 20 }}>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 7,
                                marginBottom: 10,
                            }}
                        >
                            <svg
                                width="13"
                                height="13"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#D4845A"
                                strokeWidth="2"
                                strokeLinecap="round"
                            >
                                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            <span
                                style={{
                                    fontSize: 10.5,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    color: '#888',
                                    fontFamily: 'var(--sans)',
                                    fontWeight: 600,
                                }}
                            >
                                Pro Tips ({tips.length})
                            </span>
                        </div>
                        {sorted.length > 0 ? (
                            sorted.map((t, i) => (
                                <div
                                    key={i}
                                    style={{
                                        display: 'flex',
                                        gap: 10,
                                        alignItems: 'flex-start',
                                        background: '#161616',
                                        borderRadius: 9,
                                        padding: '10px 13px',
                                        border: '1px solid #1e1e1e',
                                        marginBottom: 5,
                                    }}
                                >
                                    <button
                                        onClick={() => voteTip(tips.indexOf(t))}
                                        style={{
                                            background: '#1a1a1a',
                                            border: '1px solid #262626',
                                            borderRadius: 5,
                                            padding: '3px 6px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            minWidth: 28,
                                            flexShrink: 0,
                                        }}
                                    >
                                        <svg
                                            width="9"
                                            height="9"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="#D4845A"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                        >
                                            <polyline points="18 15 12 9 6 15" />
                                        </svg>
                                        <span
                                            style={{
                                                fontSize: 10,
                                                color: '#D4845A',
                                                fontFamily: 'var(--mono)',
                                            }}
                                        >
                                            {t.votes}
                                        </span>
                                    </button>
                                    <div>
                                        <p
                                            style={{
                                                fontSize: 12.5,
                                                color: '#999',
                                                lineHeight: 1.5,
                                                margin: 0,
                                                fontFamily: 'var(--sans)',
                                            }}
                                        >
                                            {t.text}
                                        </p>
                                        <div
                                            style={{
                                                fontSize: 10,
                                                color: '#555',
                                                marginTop: 4,
                                                fontFamily: 'var(--sans)',
                                            }}
                                        >
                                            — {t.author}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div
                                style={{
                                    fontSize: 12,
                                    color: '#444',
                                    fontStyle: 'italic',
                                    fontFamily: 'var(--sans)',
                                }}
                            >
                                No tips yet — be the first.
                            </div>
                        )}
                        <div style={{ display: 'flex', gap: 7, marginTop: 8 }}>
                            <input
                                value={newTip}
                                onChange={(e) => setNewTip(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addTip()}
                                placeholder="Share a quick tip..."
                                style={{
                                    flex: 1,
                                    background: '#131313',
                                    border: '1px solid #1e1e1e',
                                    borderRadius: 8,
                                    padding: '8px 12px',
                                    color: '#bbb',
                                    fontSize: 12,
                                    fontFamily: 'var(--sans)',
                                    outline: 'none',
                                }}
                            />
                            <button
                                onClick={addTip}
                                style={{
                                    padding: '8px 14px',
                                    borderRadius: 8,
                                    background: '#1e1e1e',
                                    border: '1px solid #262626',
                                    color: '#888',
                                    fontSize: 11.5,
                                    fontFamily: 'var(--sans)',
                                    cursor: 'pointer',
                                }}
                            >
                                Add
                            </button>
                        </div>
                    </div>

                    {/* Rating */}
                    <InteractiveRating onRate={setUserRating} userRating={userRating} />

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 7 }}>
                        <button
                            style={{
                                flex: 1,
                                padding: '10px 16px',
                                borderRadius: 9,
                                background: COLORS[item.category],
                                border: 'none',
                                color: '#111',
                                fontSize: 12,
                                fontWeight: 600,
                                fontFamily: 'var(--sans)',
                                cursor: 'pointer',
                            }}
                        >
                            {actionLabel}
                        </button>
                        <button
                            style={{
                                padding: '10px 16px',
                                borderRadius: 9,
                                background: 'transparent',
                                border: '1px solid #262626',
                                color: '#777',
                                fontSize: 12,
                                fontFamily: 'var(--sans)',
                                cursor: 'pointer',
                            }}
                        >
                            Share
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
