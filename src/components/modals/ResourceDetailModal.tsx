import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    IconButton,
    Chip,
    TextField,
    alpha
} from '@mui/material';
import {
    Bookmark,
    BookmarkBorder,
    ArrowUpward,
    LightbulbOutlined,
    ShareOutlined,
    Link,
    InsertDriveFileOutlined,
    EditOutlined,
    DeleteOutline
} from '@mui/icons-material';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { favoritesAtom } from '../../atoms/filterAtoms';
import { showSubmitAtom, editingItemAtom } from '../../atoms/modalAtoms';
import { StandardDialog, TintedSurface, StandardAvatar, InitialsAvatar } from '@som/ui';
import { useAuth } from '../../lib/auth/AuthContext';
import { db } from '../../lib/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { isDevModeAtom } from '../../atoms/appAtoms';
import type { ResourceItem, Tip } from '../../types';
import { COLORS } from '../../data/categories';
import { CatIcon } from '../shared/CatIcon';
import { InteractiveRating, StarsDisplay } from '../shared/StarRating';
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
    const [tips, setTips] = useState<Tip[]>(item.tips || []);
    const [favorites, setFavorites] = useAtom(favoritesAtom);
    const { user } = useAuth();
    const devMode = useAtomValue(isDevModeAtom);
    const isAuthor = user?.displayName === item.author;
    const bookmarked = favorites.includes(item.id as never);
    const isLearn = item.kind === 'learn';
    const setShowSubmit = useSetAtom(showSubmitAtom);
    const setEditingItem = useSetAtom(editingItemAtom);
    const accentColor = COLORS[item.category];

    const addTip = () => {
        if (!newTip.trim()) return;
        setTips([...tips, { author: user?.displayName || 'Anonymous', text: newTip.trim(), votes: 0 }]);
        setNewTip('');
    };

    const voteTip = (idx: number, delta: number) =>
        setTips(tips.map((t, j) => (j === idx ? { ...t, votes: t.votes + delta } : t)));

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

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this resource?')) return;
        if (!devMode) {
            try {
                await deleteDoc(doc(db, 'resources', item.id.toString()));
                onClose();
            } catch (error) {
                console.error("Error deleting resource:", error);
            }
        } else {
            console.log("Dev Mode: Resource deleted (simulated)");
            onClose();
        }
    };

    const handleEdit = () => {
        setEditingItem(item);
        setShowSubmit(true);
        onClose();
    };

    const renderAvatar = (name: string, color: string, size: number) => {
        if (user?.displayName === name && user?.photoURL) {
            return <StandardAvatar src={user.photoURL} sx={{ width: size, height: size }} />;
        }
        return <InitialsAvatar name={name} color={color} size={size} />;
    };

    return (
        <StandardDialog
            open={true}
            onClose={onClose}
            title={item.title}
            actions={
                <Box sx={{ display: 'flex', gap: 1, width: '100%', px: 1, pb: 1, alignItems: 'center' }}>
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{ bgcolor: accentColor, color: 'common.black', '&:hover': { bgcolor: alpha(accentColor, 0.9) } }}
                    >
                        {actionLabel}
                    </Button>
                    <IconButton
                        sx={{ color: 'text.secondary', border: '1px solid', borderColor: 'divider', borderRadius: '4px', p: 1 }}
                        title="Share"
                    >
                        <ShareOutlined sx={{ fontSize: 20 }} />
                    </IconButton>
                    {isAuthor && (
                        <>
                            <IconButton
                                onClick={handleEdit}
                                sx={{ color: 'text.secondary', border: '1px solid', borderColor: 'divider', borderRadius: '4px', p: 1 }}
                                title="Edit"
                            >
                                <EditOutlined sx={{ fontSize: 20 }} />
                            </IconButton>
                            <IconButton
                                color="error"
                                onClick={handleDelete}
                                sx={{ border: '1px solid', borderColor: alpha(accentColor, 0.1), borderRadius: '4px', p: 1 }}
                                title="Delete"
                            >
                                <DeleteOutline sx={{ fontSize: 20 }} />
                            </IconButton>
                        </>
                    )}
                </Box>
            }
        >
            <Box sx={{ borderTop: `3px solid ${accentColor}`, mt: -2.5, mx: -3, mb: 2.5 }} />

            {/* Header / Meta */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <TintedSurface
                        color={accentColor}
                        sx={{
                            width: 36,
                            height: 36,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <CatIcon category={item.category} size={18} />
                    </TintedSurface>
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="overline" sx={{ color: accentColor, fontWeight: 600 }}>
                                {item.category}{isLearn ? ' · Guide' : ''}
                            </Typography>
                            {item.verified && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <VerifiedBadge size={10} />
                                    <Typography variant="caption" color="text.secondary">Verified</Typography>
                                </Box>
                            )}
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                            {item.discipline} · {item.office}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* Description */}
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2.5, lineHeight: 1.7 }}>
                {item.description}
            </Typography>

            {/* Primary Link (if any) */}
            {item.primaryLink && (
                <Box sx={{ mb: 3 }}>
                    <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 1 }}>
                        Primary Asset
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1.5, bgcolor: 'action.hover', borderRadius: 1, border: `1px solid ${alpha(accentColor, 0.3)}` }}>
                        <Link sx={{ color: accentColor, fontSize: 20 }} />
                        <Typography
                            component="a"
                            href={item.primaryLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="body2"
                            sx={{
                                color: 'primary.main',
                                textDecoration: 'none',
                                fontWeight: 500,
                                '&:hover': { textDecoration: 'underline' }
                            }}
                        >
                            {item.primaryLink}
                        </Typography>
                    </Box>
                </Box>
            )}

            {/* Supporting Links & Files */}
            {(item.supportingLinks?.length || item.supportingFiles?.length) ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
                    <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: -0.5 }}>
                        Supporting Documentation
                    </Typography>
                    {item.supportingLinks?.map((link, i) => link && (
                        <Box key={`link-${i}`} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Link sx={{ color: 'text.disabled', fontSize: 18 }} />
                            <Typography
                                component="a"
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                variant="caption"
                                sx={{
                                    color: 'primary.main',
                                    textDecoration: 'none',
                                    '&:hover': { textDecoration: 'underline' }
                                }}
                            >
                                {link}
                            </Typography>
                        </Box>
                    ))}
                    {item.supportingFiles?.map((f, i) => (
                        <Box key={`doc-${i}`} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <InsertDriveFileOutlined sx={{ color: 'text.disabled', fontSize: 18 }} />
                            <Typography
                                component="a"
                                href={f.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                variant="caption"
                                sx={{
                                    color: 'primary.main',
                                    textDecoration: 'none',
                                    '&:hover': { textDecoration: 'underline' }
                                }}
                            >
                                {f.name}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            ) : null}

            {/* Tags */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 3 }}>
                {item.tags.map((t) => (
                    <Chip key={t} label={t} size="small" variant="outlined" />
                ))}
            </Box>

            {/* Footer */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    pt: 2,
                    mb: 3,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                }}
            >
                {/* Author & Location */}
                <Box
                    onClick={() => {
                        onAuthorClick(item.author);
                        onClose();
                    }}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.75,
                        cursor: 'pointer',
                        '&:hover': { opacity: 0.8 }
                    }}
                >
                    {renderAvatar(item.author, accentColor, 24)}
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {item.author}
                    </Typography>
                    <Typography variant="caption" color="text.disabled">·</Typography>
                    <Typography variant="caption" color="text.secondary">
                        {item.office}
                    </Typography>
                </Box>

                {/* Stats & Actions */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <StarsDisplay rating={item.rating} size={12} />
                    <Typography variant="caption" color="text.secondary">
                        {item.uses.toLocaleString()} {isLearn ? 'views' : 'uses'}
                    </Typography>
                    <Box
                        onClick={() => {
                            setFavorites((prev: (string | number)[]) =>
                                prev.includes(item.id) ? prev.filter(id => id !== item.id) : [...prev, item.id]
                            );
                        }}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: bookmarked ? 'primary.main' : 'text.disabled',
                            '&:hover': { color: 'primary.main' }
                        }}
                    >
                        {bookmarked ? <Bookmark sx={{ fontSize: 18 }} /> : <BookmarkBorder sx={{ fontSize: 18 }} />}
                    </Box>
                </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <LightbulbOutlined sx={{ fontSize: 18, color: accentColor }} />
                    <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600 }}>
                        Tips and Comments ({tips.length})
                    </Typography>
                </Box>

                {sorted.length > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                        {sorted.map((t, i) => (
                            <Box
                                key={i}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    bgcolor: 'action.hover',
                                    borderRadius: 0.5,
                                    px: 1.25,
                                    py: 0.75,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, flex: 1 }}>
                                    <Typography variant="body2" color="text.primary" sx={{ fontWeight: 400 }}>{t.text}</Typography>
                                    <Typography variant="caption" color="text.disabled" sx={{ fontSize: '10px' }}>— {t.author}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 1 }}>
                                    <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 700, color: t.votes > 0 ? accentColor : 'text.disabled' }}>
                                        {t.votes}
                                    </Typography>
                                    <IconButton
                                        onClick={() => voteTip(tips.indexOf(t), 1)}
                                        size="small"
                                        sx={{
                                            p: 0.25,
                                            color: 'text.disabled',
                                            '&:hover': { color: accentColor }
                                        }}
                                    >
                                        <ArrowUpward sx={{ fontSize: 12 }} />
                                    </IconButton>
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
