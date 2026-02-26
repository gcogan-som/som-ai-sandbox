import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
} from '@mui/material';
import { Close, Construction, Description } from '@mui/icons-material';
import { StandardDialog, FormField, StandardSelect, StandardButton, StandardIconButton } from '@som/ui';
import { collection, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { useAtomValue, useAtom } from 'jotai';
import { db } from '../../lib/firebase';
import { isDevModeAtom } from '../../atoms/appAtoms';
import { editingItemAtom } from '../../atoms/modalAtoms';
import { useAuth } from '../../lib/auth/AuthContext';
import { CATEGORIES } from '../../data/categories';
import { DISCIPLINES } from '../../data/disciplines';
import { OFFICES } from '../../data/offices';
import { TagInput } from '../shared/TagInput';
import type { CategoryName } from '../../types';

interface ContributeModalProps {
    open: boolean;
    onClose: () => void;
}



export const ContributeModal: React.FC<ContributeModalProps> = ({ open, onClose }) => {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        kind: 'use' as 'use' | 'learn',
        name: '',
        desc: '',
        type: 'Gems',
        discipline: 'General',
        office: 'New York',
        link: '',
        prompt: '',
    });
    const [tags, setTags] = useState<string[]>([]);
    const [extraLinks, setExtraLinks] = useState<string[]>(['']);
    const [submitting, setSubmitting] = useState(false);
    const [editingItem, setEditingItem] = useAtom(editingItemAtom);
    const devMode = useAtomValue(isDevModeAtom);
    const { user } = useAuth();

    React.useEffect(() => {
        if (editingItem && open) {
            setForm({
                kind: editingItem.kind,
                name: editingItem.title,
                desc: editingItem.description,
                type: editingItem.category,
                discipline: editingItem.discipline,
                office: editingItem.office || 'New York',
                link: editingItem.primaryLink || '',
                prompt: editingItem.prompt || '',
            });
            setTags(editingItem.tags);
            setExtraLinks(editingItem.supportingLinks?.length ? [...editingItem.supportingLinks, ''] : ['']);
        } else if (open) {
            setForm({
                kind: 'use',
                name: '',
                desc: '',
                type: 'Gems',
                discipline: 'General',
                office: 'New York',
                link: '',
                prompt: '',
            });
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

    const upd = (k: string, v: string) => setForm({ ...form, [k]: v });

    const handleSubmit = async () => {
        if (!form.name || !form.link) {
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
                author: user?.displayName || 'Anonymous',
                date: editingItem ? editingItem.date : new Date().toISOString().split('T')[0],
                rating: editingItem ? editingItem.rating : 0,
                uses: editingItem ? editingItem.uses : 0,
                tags: tags,
                featured: editingItem ? editingItem.featured : false,
                verified: editingItem ? editingItem.verified : false,
                tips: editingItem ? editingItem.tips : [],
                primaryLink: form.link,
                prompt: form.prompt,
                supportingLinks: extraLinks.filter(l => l.trim() !== ''),
                supportingFiles: editingItem?.supportingFiles || [],
                updatedAt: serverTimestamp()
            };

            if (!editingItem) {
                resourceData.createdAt = serverTimestamp();
            }

            if (!devMode) {
                // Fire and forget: Firestore handles optimistic UI updates automatically.
                // We no longer `await` the network response because it hangs indefinitely on Zscaler/VPNs.
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

            // SUCCESS FLOW
            setSubmitting(false);
            handleClose();
            // Small delay for alert so the modal closure finishes rendering
            setTimeout(() => {
                alert(editingItem ? "Successfully updated!" : "Successfully saved to Sandbox!");
            }, 100);

        } catch (error: any) {
            console.error("Critical submission error:", error);
            setSubmitting(false);
            alert(`Submission failed: ${error.message || 'Unknown error'}. Check your connection.`);
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
                            <StandardButton variant="primary" onClick={handleSubmit} disabled={submitting || !form.name.trim() || !form.link.trim()}>
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

            {/* Step Indicator */}
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
                            { id: 'use', icon: <Construction sx={{ fontSize: 28 }} />, label: 'Submit a Resource' },
                            { id: 'learn', icon: <Description sx={{ fontSize: 28 }} />, label: 'Submit a Guide' }
                        ].map((opt) => {
                            const selected = form.kind === opt.id;
                            return (
                                <Box
                                    key={opt.id}
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
                            <StandardSelect
                                value={form.type}
                                onChange={(e: any) => upd('type', e.target.value)}
                                options={CATEGORIES.filter((c) => c !== 'All').map(c => ({ label: c, value: c }))}
                            />
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
                    <FormField label="Primary Tool Link" required>
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

                    <TagInput tags={tags} setTags={setTags} />

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
