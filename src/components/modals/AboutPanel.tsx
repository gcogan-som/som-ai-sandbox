import React from 'react';
import { CATEGORIES, COLORS, CAT_INFO } from '../../data/categories';
import { CatIcon } from '../shared/CatIcon';
import type { CategoryName } from '../../types';

interface AboutPanelProps {
    onClose: () => void;
}

export const AboutPanel: React.FC<AboutPanelProps> = ({ onClose }) => {
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
                    maxWidth: 620,
                    width: '92%',
                    border: '1px solid #262626',
                    overflow: 'hidden',
                    animation: 'slideUp 0.3s ease',
                    maxHeight: '88vh',
                    overflowY: 'auto',
                }}
            >
                <div
                    style={{
                        height: 3,
                        background:
                            'linear-gradient(90deg,#D4845A,#6AADCF,#CBAA5E,#E07BA0,#B494D0,#8BC78A)',
                    }}
                />
                <div style={{ padding: '28px 32px 32px' }}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 20,
                        }}
                    >
                        <h2
                            style={{
                                fontSize: 24,
                                fontWeight: 400,
                                color: '#eee',
                                margin: 0,
                                fontFamily: 'var(--serif)',
                            }}
                        >
                            AI Library
                        </h2>
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
                    <p
                        style={{
                            fontSize: 13.5,
                            color: '#888',
                            lineHeight: 1.65,
                            margin: '0 0 24px',
                            fontFamily: 'var(--sans)',
                        }}
                    >
                        A shared collection of AI tools, prompts, and workflows created by people across every
                        office and discipline. Built by the firm, for the firm.
                    </p>
                    <h3
                        style={{
                            fontSize: 11,
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            color: '#666',
                            fontFamily: 'var(--sans)',
                            fontWeight: 500,
                            marginBottom: 14,
                        }}
                    >
                        Resource Types
                    </h3>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: 6,
                            marginBottom: 20,
                        }}
                    >
                        {(CATEGORIES.filter((c) => c !== 'All') as CategoryName[]).map((c) => (
                            <div
                                key={c}
                                style={{
                                    background: '#161616',
                                    borderRadius: 10,
                                    padding: '12px 14px',
                                    border: '1px solid #1e1e1e',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 7,
                                        marginBottom: 6,
                                    }}
                                >
                                    <CatIcon category={c} size={14} />
                                    <span
                                        style={{
                                            fontSize: 12,
                                            color: COLORS[c],
                                            fontFamily: 'var(--sans)',
                                            fontWeight: 500,
                                        }}
                                    >
                                        {c}
                                    </span>
                                </div>
                                <p
                                    style={{
                                        fontSize: 11,
                                        color: '#555',
                                        lineHeight: 1.5,
                                        margin: 0,
                                        fontFamily: 'var(--sans)',
                                    }}
                                >
                                    {CAT_INFO[c]?.slice(0, 100)}...
                                </p>
                            </div>
                        ))}
                    </div>
                    <h3
                        style={{
                            fontSize: 11,
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            color: '#666',
                            fontFamily: 'var(--sans)',
                            fontWeight: 500,
                            marginBottom: 8,
                        }}
                    >
                        Badges
                    </h3>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="#6AADCF"
                                stroke="none"
                            >
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span style={{ fontSize: 11, color: '#888', fontFamily: 'var(--sans)' }}>
                                Verified — reviewed by the AI Committee
                            </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
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
                                New
                            </span>
                            <span style={{ fontSize: 11, color: '#888', fontFamily: 'var(--sans)' }}>
                                Added within the last 7 days
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
