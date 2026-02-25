import React from 'react';
import type { CategoryName } from '../../types';
import { COLORS } from '../../data/categories';

interface CatIconProps {
    category: CategoryName;
    size?: number;
}

export const CatIcon: React.FC<CatIconProps> = ({ category, size = 16 }) => {
    const c = COLORS[category] || '#888';
    const p = {
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: c,
        strokeWidth: '1.5',
        strokeLinecap: 'round' as const,
        strokeLinejoin: 'round' as const,
    };

    const map: Record<string, React.ReactNode> = {
        Gems: (
            <svg {...p}>
                <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5" />
                <line x1="12" y1="22" x2="12" y2="15.5" />
                <line x1="22" y1="8.5" x2="12" y2="15.5" />
                <line x1="2" y1="8.5" x2="12" y2="15.5" />
            </svg>
        ),
        Prompts: (
            <svg {...p}>
                <polyline points="4 7 4 4 20 4 20 7" />
                <line x1="9" y1="20" x2="15" y2="20" />
                <line x1="12" y1="4" x2="12" y2="20" />
            </svg>
        ),
        'AI Studio': (
            <svg {...p}>
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M8 12h3l2-4 2 8 2-4h3" />
            </svg>
        ),
        Krea: (
            <svg {...p}>
                <rect x="2" y="2" width="20" height="20" rx="3" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
            </svg>
        ),
        Notebooks: (
            <svg {...p}>
                <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
                <line x1="8" y1="7" x2="16" y2="7" />
                <line x1="8" y1="11" x2="13" y2="11" />
            </svg>
        ),
        Workflows: (
            <svg {...p}>
                <circle cx="5" cy="6" r="2" />
                <line x1="7" y1="6" x2="17" y2="6" />
                <circle cx="19" cy="6" r="2" />
                <circle cx="12" cy="18" r="2" />
                <line x1="5" y1="8" x2="12" y2="16" />
                <line x1="19" y1="8" x2="12" y2="16" />
            </svg>
        ),
    };

    return <>{map[category] || null}</>;
};
