import React from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { Box, Typography, Stack, Divider, Tooltip } from '@mui/material';
import { HelpOutline } from '@mui/icons-material';
import { sectionLabelSx, StandardButton, StandardIconButton } from '@som/ui';
import { activeItemsAtom } from '../../atoms/appAtoms';
import { showAboutAtom, showSubmitAtom } from '../../atoms/modalAtoms';
import { useAuth } from '../../lib/auth/AuthContext';

export const HeroSection: React.FC = () => {
    const [, setShowAbout] = useAtom(showAboutAtom);
    const [, setShowSubmit] = useAtom(showSubmitAtom);
    const items = useAtomValue(activeItemsAtom);
    const { isAuthenticated } = useAuth();

    const stats = [
        { v: items.filter((i) => i.kind === 'tool').length, l: 'Tools' },
        { v: items.filter((i) => i.kind === 'example').length, l: 'Examples' },
        { v: items.filter((i) => i.kind === 'guide').length, l: 'Guides' },
        { v: items.filter((i) => i.kind === 'workflow').length, l: 'Workflows' },
        { v: items.filter((i) => i.kind === 'idea').length, l: 'Ideas' },
        { v: new Set(items.map((i) => i.author)).size, l: 'Contributors' },
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
                            <Box>
                                <StandardIconButton
                                    icon={HelpOutline}
                                    label="What is the AI Sandbox?"
                                    onClick={() => setShowAbout(true)}
                                    variant="default"
                                />
                            </Box>
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

            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
                spacing={{ xs: 3, sm: 4 }}
                flexWrap="wrap"
            >
                {/* Stats Row */}
                <Stack
                    direction="row"
                    spacing={{ xs: 2.5, sm: 3.75 }}
                    sx={{
                        flexWrap: 'wrap',
                        rowGap: 1.5,
                        width: { xs: '100%', sm: 'auto' }
                    }}
                >
                    {stats.map((s) => (
                        <Box key={s.l} sx={{ minWidth: { xs: 'calc(50% - 20px)', sm: 'auto' } }}>
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

                <Divider
                    orientation="vertical"
                    flexItem
                    sx={{
                        height: 32,
                        alignSelf: 'center',
                        bgcolor: 'divider',
                        display: { xs: 'none', sm: 'block' }
                    }}
                />

                {/* Actions Row */}
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={1.5}
                    alignItems="center"
                    sx={{ width: { xs: '100%', sm: 'auto' } }}
                >
                    <StandardButton
                        size="legacy"
                        variant="primary"
                        onClick={() => setShowSubmit(true)}
                        disabled={!isAuthenticated}
                        sx={{ height: 32, width: { xs: '100%', sm: 'auto' } }}
                    >
                        Contribute Resource
                    </StandardButton>
                </Stack>
            </Stack>
        </Box>
    );
};
