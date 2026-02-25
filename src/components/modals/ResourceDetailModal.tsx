import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    IconButton,
    Grid,
    Chip,
    Divider,
    TextField,
    alpha,
    Paper
} from '@mui/material';
import {
    Bookmark,
    BookmarkBorder,
    ChevronRight,
    ArrowUpward,
    LightbulbOutlined,
    ShareOutlined
} from '@mui/icons-material';
import { StandardDialog } from '@som/ui';
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
    const accentColor = COLORS[item.category];

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
        <StandardDialog
            open={true}
            onClose={onClose}
            title={item.title}
            actions={
                <Box sx={{ display: 'flex', gap: 1, width: '100%', px: 1, pb: 1 }}>
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{ bgcolor: accentColor, color: 'common.black', '&:hover': { bgcolor: alpha(accentColor, 0.9) } }}
                    >
                        {actionLabel}
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<ShareOutlined />}
                        sx={{ color: 'text.secondary', borderColor: 'divider' }}
                    >
                        Share
                    </Button>
                </Box>
            }
        >
            <Box sx={{ borderTop: `3px solid ${accentColor}`, mt: -2.5, mx: -3, mb: 2.5 }} />

            {/* Header / Meta */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                        sx={{
                            width: 36,
                            height: 36,
                            borderRadius: '8px',
                            bgcolor: alpha(accentColor, 0.1),
                            border: '1px solid',
                            borderColor: alpha(accentColor, 0.2),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <CatIcon category={item.category} size={18} />
                    </Box>
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="overline" sx={{ color: accentColor, fontWeight: 600 }}>
                                {item.category}{isLearn ? ' · Guide' : ''}
                            </Typography>
                            {item.verified && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <VerifiedBadge size={10} />
                                    <Typography variant="caption" color="info.main">Verified</Typography>
                                </Box>
                            )}
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                            {item.discipline} · {item.office}
                        </Typography>
                    </Box>
                </Box>
                <IconButton onClick={() => setBookmarked(!bookmarked)} size="small" sx={{ border: '1px solid', borderColor: 'divider' }}>
                    {bookmarked ? <Bookmark sx={{ color: 'primary.main', fontSize: 18 }} /> : <BookmarkBorder sx={{ fontSize: 18 }} />}
                </IconButton>
            </Box>

            {/* Description */}
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2.5, lineHeight: 1.7 }}>
                {item.description}
            </Typography>

            {/* Author Section */}
            <Paper
                onClick={() => {
                    onAuthorClick(item.author);
                    onClose();
                }}
                elevation={0}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    bgcolor: 'action.hover',
                    borderRadius: 1,
                    p: 1.5,
                    border: '1px solid',
                    borderColor: 'divider',
                    mb: 2,
                    cursor: 'pointer',
                    '&:hover': { borderColor: 'text.disabled' }
                }}
            >
                <Box
                    sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        bgcolor: alpha(accentColor, 0.15),
                        color: accentColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 700,
                    }}
                >
                    {item.author.split(' ').map((n) => n[0]).join('')}
                </Box>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" sx={{ lineHeight: 1 }}>{item.author}</Typography>
                    <Typography variant="caption" color="text.disabled">{item.office} · {item.discipline}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.disabled' }}>
                    <Typography variant="caption">View all</Typography>
                    <ChevronRight sx={{ fontSize: 14 }} />
                </Box>
            </Paper>

            {/* Quick Stats */}
            <Grid container spacing={0.5} sx={{ mb: 2.5 }}>
                {[
                    { l: 'Rating', v: `${item.rating} / 5.0` },
                    { l: isLearn ? 'Views' : 'Uses', v: item.uses.toLocaleString() },
                ].map((m) => (
                    <Grid size={6} key={m.l}>
                        <Box sx={{ bgcolor: 'background.default', p: 1.25, borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                            <Typography variant="overline" color="text.disabled" sx={{ display: 'block', lineHeight: 1, mb: 0.5 }}>{m.l}</Typography>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{m.v}</Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>

            {/* Tags */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 3 }}>
                {item.tags.map((t) => (
                    <Chip key={t} label={t} size="small" variant="outlined" sx={{ fontFamily: 'monospace', fontSize: '10px' }} />
                ))}
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Tips Section */}
            <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <LightbulbOutlined sx={{ fontSize: 18, color: accentColor }} />
                    <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600 }}>
                        Pro Tips ({tips.length})
                    </Typography>
                </Box>

                {sorted.length > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {sorted.map((t, i) => (
                            <Box
                                key={i}
                                sx={{
                                    display: 'flex',
                                    gap: 1.5,
                                    alignItems: 'flex-start',
                                    bgcolor: 'action.hover',
                                    borderRadius: 1,
                                    p: 1.25,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                }}
                            >
                                <Button
                                    onClick={() => voteTip(tips.indexOf(t))}
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                        minWidth: 32,
                                        p: 0.5,
                                        flexDirection: 'column',
                                        gap: 0.25,
                                        borderColor: alpha(accentColor, 0.2),
                                        color: accentColor,
                                    }}
                                >
                                    <ArrowUpward sx={{ fontSize: 12 }} />
                                    <Typography variant="caption" sx={{ fontFamily: 'monospace', lineHeight: 1 }}>{t.votes}</Typography>
                                </Button>
                                <Box>
                                    <Typography variant="body2" color="text.primary" sx={{ mb: 0.5 }}>{t.text}</Typography>
                                    <Typography variant="caption" color="text.disabled">— {t.author}</Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                ) : (
                    <Typography variant="body2" color="text.disabled" sx={{ fontStyle: 'italic' }}>
                        No tips yet — be the first.
                    </Typography>
                )}

                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Share a quick tip..."
                        value={newTip}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTip(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addTip()}
                        sx={{ '& .MuiInputBase-root': { fontSize: '12px' } }}
                    />
                    <Button variant="outlined" onClick={addTip} size="small" sx={{ borderColor: 'divider' }}>
                        Add
                    </Button>
                </Box>
            </Box>

            <InteractiveRating onRate={setUserRating} userRating={userRating} />
        </StandardDialog>
    );
};
