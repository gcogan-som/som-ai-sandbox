import React, { useRef, useEffect, useMemo } from 'react';
import { useAtom } from 'jotai';
import { Box, Typography, Chip, Button, Paper } from '@mui/material';
import { sectionLabelSx } from '@som/ui';
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

    const renderSection = ({
        title,
        data,
        filterKey,
    }: {
        title: string;
        data: [string, number][];
        filterKey: keyof FacetFilters;
    }) => (
        <Box sx={{ mb: 1.5 }}>
            <Typography variant="overline" color="text.disabled" sx={{ ...(sectionLabelSx as any), display: 'block', mb: 0.75 }}>
                {title}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {data.map(([v, c]) => {
                    const active = filters[filterKey].includes(v);
                    return (
                        <Chip
                            key={v}
                            label={`${v} (${c})`}
                            onClick={() => toggle(filterKey, v)}
                            size="small"
                            variant={active ? 'filled' : 'outlined'}
                            sx={{ cursor: 'pointer', fontSize: '10px' }}
                        />
                    );
                })}
            </Box>
        </Box>
    );

    return (
        <Paper
            ref={ref}
            elevation={0}
            sx={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                mt: 0.75,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                p: 2.25,
                zIndex: 50,
                animation: 'fadeUp 0.2s ease',
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.75 }}>
                <Typography variant="h5">Filters</Typography>
                {ct > 0 && (
                    <Button
                        size="small"
                        variant="text"
                        onClick={() => setFilters({ tags: [], offices: [], disciplines: [], authors: [] })}
                        sx={{ fontSize: '10px', color: 'text.secondary' }}
                    >
                        Clear all ({ct})
                    </Button>
                )}
            </Box>
            {renderSection({
                title: "Discipline",
                data: allDisc.map((d) => [d, items.filter((i) => i.discipline === d).length]),
                filterKey: "disciplines"
            })}
            {renderSection({
                title: "Office",
                data: allOffice.map((o) => [o, items.filter((i) => i.office === o).length]),
                filterKey: "offices"
            })}
            {renderSection({
                title: "Author",
                data: allAuthors.map((a) => [a, items.filter((i) => i.author === a).length]),
                filterKey: "authors"
            })}
            {renderSection({
                title: "Tags",
                data: allTags.map((t) => [t, items.filter((i) => i.tags.includes(t)).length]),
                filterKey: "tags"
            })}
        </Paper>
    );
};
