import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    alpha
} from '@mui/material';
import {
    ArrowUpward,
    ShareOutlined,
    ChevronRight,
    ContentCopy,
    EditOutlined,
    MoreHoriz,
    Star,
    StarOutline
} from '@mui/icons-material';
import { useSetAtom, useAtomValue } from 'jotai';
import { showSubmitAtom, editingItemAtom, selectedItemAtom } from '../../atoms/modalAtoms';
import { isDevModeAtom } from '../../atoms/appAtoms';
import { db } from '../../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import {
    StandardDialog,
    TintedSurface,
    StandardAvatar,
    InitialsAvatar,
    StandardChip,
    StandardButton,
    StandardIconButton
} from '@som/ui';
import { useAuth } from '../../lib/auth/AuthContext';
import type { ResourceItem, Tip } from '../../types';
import { COLORS } from '../../data/categories';
import { CatIcon } from '../shared/CatIcon';

interface ResourceDetailModalProps {
    item: ResourceItem;
    onClose: () => void;
    onAuthorClick: (author: string) => void;
}

const ADMIN_EMAILS = [
    'grant.cogan@som.com',
    'matt.turlock@som.com',
    'luke.downen@som.com',
    'grant.mattingly@som.com'
];

const toTitleCase = (str: string) => str.replace(/-/g, ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

const ADMIN_NAMES = [
    'Grant Cogan',
    'Matt Turlock',
    'Luke Downen',
    'Grant Mattingly'
];

// --- ADAPTIVE IMAGE COMPONENTS ---

const RenderImage: React.FC<{
    type: 'result' | 'original' | 'style';
    url?: string;
    aspect?: string;
    fill?: boolean;
    onClick?: () => void;
}> = ({ type, url, aspect = '16/9', fill = false, onClick }) => {
    const configs = {
        original: {
            gradient: 'linear-gradient(145deg, #D4C5B0 0%, #A89880 35%, #8B7D68 70%, #6E6352 100%)',
            label: 'SOURCE',
            icon: '◻',
        },
        result: {
            gradient: 'linear-gradient(145deg, #2C3E50 0%, #3D5A47 25%, #5A8A5E 50%, #8BAA7E 75%, #C4D4B8 100%)',
            label: 'AI RESULT',
            icon: '◆',
        },
        style: {
            gradient: 'linear-gradient(145deg, #E8D5B7 0%, #D4A87C 30%, #B07D52 60%, #8B5E3C 85%, #5C3D2E 100%)',
            label: 'STYLE REF',
            icon: '◇',
        },
    };
    const c = configs[type];

    return (
        <Box
            onClick={onClick}
            sx={{
                aspectRatio: fill ? undefined : aspect,
                height: fill ? '100%' : undefined,
                background: url ? `url(${url}) center/cover no-repeat` : c.gradient,
                borderRadius: '10px',
                position: 'relative',
                overflow: 'hidden',
                width: '100%',
                cursor: onClick ? 'pointer' : 'default',
                transition: 'transform 0.15s ease',
                border: '1px solid',
                borderColor: 'divider'
            }}
        >
            {/* Label */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    padding: '4px 10px',
                    background: alpha('#000', 0.5),
                    backdropFilter: 'blur(10px)',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    zIndex: 2
                }}
            >
                <Typography sx={{ fontSize: '9px', color: alpha('#fff', 0.6), lineHeight: 1 }}>{c.icon}</Typography>
                <Typography sx={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em', color: 'white', lineHeight: 1 }}>
                    {c.label}
                </Typography>
            </Box>

            {/* Atmosphere layer for empty states */}
            {!url && type === 'original' && (
                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: 'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)',
                        backgroundSize: '24px 24px',
                    }}
                />
            )}
        </Box>
    );
};

