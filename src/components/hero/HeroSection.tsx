import React from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { Box, Typography, Button, Stack, Divider, Tooltip, IconButton, alpha, useTheme } from '@mui/material';
import { HelpOutline } from '@mui/icons-material';
import { sectionLabelSx } from '@som/ui';
import { activeItemsAtom } from '../../atoms/appAtoms';
import { showAboutAtom, showSubmitAtom, showReqAtom } from '../../atoms/modalAtoms';
import { useAuth } from '../../lib/auth/AuthContext';

export const HeroSection: React.FC = () => {
    const theme = useTheme();
    const [, setShowAbout] = useAtom(showAboutAtom);
    const [, setShowSubmit] = useAtom(showSubmitAtom);
    const [, setShowReq] = useAtom(showReqAtom);
    const items = useAtomValue(activeItemsAtom);
    const { isAuthenticated } = useAuth();

    const stats = [
        { v: items.filter((i) => i.kind === 'use').length, l: 'Resources' },
        { v: items.filter((i) => i.kind === 'learn').length, l: 'Guides' },
        { v: new Set(items.map((i) => i.author)).size, l: 'Contributors' },
        { v: new Set(items.map((i) => i.office).filter((o) => o !== 'Firmwide')).size, l: 'Offices' },
    ];

    return (
        <Box component="section" sx={{ pt: 5.75, pb: 4, animation: 'slideDown 0.5s ease' }}>
            <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={4}>
                <Box>
                    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
                        <Typography
                            variant="h1"
                            sx={{
                                fontSize: { xs: 32, md: 44 },
                                fontWeight: 300,
                                lineHeight: 1.08,
                                letterSpacing: '-0.03em',
                                color: 'text.primary',
                            }}
                        >
                            AI Sandbox
                        </Typography>
                        <Tooltip title="What is the AI Sandbox?">
                            <IconButton
                                size="small"
                                onClick={() => setShowAbout(true)}
                                sx={{ color: 'text.disabled', '&:hover': { color: 'text.primary' } }}
                            >
                                <HelpOutline sx={{ fontSize: 20 }} />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                    <Typography
                        variant="subtitle1"
                        color="text.secondary"
                        sx={{ maxWidth: 460, lineHeight: 1.6, mb: 3 }}
                    >
                        A playground to share how SOM is using ai, driving the car as we're building it.
                    </Typography>
                </Box>
            </Stack>

            <Stack direction="row" alignItems="flex-end" spacing={4} flexWrap="wrap">
                {/* Stats Row */}
                <Stack direction="row" spacing={3.75}>
                    {stats.map((s) => (
                        <Box key={s.l}>
                            <Typography variant="h2" sx={{ fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1 }}>
                                {s.v}
                            </Typography>
                            <Typography
                                variant="overline"
                                color="text.disabled"
                                sx={[
                                    ...(Array.isArray(sectionLabelSx) ? sectionLabelSx : [sectionLabelSx]),
                                    { display: 'block', mt: 0.5 }
                                ]}
                            >
                                {s.l}
                            </Typography>
                        </Box>
                    ))}
                </Stack>

                <Divider orientation="vertical" flexItem sx={{ height: 32, alignSelf: 'center', bgcolor: 'divider', display: { xs: 'none', md: 'block' } }} />

                {/* Actions Row */}
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <Button
                        size="small"
                        variant="contained"
                        onClick={() => setShowSubmit(true)}
                        disabled={!isAuthenticated}
                        sx={{
                            height: 32,
                            px: 2,
                            fontSize: '11px',
                            fontWeight: 700,
                            bgcolor: 'text.primary',
                            color: 'background.paper',
                            '&:hover': { bgcolor: alpha(theme.palette.text.primary, 0.8) }
                        }}
                    >
                        Contribute Resource
                    </Button>
                    <Button
                        size="small"
                        variant="outlined"
                        onClick={() => setShowReq(true)}
                        sx={{
                            height: 32,
                            px: 2,
                            fontSize: '11px',
                            fontWeight: 700,
                            borderColor: 'divider',
                            color: 'text.primary',
                            '&:hover': { borderColor: 'text.primary', bgcolor: 'action.hover' }
                        }}
                    >
                        Request Tool
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
};
