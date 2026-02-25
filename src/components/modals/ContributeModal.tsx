import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    TextField,
    IconButton,
} from '@mui/material';
import { CloudUpload, Close, Construction, Description } from '@mui/icons-material';
import { StandardDialog, FormField, StandardSelect } from '@som/ui';
import { CATEGORIES } from '../../data/categories';
import { DISCIPLINES } from '../../data/disciplines';
import { TagInput } from '../shared/TagInput';

interface ContributeModalProps {
    onClose: () => void;
}

export const ContributeModal: React.FC<ContributeModalProps> = ({ onClose }) => {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        kind: 'use' as 'use' | 'learn',
        name: '',
        desc: '',
        type: 'Gems',
        discipline: 'General',
        link: '',
        prompt: '',
    });
    const [tags, setTags] = useState<string[]>([]);
    const [extraLinks, setExtraLinks] = useState<string[]>(['']);
    const [files, setFiles] = useState<File[]>([]);

    const upd = (k: string, v: string) => setForm({ ...form, [k]: v });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles([...files, ...Array.from(e.target.files)]);
        }
    };

    const handleLinkChange = (idx: number, val: string) => {
        const newLinks = [...extraLinks];
        newLinks[idx] = val;
        setExtraLinks(newLinks);
        // Automatically add a new empty row if the last one gets filled
        if (idx === extraLinks.length - 1 && val) setExtraLinks([...newLinks, '']);
    };

    const removeLink = (idx: number) => {
        setExtraLinks(extraLinks.filter((_, i) => i !== idx));
    };

    const removeFile = (idx: number) => {
        setFiles(files.filter((_, i) => i !== idx));
    };

    return (
        <StandardDialog
            open={true}
            onClose={onClose}
            title={step === 1 ? 'Contribute' : 'Almost There'}
            actions={
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', px: 1, pb: 1 }}>
                    {step === 1 ? (
                        <>
                            <Box />
                            <Button variant="contained" onClick={() => setStep(2)}>
                                Next
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="outlined" onClick={() => setStep(1)} sx={{ borderColor: 'divider' }}>
                                Back
                            </Button>
                            <Button variant="contained" color="success" onClick={onClose}>
                                Submit
                            </Button>
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

                    <FormField label="Name">
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Give it a clear, descriptive name"
                            value={form.name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => upd('name', e.target.value)}
                        />
                    </FormField>

                    <FormField label="Description">
                        <TextField
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
                </Box>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <FormField label="Primary Tool Link">
                        <TextField
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
                                        <IconButton onClick={() => removeLink(i)} size="small">
                                            <Close fontSize="small" />
                                        </IconButton>
                                    )}
                                </Box>
                            ))}
                        </Box>
                    </FormField>

                    <FormField label="Supporting Documents (Optional)">
                        <Button
                            component="label"
                            variant="outlined"
                            startIcon={<CloudUpload />}
                            sx={{ borderColor: 'divider', color: 'text.secondary', justifyContent: 'flex-start' }}
                        >
                            Upload Files (PDF, Word, Images)
                            <input
                                type="file"
                                hidden
                                multiple
                                accept=".pdf,.doc,.docx,image/*"
                                onChange={handleFileChange}
                            />
                        </Button>
                        {files.length > 0 && (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1.5 }}>
                                {files.map((file, i) => (
                                    <Box
                                        key={i}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            p: 0.5,
                                            pr: 1,
                                            borderRadius: 1,
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            bgcolor: 'action.hover',
                                        }}
                                    >
                                        <IconButton size="small" onClick={() => removeFile(i)} sx={{ p: 0.25 }}>
                                            <Close fontSize="small" />
                                        </IconButton>
                                        <Typography variant="caption" sx={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {file.name}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </FormField>
                </Box>
            )}
        </StandardDialog>
    );
};