const UploadSlot: React.FC<{ type: 'original' | 'style' | 'result'; onAdd: () => void }> = ({ type, onAdd }) => {
    const labels = {
        original: { text: 'Source', hint: 'Add input screenshot' },
        style: { text: 'Style Reference', hint: 'Add style image' },
        result: { text: 'AI Result', hint: 'Run to generate' },
    };
    const l = labels[type];
    return (
        <Box
            component="button"
            onClick={onAdd}
            sx={{
                aspectRatio: '16/9',
                width: '100%',
                borderRadius: '10px',
                border: '2px dashed',
                borderColor: 'divider',
                background: alpha('#000', 0.02),
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                transition: 'all 0.15s',
                p: 2,
                outline: 'none',
                '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: alpha('#E8825A', 0.05),
                }
            }}
        >
            <Typography variant="h6" sx={{ color: 'text.disabled', mb: 0.5 }}>+</Typography>
            <Typography sx={{ fontSize: '11px', fontWeight: 700, color: 'text.secondary' }}>{l.text}</Typography>
            <Typography sx={{ fontSize: '10px', color: 'text.disabled' }}>{l.hint}</Typography>
        </Box>
    );
};

const AdaptiveImageZone: React.FC<{
    vizImages?: ResourceItem['vizImages'];
    onToggle?: (type: string) => void;
}> = ({ vizImages, onToggle }) => {
    const hasResult = !!vizImages?.result;
    const hasSource = !!vizImages?.original;
    const hasStyle = !!vizImages?.style;
    const imageCount = [hasResult, hasSource, hasStyle].filter(Boolean).length;

    // 0 Images
    if (imageCount === 0) {
        return (
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5 }}>
                <UploadSlot type="original" onAdd={() => onToggle?.('original')} />
                <UploadSlot type="result" onAdd={() => onToggle?.('result')} />
                <UploadSlot type="style" onAdd={() => onToggle?.('style')} />
            </Box>
        );
    }

    // 1 Image
    if (imageCount === 1) {
        const activeType = hasResult ? 'result' : hasSource ? 'original' : 'style';
        const missing = [];
        if (!hasResult) missing.push('result');
        if (!hasSource) missing.push('original');
        if (!hasStyle) missing.push('style');

        return (
            <Box>
                <RenderImage type={activeType} url={vizImages?.[activeType]} />
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    {missing.map(m => (
                        <Box
                            key={m}
                            component="button"
                            onClick={() => onToggle?.(m)}
                            sx={{
                                flex: 1,
                                py: 1,
                                borderRadius: 1.5,
                                border: '1.5px dashed',
                                borderColor: 'divider',
                                bgcolor: alpha('#000', 0.02),
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 1,
                                transition: 'all 0.15s',
                                '&:hover': { borderColor: 'primary.main', bgcolor: alpha('#E8825A', 0.05) }
                            }}
                        >
                            <Typography sx={{ fontSize: '12px', color: 'text.disabled' }}>+</Typography>
                            <Typography sx={{ fontSize: '10px', fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                {m === 'result' ? 'Result' : m === 'original' ? 'Source' : 'Style Ref'}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Box>
        );
    }

    // 2 Images
    if (imageCount === 2) {
        if (hasResult) {
            const companion = hasSource ? 'original' : 'style';
            const missing = !hasSource ? 'original' : 'style';
            return (
                <Box>
                    <RenderImage type="result" url={vizImages?.result} />
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mt: 1 }}>
                        <RenderImage type={companion} url={vizImages?.[companion]} />
                        <Box
                            component="button"
                            onClick={() => onToggle?.(missing)}
                            sx={{
                                aspectRatio: '16/9',
                                width: '100%',
                                borderRadius: '10px',
                                border: '1.5px dashed',
                                borderColor: 'divider',
                                bgcolor: alpha('#000', 0.02),
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 0.5,
                                transition: 'all 0.15s',
                                '&:hover': { borderColor: 'primary.main', bgcolor: alpha('#E8825A', 0.05) }
                            }}
                        >
                            <Typography sx={{ fontSize: '14px', color: 'text.disabled' }}>+</Typography>
                            <Typography sx={{ fontSize: '10px', fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                {missing === 'original' ? 'Source' : 'Style Ref'}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            );
        }
        // No result, just source and style
        return (
            <Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                    <RenderImage type="original" url={vizImages?.original} />
                    <RenderImage type="style" url={vizImages?.style} />
                </Box>
                <Box
                    component="button"
                    onClick={() => onToggle?.('result')}
                    sx={{
                        width: '100%',
                        mt: 1,
                        py: 1.5,
                        borderRadius: 2,
                        border: '1.5px dashed',
                        borderColor: 'divider',
                        bgcolor: alpha('#000', 0.02),
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                        transition: 'all 0.15s',
                        '&:hover': { borderColor: 'primary.main', bgcolor: alpha('#E8825A', 0.05) }
                    }}
                >
                    <Typography sx={{ fontSize: '12px', color: 'text.disabled' }}>◆</Typography>
                    <Typography sx={{ fontSize: '11px', fontWeight: 700, color: 'text.secondary' }}>
                        Run prompt to generate AI result
                    </Typography>
                </Box>
            </Box>
        );
    }

    // 3 Images (Triptych)
    return (
        <Box>
            <RenderImage type="result" url={vizImages?.result} />
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mt: 1 }}>
                <RenderImage type="original" url={vizImages?.original} />
                <RenderImage type="style" url={vizImages?.style} />
            </Box>
        </Box>
    );
};

// --- MAIN DIALOG COMPONENT ---

export const ResourceDetailModal: React.FC<ResourceDetailModalProps> = ({
    item,
    onClose,
    onAuthorClick,
}) => {
    const [userRating, setUserRating] = useState(0);
    const [newTip, setNewTip] = useState('');
    const [tips, setTips] = useState<Tip[]>(item.tips || []);
    const [carouselIndex, setCarouselIndex] = useState(0);
    const [activeTab, setActiveTab] = useState<'prompt' | 'result'>(item.category === 'Viz Prompts' ? 'prompt' : 'result');
    const { user } = useAuth();

    React.useEffect(() => {
        if (user && user.uid && item.userRatings && item.userRatings[user.uid]) {
            setUserRating(item.userRatings[user.uid]);
        } else {
            setUserRating(0);
        }
    }, [item.userRatings, user?.uid, item.id]);

    const isAdmin = user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase()) ||
        user?.displayName && ADMIN_NAMES.includes(user.displayName);
    const isAuthor = user?.displayName === item.author;
    const canEdit = isAuthor || isAdmin;

    const isLearn = item.kind === 'guide';
    const setShowSubmit = useSetAtom(showSubmitAtom);
    const setEditingItem = useSetAtom(editingItemAtom);
    const setSelectedItem = useSetAtom(selectedItemAtom);
    const devMode = useAtomValue(isDevModeAtom);
    const accentColor = COLORS[item.category];

    const addTip = () => {
        if (!newTip.trim()) return;
        setTips([...tips, { author: user?.displayName || 'Anonymous', text: newTip.trim(), votes: 0 }]);
        setNewTip('');
    };

    const voteTip = (idx: number, delta: number) =>
        setTips(tips.map((t, j) => (j === idx ? { ...t, votes: t.votes + delta } : t)));

    const sorted = [...tips].sort((a, b) => b.votes - a.votes);

    const availableImages: { label: string; url: string }[] = [];
    if (item.vizImages?.original) availableImages.push({ label: 'Original / Input', url: item.vizImages.original });
    if (item.vizImages?.style) availableImages.push({ label: 'Style Reference', url: item.vizImages.style });
    if (item.vizImages?.result) availableImages.push({ label: 'AI Result', url: item.vizImages.result });

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
                            : 'Open Link';

    const handleEdit = () => {
        setEditingItem(item);
        setShowSubmit(true);
        onClose();
    };

    const renderAvatar = (name: string, color: string, size: number) => {
        if (item.authorPhotoUrl) {
            return <StandardAvatar src={item.authorPhotoUrl} sx={{ width: size, height: size }} />;
        }
        if (user?.displayName === name && user?.photoURL) {
            return <StandardAvatar src={user.photoURL} sx={{ width: size, height: size }} />;
        }
        return <InitialsAvatar name={name} color={color} size={size} />;
    };

    const [copied, setCopied] = useState(false);

    const incrementUses = async () => {
        if (!devMode) {
            try {
                const docRef = doc(db, 'resources', String(item.id));
                const newUses = (item.uses || 0) + 1;
                await updateDoc(docRef, { uses: newUses });
                setSelectedItem({ ...item, uses: newUses });
            } catch (e) {
                console.error("Failed to update uses", e);
            }
        }
    };

    const handlePrimaryAction = () => {
        incrementUses();
        if (item.primaryLink) {
            window.open(item.primaryLink, '_blank', 'noopener,noreferrer');
        } else if (item.prompt) {
            navigator.clipboard.writeText(item.prompt);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleShare = () => {
        const url = `${window.location.origin}${window.location.pathname}#${item.id}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const actionActionButtonLabel = (() => {
        if (copied && !item.primaryLink) return 'Copied!';
        if (item.category === 'Idea') return null;
        if ((item.category === 'Viz Prompts' || item.category === 'Prompts') && !item.primaryLink) return 'Copy Prompt';
        return actionLabel;
    })();

    const isVizPrompt = item.category === 'Viz Prompts';

    return (
        <StandardDialog
            open={true}
            onClose={onClose}
            maxWidth="xl"
            fullWidth
            PaperProps={{
                sx: {
                    width: { xs: '98vw', sm: '90vw', md: '85vw' },
                    maxWidth: '1200px',
                    maxHeight: { xs: '95vh', md: '90vh' },
                    p: 0,
                    borderRadius: { xs: '12px', md: '16px' }
                }
            }}
            actions={
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    px: 3,
                    py: 2,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper'
                }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <StandardIconButton
                            onClick={handleShare}
                            sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}
                            icon={ShareOutlined}
                            label="Share resource"
                        />
                        {canEdit && (
                            <>
                                <StandardIconButton
                                    onClick={handleEdit}
                                    sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}
                                    icon={EditOutlined}
                                    label="Edit resource"
                                />
                                <StandardIconButton
                                    onClick={() => { }}
                                    sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}
                                    icon={MoreHoriz}
                                    label="More options"
                                />
                            </>
                        )}
                    </Box>

                    {item.category !== 'Idea' && item.category !== 'Viz Prompts' && (
                        <StandardButton
                            variant="primary"
                            onClick={handlePrimaryAction}
                            endIcon={item.primaryLink ? <ChevronRight /> : undefined}
                            sx={{
                                color: 'common.white',
                                bgcolor: alpha(accentColor, 0.8),
                                px: 4,
                                borderRadius: 1.5,
                                '&:hover': { bgcolor: accentColor }
                            }}
                        >
                            {actionActionButtonLabel}
                        </StandardButton>
                    )}
                </Box>
            }
        >
            <Box sx={{ p: 4, pt: 4 }}>
                {/* Header Row */}
                <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <TintedSurface color={accentColor} sx={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }}>
                            <CatIcon category={item.category} size={12} />
                        </TintedSurface>
                        <Typography variant="overline" sx={{ color: accentColor, fontWeight: 800, letterSpacing: '0.1em', fontSize: '10px' }}>
                            {item.category.toUpperCase()} {item.aiModel ? `· ${item.aiModel.toUpperCase()}` : ''}
                        </Typography>
                    </Box>

                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: '-0.01em' }}>
                        {item.title}
                    </Typography>

                    <Typography variant="body2" color="text.disabled" sx={{ fontWeight: 500, mb: 2 }}>
                        {item.discipline} · {item.office}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1 }}>
                        <Box
                            onClick={() => { onAuthorClick(item.author); onClose(); }}
                            sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
                        >
                            {renderAvatar(item.author, accentColor, 28)}
                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                {item.author}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: item.rating > 0 ? 'text.secondary' : 'text.disabled', fontSize: '13px' }}>
                                    {item.rating > 0 ? `★ ${item.rating.toFixed(1)}` : '★ Be first to rate'}
                                </Typography>
                            </Box>
                            <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'divider' }} />
                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.disabled', fontSize: '13px' }}>
                                {item.uses.toLocaleString()} uses
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ borderTop: '1px solid', borderColor: 'divider', my: 3 }} />

                {/* Content Zone */}
                <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary', lineHeight: 1.6 }}>
                    {item.description}
                </Typography>

                {/* --- IMAGE & PROMPT LAYOUT --- */}
                {isVizPrompt ? (
                    <Box sx={{ mb: 4 }}>
                        {/* Adaptive Triptych */}
                        <Box sx={{ mb: 2 }}>
                            <AdaptiveImageZone vizImages={item.vizImages} />
                        </Box>

                        {/* Prompt (Explicitly labeled for Viz Prompts) */}
                        <Box>
                            <Typography variant="overline" sx={{ fontWeight: 800, color: 'text.disabled', letterSpacing: '0.05em', mb: 1, display: 'block' }}>
                                Generation Prompt
                            </Typography>
                            <Box sx={{ position: 'relative', bgcolor: 'background.default', p: 2, borderRadius: 1.5, border: '1px solid', borderColor: 'divider' }}>
                                <Typography variant="body2" sx={{ pr: 6, fontFamily: 'monospace', fontSize: '13px', color: 'text.secondary', whiteSpace: 'pre-wrap' }}>
                                    {item.prompt || 'No prompt available.'}
                                </Typography>
                                <StandardButton
                                    size="legacy"
                                    startIcon={<ContentCopy sx={{ fontSize: 14 }} />}
                                    onClick={() => {
                                        navigator.clipboard.writeText(item.prompt || '');
                                        setCopied(true);
                                        setTimeout(() => setCopied(false), 2000);
                                    }}
                                    sx={{
                                        position: 'absolute',
                                        top: 12,
                                        right: 12,
                                        bgcolor: 'background.paper',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        color: 'text.secondary',
                                        '&:hover': { bgcolor: 'action.hover' }
                                    }}
                                >
                                    {copied ? 'Copied' : 'Copy'}
                                </StandardButton>
                            </Box>
                        </Box>
                    </Box>
                ) : (
                    /* Default Tabbed Layout for other categories */
                    <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', gap: 3, borderBottom: '1px solid', borderColor: 'divider', mb: 2 }}>
                            <Box
                                onClick={() => setActiveTab('prompt')}
                                sx={{
                                    pb: 1,
                                    cursor: 'pointer',
                                    borderBottom: '2px solid',
                                    borderColor: activeTab === 'prompt' ? accentColor : 'transparent',
                                    color: activeTab === 'prompt' ? 'text.primary' : 'text.disabled',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <Typography variant="overline" sx={{ fontWeight: 800, letterSpacing: '0.05em' }}>
                                    {toTitleCase(
                                        item.category === 'Workflows' ? 'Execution Details' :
                                            item.category === 'Idea' ? 'Problem & Solution' : 'Prompt / Setup'
                                    )}
                                </Typography>
                            </Box>
                            <Box
                                onClick={() => setActiveTab('result')}
                                sx={{
                                    pb: 1,
                                    cursor: 'pointer',
                                    borderBottom: '2px solid',
                                    borderColor: activeTab === 'result' ? accentColor : 'transparent',
                                    color: activeTab === 'result' ? 'text.primary' : 'text.disabled',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <Typography variant="overline" sx={{ fontWeight: 800, letterSpacing: '0.05em' }}>
                                    {toTitleCase(item.category === 'Idea' ? 'Visual References' : 'Outcome')}
                                </Typography>
                            </Box>
                        </Box>

                        {activeTab === 'prompt' ? (
                            <Box sx={{ position: 'relative', bgcolor: 'background.default', p: 2, borderRadius: 1.5, border: '1px solid', borderColor: 'divider' }}>
                                <Typography variant="body2" sx={{ pr: 6, fontFamily: 'monospace', fontSize: '13px', color: 'text.secondary', whiteSpace: 'pre-wrap' }}>
                                    {item.category === 'Idea' && item.problemStatement ? (
                                        <>
                                            <Box component="span" sx={{ display: 'block', fontWeight: 700, mb: 1, color: 'text.primary', letterSpacing: '0.05em' }}>PROBLEM STATEMENT</Box>
                                            {item.problemStatement}
                                            <Box component="span" sx={{ display: 'block', fontWeight: 700, mt: 3, mb: 1, color: 'text.primary', letterSpacing: '0.05em' }}>PROPOSED SOLUTION</Box>
                                            {item.proposedSolution || item.prompt || 'No solution details available yet.'}
                                        </>
                                    ) : (
                                        item.prompt || item.proposedSolution || 'No details available.'
                                    )}
                                </Typography>
                                {(item.prompt || item.proposedSolution) && (
                                    <StandardButton
                                        size="legacy"
                                        startIcon={<ContentCopy sx={{ fontSize: 14 }} />}
                                        onClick={() => {
                                            navigator.clipboard.writeText(item.prompt || item.proposedSolution || '');
                                            setCopied(true);
                                            setTimeout(() => setCopied(false), 2000);
                                        }}
                                        sx={{
                                            position: 'absolute',
                                            top: 12,
                                            right: 12,
                                            bgcolor: 'background.paper',
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            color: 'text.secondary',
                                            '&:hover': { bgcolor: 'action.hover' }
                                        }}
                                    >
                                        {copied ? 'Copied' : 'Copy'}
                                    </StandardButton>
                                )}
                            </Box>
                        ) : (
                            <Box sx={{ height: availableImages.length > 0 ? { xs: 300, md: 400 } : 80, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', borderRadius: 1.5, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
                                {availableImages.length > 0 ? (
                                    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                                        <Box component="img" src={availableImages[carouselIndex].url} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        {availableImages.length > 1 && (
                                            <Box sx={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 1 }}>
                                                {availableImages.map((_, i) => (
                                                    <Box key={i} onClick={() => setCarouselIndex(i)} sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: i === carouselIndex ? 'common.white' : alpha('#fff', 0.5), cursor: 'pointer' }} />
                                                ))}
                                            </Box>
                                        )}
                                    </Box>
                                ) : (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: 'action.hover', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <CatIcon category={item.category} size={16} />
                                        </Box>
                                        <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 600 }}>No outcome visualization</Typography>
                                    </Box>
                                )}
                            </Box>
                        )}
                    </Box>
                )}

                {/* Tags */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
                    {item.tags.map(t => (
                        <StandardChip
                            key={t}
                            label={t}
                            density="compact"
                            sx={{
                                borderRadius: '100px',
                                fontSize: '10px',
                                fontWeight: 700,
                                border: '1px solid',
                                borderColor: 'divider',
                                bgcolor: 'transparent',
                                color: 'text.secondary',
                                height: 20
                            }}
                        />
                    ))}
                </Box>

                <Box sx={{ borderTop: '1px solid', borderColor: 'divider', py: 4, mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Box>
                            <Typography variant="overline" sx={{ fontWeight: 800, color: 'text.disabled', letterSpacing: '0.05em' }}>
                                {userRating > 0 ? 'Your Rating' : 'Rate This Resource'}
                            </Typography>
                            {userRating > 0 && (
                                <Typography variant="caption" sx={{ display: 'block', color: accentColor, fontWeight: 700, mt: -0.5 }}>
                                    Rating recorded!
                                </Typography>
                            )}
                        </Box>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                            {[1, 2, 3, 4, 5].map((s) => (
                                <StandardIconButton
                                    key={s}
                                    icon={s <= userRating ? Star : StarOutline}
                                    label={`Rate ${s} stars`}
                                    onClick={async () => {
                                        if (!user) {
                                            alert("Please sign in to rate resources.");
                                            return;
                                        }

                                        const oldUserRating = userRating;
                                        setUserRating(s);

                                        if (!devMode) {
                                            try {
                                                const docRef = doc(db, 'resources', String(item.id));
                                                let count = item.ratingCount || 0;
                                                let currentAvg = item.rating || 0;
                                                let currentTotal = currentAvg * count;

                                                let userRatings = item.userRatings || {};
                                                const previousRating = userRatings[user.uid];

                                                if (previousRating !== undefined) {
                                                    currentTotal = currentTotal - previousRating + s;
                                                } else {
                                                    currentTotal += s;
                                                    count += 1;
                                                }

                                                const newRating = count > 0 ? (currentTotal / count) : 0;
                                                const updatedUserRatings = { ...userRatings, [user.uid]: s };

                                                await updateDoc(docRef, {
                                                    rating: newRating,
                                                    ratingCount: count,
                                                    userRatings: updatedUserRatings
                                                });
                                                setSelectedItem({
                                                    ...item,
                                                    rating: newRating,
                                                    ratingCount: count,
                                                    userRatings: updatedUserRatings
                                                });
                                            } catch (e) {
                                                console.error('Failed to update rating', e);
                                                setUserRating(oldUserRating);
                                            }
                                        }
                                    }}
                                    sx={{ color: s <= userRating ? accentColor : 'text.disabled' }}
                                />
                            ))}
                        </Box>
                    </Box>

                    <Box sx={{ mb: 4 }}>
                        <Typography variant="overline" sx={{ fontWeight: 800, color: 'text.disabled', letterSpacing: '0.05em', mb: 2, display: 'block' }}>
                            Tips & Comments ({tips.length})
                        </Typography>

                        {sorted.length > 0 ? (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
                                {sorted.map((t, i) => (
                                    <Box key={i} sx={{ p: 2, borderRadius: 1.5, border: '1px solid', borderColor: 'divider' }}>
                                        <Typography variant="body2" sx={{ lineHeight: 1.6, mb: 1.5, color: 'text.primary' }}>{t.text}</Typography>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <InitialsAvatar name={t.author} size={18} color={accentColor} />
                                                <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>{t.author}</Typography>
                                            </Box>
                                            <StandardIconButton
                                                onClick={() => voteTip(tips.indexOf(t), 1)}
                                                icon={ArrowUpward}
                                                label="Upvote tip"
                                                sx={{ color: 'text.disabled', '&:hover': { color: accentColor } }}
                                            />
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        ) : (
                            <Box sx={{ p: 2, border: '1px dashed', borderColor: 'divider', borderRadius: 1.5, textAlign: 'center', mb: 3 }}>
                                <Typography variant="body2" color="text.disabled" sx={{ fontWeight: 500 }}>
                                    No tips yet. Be the first to share one!
                                </Typography>
                            </Box>
                        )}

                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Share a tip or optimization..."
                                value={newTip}
                                onChange={(e) => setNewTip(e.target.value)}
                                sx={{ '& .MuiInputBase-root': { bgcolor: 'background.default', borderRadius: 1.5, fontSize: '13px' } }}
                            />
                            <StandardButton
                                onClick={addTip}
                                variant="secondary"
                                sx={{ px: 3, borderRadius: 1.5, boxShadow: 'none' }}
                            >
                                Post
                            </StandardButton>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </StandardDialog>
    );
};
