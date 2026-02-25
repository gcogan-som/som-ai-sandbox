import { useState, useEffect } from 'react';

const HINTS = [
    'Search resources, people, offices...',
    'Try "zoning Chicago" or "Sarah Chen"',
    'Search by tag, discipline, or tool...',
    'Try "facade London" or "Krea boards"',
];

export function useRotatingHint() {
    const [i, setI] = useState(0);
    useEffect(() => {
        const t = setInterval(() => setI((p) => (p + 1) % HINTS.length), 4000);
        return () => clearInterval(t);
    }, []);
    return HINTS[i];
}
