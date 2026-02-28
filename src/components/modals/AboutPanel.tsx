import React from 'react';
import { Box, Typography, Chip, Grid } from '@mui/material';
import { StandardDialog, StandardPaper, sectionLabelSx } from '@som/ui';
import { CATEGORIES, COLORS, CAT_INFO } from '../../data/categories';
import { CatIcon } from '../shared/CatIcon';
import type { CategoryName } from '../../types';

interface AboutPanelProps {
    open: boolean;
    onClose: () => void;
}

export const AboutPanel: React.FC<AboutPanelProps> = ({ open, onClose }) => {
    return (
        <StandardDialog
            open={open}
            onClose={onClose}
            title="About AI Library"
        >
            <Box
                sx={{
                    height: 3,
                    background: 'linear-gradient(90deg,#D4845A,#6AADCF,#CBAA5E,#E07BA0,#B494D0,#8BC78A)',
                    mt: -2.5,
                    mx: -3,
                    mb: 2.5
                }}
            />

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
                A shared collection of AI tools, prompts, and workflows created by people across every
                office and discipline. Built by the firm, for the firm.
            </Typography>

            <Typography variant="overline" color="text.disabled" sx={{ ...(sectionLabelSx as any), display: 'block', mb: 2 }}>
                Resource Types
            </Typography>

            <Grid container spacing={1} sx={{ mb: 3 }}>
                {(CATEGORIES.filter((c) => c !== 'All') as CategoryName[]).map((c) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={c}>
                        <StandardPaper
                            bordered
                            elevation={0}
                            sx={{
                                bgcolor: 'action.hover',
                                p: 1.5,
                                height: '100%'
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                <CatIcon category={c} size={14} />
                                <Typography variant="subtitle2" sx={{ color: COLORS[c] }}>
                                    {c}
                                </Typography>
                            </Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                {CAT_INFO[c]}
                            </Typography>
                        </StandardPaper>
                    </Grid>
                ))}
            </Grid>

            <Typography variant="overline" color="text.disabled" sx={{ ...(sectionLabelSx as any), display: 'block', mb: 1.5 }}>
                Badges
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box component="span" sx={{ color: 'info.main', fontSize: 16 }}>🛡️</Box>
                    <Typography variant="body2" color="text.secondary">
                        <Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>Verified</Box> — reviewed by the AI Committee for quality and safety.
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip label="New" size="small" variant="outlined" color="success" sx={{ fontWeight: 700 }} />
                    <Typography variant="body2" color="text.secondary">
                        Resources added within the last 7 days.
                    </Typography>
                </Box>
            </Box>
        </StandardDialog>
    );
};
