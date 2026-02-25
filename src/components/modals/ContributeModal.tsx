import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    ToggleButton,
    ToggleButtonGroup,
    TextField,
} from '@mui/material';
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

    const upd = (k: string, v: string) => setForm({ ...form, [k]: v });

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
                    <ToggleButtonGroup
                        value={form.kind}
                        exclusive
                        onChange={(_, v) => v && upd('kind', v)}
                        fullWidth
                    >
                        <ToggleButton value="use" sx={{ py: 1.5, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Typography variant="h4">🔧</Typography>
                            <Typography variant="caption" sx={{ fontWeight: 600 }}>Share a Tool</Typography>
                        </ToggleButton>
                        <ToggleButton value="learn" sx={{ py: 1.5, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Typography variant="h4">📖</Typography>
                            <Typography variant="caption" sx={{ fontWeight: 600 }}>Write a Guide</Typography>
                        </ToggleButton>
                    </ToggleButtonGroup>

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
                            rows={3}
                            placeholder="How does this help the firm?"
                            value={form.desc}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => upd('desc', e.target.value)}
                        />
                    </FormField>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <FormField label="Category" sx={{ flex: 1 }}>
                            <StandardSelect
                                value={form.type}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => upd('type', e.target.value)}
                                options={CATEGORIES.filter((c) => c !== 'All').map(c => ({ label: c, value: c }))}
                            />
                        </FormField>
                        <FormField label="Discipline" sx={{ flex: 1 }}>
                            <StandardSelect
                                value={form.discipline}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => upd('discipline', e.target.value)}
                                options={DISCIPLINES.map(d => ({ label: d, value: d }))}
                            />
                        </FormField>
                    </Box>
                </Box>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <FormField label="Link">
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Paste the URL to your resource"
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
                </Box>
            )}
        </StandardDialog>
    );
};
