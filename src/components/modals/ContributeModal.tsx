import React, { useState, useRef } from 'react';
import {
    Box,
    Typography,
    TextField,
    CircularProgress,
    IconButton,
    Tooltip,
    ButtonBase,
} from '@mui/material';
import { Close, Construction, Description, Visibility, AccountTree, Lightbulb, UploadFile, Delete } from '@mui/icons-material';
import { StandardDialog, FormField, StandardSelect, StandardButton, StandardIconButton } from '@som/ui';
import { collection, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAtomValue, useAtom } from 'jotai';
import { db, storage } from '../../lib/firebase';
import { isDevModeAtom } from '../../atoms/appAtoms';
import { editingItemAtom } from '../../atoms/modalAtoms';
import { useAuth } from '../../lib/auth/AuthContext';
import { CATEGORIES, CAT_SHORT_INFO } from '../../data/categories';
import { DISCIPLINES } from '../../data/disciplines';
import { OFFICES } from '../../data/offices';
import { TagInput } from '../shared/TagInput';
import type { CategoryName } from '../../types';
import imageCompression from 'browser-image-compression';

const AI_MODELS = [
    'Nano Banana',
    'Midjourney',
    'Stable Diffusion',
    'ChatGPT',
    'Claude',
    'Gemini',
    'Runway',
    'Pika',
    'Other'
];

interface UploadZoneProps {
    label: string;
    url: string;
    onUpload: (url: string) => void;
    onClear: () => void;
    uploading: boolean;
    setUploading: (val: boolean) => void;
}

const UploadZone: React.FC<UploadZoneProps> = ({ label, url, onUpload, onClear, uploading, setUploading }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        setUploading(true);

        try {
            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 2048,
                useWebWorker: true,
                initialQuality: 0.8
            };
            const compressedFile = await imageCompression(file, options);
            const storageRef = ref(storage, `resources/${Date.now()}_${compressedFile.name}`);
            await uploadBytes(storageRef, compressedFile);
            const downloadUrl = await getDownloadURL(storageRef);
            onUpload(downloadUrl);
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                {label}
            </Typography>
            {url ? (
                <Box sx={{ position: 'relative', width: '100%', height: 120, borderRadius: 1, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
                    <img src={url} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <IconButton
                        size="small"
                        onClick={onClear}
                        sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'background.paper', '&:hover': { bgcolor: 'error.lighter' } }}
                    >
                        <Delete fontSize="small" color="error" />
                    </IconButton>
                </Box>
            ) : (
                <ButtonBase
                    onClick={() => fileInputRef.current?.click()}
                    sx={{
                        width: '100%',
                        height: 120,
                        border: '1px dashed',
                        borderColor: 'divider',
                        borderRadius: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                        bgcolor: 'background.default',
                        '&:hover': { bgcolor: 'action.hover' }
                    }}
                >
                    {uploading ? (
                        <CircularProgress size={24} />
                    ) : (
                        <>
                            <UploadFile color="action" />
                            <Typography variant="body2" color="text.secondary">
                                Click to upload
                            </Typography>
                        </>
                    )}
                </ButtonBase>
            )}
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
        </Box>
    );
};

interface ContributeModalProps {
    open: boolean;
    onClose: () => void;
}



export const ContributeModal: React.FC<ContributeModalProps> = ({ open, onClose }) => {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        kind: 'tool' as 'tool' | 'example' | 'guide' | 'workflow' | 'idea',
        name: '',
        desc: '',
        type: 'Gems',
        discipline: 'General',
        office: 'New York',
        link: '',
        prompt: '',
        aiModel: AI_MODELS[0],
        problemStatement: '',
        proposedSolution: '',
    });
    const [vizImages, setVizImages] = useState({ result: '', original: '', style: '' });
    const [uploadingImages, setUploadingImages] = useState({ result: false, original: false, style: false });

    const [tags, setTags] = useState<string[]>([]);
    const [extraLinks, setExtraLinks] = useState<string[]>(['']);
    const [submitting, setSubmitting] = useState(false);
    const [editingItem, setEditingItem] = useAtom(editingItemAtom);
    const devMode = useAtomValue(isDevModeAtom);
    const { user } = useAuth();

    React.useEffect(() => {
        if (editingItem && open) {
            setForm({
                kind: (editingItem.kind as any) || 'tool',
                name: editingItem.title,
                desc: editingItem.description,
                type: editingItem.category,
                discipline: editingItem.discipline,
                office: editingItem.office || 'New York',
                link: editingItem.primaryLink || '',
                prompt: editingItem.prompt || '',
                aiModel: editingItem.aiModel || AI_MODELS[0],
                problemStatement: editingItem.problemStatement || '',
                proposedSolution: editingItem.proposedSolution || '',
            });
            setVizImages({
                result: editingItem.vizImages?.result || '',
                original: editingItem.vizImages?.original || '',
                style: editingItem.vizImages?.style || '',
            });
            setTags(editingItem.tags);
            setExtraLinks(editingItem.supportingLinks?.length ? [...editingItem.supportingLinks, ''] : ['']);
        } else if (open) {
            setForm({
                kind: 'tool',
                name: '',
                desc: '',
                type: 'Gems',
                discipline: 'General',
                office: 'New York',
                link: '',
                prompt: '',
                aiModel: AI_MODELS[0],
                problemStatement: '',
                proposedSolution: '',
            });
            setVizImages({ result: '', original: '', style: '' });
            setTags([]);
            setExtraLinks(['']);
            setStep(1);
        }
    }, [editingItem, open]);

    const handleClose = () => {
        setEditingItem(null);
        onClose();
        setStep(1);
    };

    const upd = (k: string, v: string) => {
        const updates: any = { [k]: v };
        if (k === 'kind' && v === 'idea') updates.type = 'Idea';
        if (k === 'type' && v === 'Idea') updates.kind = 'idea';
        if (k === 'kind' && v !== 'idea' && form.type === 'Idea') updates.type = 'Gems';
        setForm({ ...form, ...updates });
    };

    const handleSubmit = async () => {
        if (!form.name || (!form.link && form.kind !== 'idea' && form.type !== 'Viz Prompts')) {
            alert("Please provide at least a name and a primary link.");
            return;
        }

        setSubmitting(true);
        console.log("Submitting contribution for user:", user?.displayName);

        try {
            const resourceData: any = {
                kind: form.kind,
                title: form.name,
                description: form.desc,
                category: form.type as CategoryName,
                discipline: form.discipline,
                office: form.office,
                author: editingItem ? editingItem.author : (user?.displayName || 'Anonymous'),
                authorPhotoUrl: editingItem ? (editingItem.authorPhotoUrl || '') : (user?.photoURL || ''),
                date: editingItem ? editingItem.date : new Date().toISOString().split('T')[0],
                rating: editingItem ? editingItem.rating : 0,
                uses: editingItem ? editingItem.uses : 0,
                tags: tags,
                featured: editingItem ? editingItem.featured : false,
                verified: editingItem ? editingItem.verified : false,
                tips: editingItem ? editingItem.tips : [],
                primaryLink: form.link,
                prompt: form.prompt,
                aiModel: form.aiModel,
                vizImages: vizImages,
                problemStatement: form.problemStatement,
                proposedSolution: form.proposedSolution,
                supportingLinks: extraLinks.filter(l => l.trim() !== ''),
                supportingFiles: editingItem?.supportingFiles || [],
                updatedAt: serverTimestamp()
            };

            if (!editingItem) {
                resourceData.createdAt = serverTimestamp();
            }

            if (!devMode) {
                try {
                    if (editingItem) {
                        const docRef = doc(db, 'resources', editingItem.id.toString());
                        updateDoc(docRef, resourceData).catch(e => console.warn("Background sync warning:", e));
                    } else {
                        addDoc(collection(db, 'resources'), resourceData).catch(e => console.warn("Background sync warning:", e));
                    }
                } catch (e) {
                    console.error("Immediate write error:", e);
                }
            } else {
                console.log("Dev Mode: Simulated persistence", resourceData);
            }

            setSubmitting(false);
            handleClose();
            setTimeout(() => {
                alert(editingItem ? "Successfully updated!" : "Successfully saved to Sandbox!");
            }, 100);

        } catch (error: any) {
            console.error("Critical submission error:", error);
            setSubmitting(false);
            alert(`Submission failed: ${error.message || 'Unknown error'}`);
        }
    };

    const handleLinkChange = (idx: number, val: string) => {
        const newLinks = [...extraLinks];
        newLinks[idx] = val;
        setExtraLinks(newLinks);
        if (idx === extraLinks.length - 1 && val) setExtraLinks([...newLinks, '']);
    };

    const removeLink = (idx: number) => {
        setExtraLinks(extraLinks.filter((_, i) => i !== idx));
    };

    return (
        <StandardDialog
            open={open}
            onClose={() => !submitting && handleClose()}
            title={editingItem ? 'Editing Resource' : (step === 1 ? 'Contribute' : 'Almost There')}
            maxWidth="xl"
            sx={{
                '& .MuiDialog-paper': {
                    width: { xs: '95vw', sm: '85vw', md: '75vw' },
                    maxWidth: '1200px !important'
                }
            }}
            actions={
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', px: 1, pb: 1 }}>
                    {step === 1 ? (
                        <>
                            <Box />
                            <StandardButton variant="primary" onClick={() => setStep(2)} disabled={!form.name.trim()}>
                                Next
                            </StandardButton>
                        </>
                    ) : (
                        <>
                            <StandardButton variant="secondary" onClick={() => setStep(1)} sx={{ height: 36.5 }} disabled={submitting}>
                                Back
                            </StandardButton>
                            <StandardButton variant="primary" onClick={handleSubmit} disabled={submitting || !form.name.trim() || (!form.link.trim() && form.kind !== 'idea' && form.type !== 'Viz Prompts')}>
                                {submitting
                                    ? (editingItem ? 'Updating...' : 'Submitting...')
                                    : (editingItem ? 'Update' : 'Submit')}
                            </StandardButton>
                        </>
                    )}
                </Box>
            }
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

            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                {[1, 2].map((s) => (
                    <Box
                        key={s}
                        sx={{
                            height: 2,
                            flex: 1,
                            borderRadius: 1,
                            bgcolor: step >= s ? 'primary.main' : 'divider',
                            transition: 'background 0.3s',
                        }}
                    />
                ))}
            </Box>

            {step === 1 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        {[
                            { id: 'tool', icon: <Construction sx={{ fontSize: 28 }} />, label: 'Submit a Tool' },
                            { id: 'example', icon: <Visibility sx={{ fontSize: 28 }} />, label: 'Submit an Example' },
                            { id: 'guide', icon: <Description sx={{ fontSize: 28 }} />, label: 'Submit a Guide' },
                            { id: 'workflow', icon: <AccountTree sx={{ fontSize: 28 }} />, label: 'Submit a Workflow' },
                            { id: 'idea', icon: <Lightbulb sx={{ fontSize: 28 }} />, label: 'Submit an Idea' }
                        ].map((opt) => {
                            const selected = form.kind === opt.id;
                            return (
                                <Tooltip title={opt.label} key={opt.id}>
                                    <Box
                                        onClick={() => upd('kind', opt.id)}
                                        sx={{
                                            flex: 1,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            p: 2,
                                            gap: 1,
                                            borderRadius: 1,
                                            cursor: 'pointer',
                                            border: '1px solid',
                                            borderColor: selected ? 'primary.main' : 'divider',
                                            bgcolor: selected ? 'action.selected' : 'background.paper',
                                            '&:hover': {
                                                bgcolor: selected ? 'action.selected' : 'action.hover',
                                            }
                                        }}
                                    >
                                        <Box sx={{ color: selected ? 'primary.main' : 'text.disabled' }}>
                                            {opt.icon}
                                        </Box>
                                        <Typography variant="caption" sx={{ fontWeight: 600 }}>{opt.label}</Typography>
                                    </Box>
                                </Tooltip>
                            );
                        })}
                    </Box>

                    <FormField label="Name" required>
                        <TextField
                            id="resource-name"
                            name="resource-name"
                            fullWidth
                            size="small"
                            placeholder="Give it a clear, descriptive name"
                            value={form.name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => upd('name', e.target.value)}
                        />
                    </FormField>

                    <FormField label="Description">
                        <TextField
                            id="resource-desc"
                            name="resource-desc"
                            fullWidth
                            multiline
                            placeholder="What does this do?"
                            value={form.desc}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => upd('desc', e.target.value)}
                        />
                    </FormField>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <FormField label="Category" sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                <StandardSelect
                                    value={form.type}
                                    onChange={(e: any) => upd('type', e.target.value)}
                                    options={CATEGORIES.filter((c) => c !== 'All').map(c => ({ label: c, value: c }))}
                                />
                                {CAT_SHORT_INFO[form.type as CategoryName] && (
                                    <Typography variant="caption" color="text.secondary">
                                        {CAT_SHORT_INFO[form.type as CategoryName]}
                                    </Typography>
                                )}
                            </Box>
                        </FormField>
                        <FormField label="Discipline" sx={{ flex: 1 }}>
                            <StandardSelect
                                value={form.discipline}
                                onChange={(e: any) => upd('discipline', e.target.value)}
                                options={DISCIPLINES.map(d => ({ label: d, value: d }))}
                            />
                        </FormField>
                    </Box>

                    <FormField label="Office (Optional)">
                        <StandardSelect
                            value={form.office}
                            onChange={(e: any) => upd('office', e.target.value)}
                            options={OFFICES.map(o => ({ label: o, value: o }))}
                        />
                    </FormField>
                </Box>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    {form.kind === 'idea' ? (
                        <>
                            <FormField label="Problem Statement" required>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    placeholder="What is the problem?"
                                    value={form.problemStatement}
                                    onChange={(e) => upd('problemStatement', e.target.value)}
                                />
                            </FormField>
                            <FormField label="Proposed Solution" required>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    placeholder="How can AI solve this?"
                                    value={form.proposedSolution}
                                    onChange={(e) => upd('proposedSolution', e.target.value)}
                                />
                            </FormField>
                        </>
                    ) : (
                        <>
                            {form.type !== 'Viz Prompts' && (
                                <FormField label="Primary Link" required>
                                    <TextField
                                        id="resource-link"
                                        name="resource-link"
                                        fullWidth
                                        size="small"
                                        placeholder="Direct URL to the AI tool, prompt, or notebook"
                                        value={form.link}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => upd('link', e.target.value)}
                                    />
                                </FormField>
                            )}

                            {form.type === 'Viz Prompts' && (
                                <FormField label="Images (Upload at least a result image)">
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <UploadZone
                                            label="AI Result Image"
                                            url={vizImages.result}
                                            uploading={uploadingImages.result}
                                            setUploading={(val) => setUploadingImages({ ...uploadingImages, result: val })}
                                            onUpload={(url) => setVizImages({ ...vizImages, result: url })}
                                            onClear={() => setVizImages({ ...vizImages, result: '' })}
                                        />
                                        <UploadZone
                                            label="Source/Original Image (Optional)"
                                            url={vizImages.original}
                                            uploading={uploadingImages.original}
                                            setUploading={(val) => setUploadingImages({ ...uploadingImages, original: val })}
                                            onUpload={(url) => setVizImages({ ...vizImages, original: url })}
                                            onClear={() => setVizImages({ ...vizImages, original: '' })}
                                        />
                                        <UploadZone
                                            label="Style Reference Image (Optional)"
                                            url={vizImages.style}
                                            uploading={uploadingImages.style}
                                            setUploading={(val) => setUploadingImages({ ...uploadingImages, style: val })}
                                            onUpload={(url) => setVizImages({ ...vizImages, style: url })}
                                            onClear={() => setVizImages({ ...vizImages, style: '' })}
                                        />
                                    </Box>
                                </FormField>
                            )}
                        </>
                    )}

                    <TagInput tags={tags} setTags={setTags} />

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        {form.type !== 'Idea' && (
                            <FormField label="AI Model (Optional)" sx={{ flex: 1 }}>
                                <StandardSelect
                                    value={form.aiModel}
                                    onChange={(e: any) => upd('aiModel', e.target.value)}
                                    options={AI_MODELS.map(m => ({ label: m, value: m }))}
                                />
                            </FormField>
                        )}
                        <Box sx={{ flex: 1 }} />
                    </Box>

                    <FormField label="Prompt / Instructions (Optional)">
                        <TextField
                            id="resource-prompt"
                            name="resource-prompt"
                            fullWidth
                            multiline
                            rows={3}
                            placeholder="Paste the prompt text"
                            value={form.prompt}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => upd('prompt', e.target.value)}
                        />
                    </FormField>

                    <FormField label="Supporting Documentation URLs (Optional)">
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {extraLinks.map((link, i) => (
                                <Box key={i} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        placeholder="Paste an extra URL (e.g., presentation, video)"
                                        value={link}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleLinkChange(i, e.target.value)}
                                    />
                                    {extraLinks.length > 1 && i !== extraLinks.length - 1 && (
                                        <StandardIconButton
                                            icon={Close}
                                            label="Remove link"
                                            onClick={() => removeLink(i)}
                                            variant="default"
                                        />
                                    )}
                                </Box>
                            ))}
                        </Box>
                    </FormField>
                </Box>
            )}
        </StandardDialog>
    );
};
