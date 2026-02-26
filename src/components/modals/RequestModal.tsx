import React from 'react';
import { useAtom } from 'jotai';
import {
    Box,
    Typography,
    Button,
    Paper,
    alpha,
    TextField,
    Stack
} from '@mui/material';
import { ArrowUpward, Add } from '@mui/icons-material';
import { StandardDialog, StandardSelect } from '@som/ui';
import { collection, addDoc, doc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { requestsAtom, showReqAtom } from '../../atoms/modalAtoms';
import { isDevModeAtom } from '../../atoms/appAtoms';
import { CATEGORIES, COLORS } from '../../data/categories';
import { CatIcon } from '../shared/CatIcon';
import type { CategoryName } from '../../types';

export const RequestModal: React.FC<{ open: boolean }> = ({ open }) => {
    const [requests, setRequests] = useAtom(requestsAtom);
    const [, setShowReq] = useAtom(showReqAtom);
    const [newTitle, setNewTitle] = React.useState('');
    const [newCategory, setNewCategory] = React.useState<CategoryName>('Gems');
    const [devMode] = useAtom(isDevModeAtom);
    const onClose = () => setShowReq(false);

    const addRequest = async () => {
        if (!newTitle.trim()) return;

        const requestData = {
            title: newTitle.trim(),
            category: newCategory,
            author: 'You', // TODO: Use actual user name from Auth
            office: 'Local', // TODO: Use actual user office
            votes: 1,
            date: new Date().toISOString().split('T')[0],
            createdAt: serverTimestamp()
        };

        if (devMode) {
            const nextId = requests.length ? Math.max(...requests.map(r => typeof r.id === 'number' ? r.id : 0)) + 1 : 1;
            setRequests([{
                id: nextId,
                ...requestData
            }, ...requests]);
        } else {
            try {
                await addDoc(collection(db, 'requests'), requestData);
            } catch (error) {
                console.error("Error adding request:", error);
            }
        }
        setNewTitle('');
    };

    const vote = async (id: number | string) => {
        if (devMode) {
            setRequests(requests.map((r) => (r.id === id ? { ...r, votes: r.votes + 1 } : r)));
        } else {
            try {
                const requestRef = doc(db, 'requests', id.toString());
                await updateDoc(requestRef, {
                    votes: increment(1)
                });
            } catch (error) {
                console.error("Error voting:", error);
            }
        }
    };

    const sorted = [...requests].sort((a, b) => b.votes - a.votes);

    return (
        <StandardDialog
            open={open}
            onClose={onClose}
            title="Requests"
        >
            <Box
                sx={{
                    height: 2,
                    bgcolor: 'text.primary',
                    mt: -2.5,
                    mx: -3,
                    mb: 2.5
                }}
            />

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, lineHeight: 1.6 }}>
                Vote on resources you'd like someone to create. The most-requested items get prioritized.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {sorted.map((r) => {
                    const accentColor = COLORS[r.category];
                    return (
                        <Paper
                            key={r.id}
                            elevation={0}
                            sx={{
                                display: 'flex',
                                gap: 1.5,
                                alignItems: 'center',
                                bgcolor: 'action.hover',
                                borderRadius: 1,
                                p: 1.5,
                                border: '1px solid',
                                borderColor: 'divider',
                            }}
                        >
                            {/* Vote button - minimal styling */}
                            <Button
                                onClick={() => vote(r.id)}
                                size="small"
                                sx={{
                                    minWidth: 40,
                                    p: 0.5,
                                    flexDirection: 'column',
                                    gap: 0.25,
                                    color: 'text.secondary',
                                    borderRadius: 1,
                                    '&:hover': {
                                        bgcolor: 'action.selected',
                                        color: 'text.primary',
                                    }
                                }}
                            >
                                <ArrowUpward sx={{ fontSize: 12 }} />
                                <Typography variant="caption" sx={{ fontFamily: 'monospace', lineHeight: 1, fontWeight: 600 }}>{r.votes}</Typography>
                            </Button>

                            {/* Category Icon */}
                            <Box
                                sx={{
                                    width: 32,
                                    height: 32,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 1,
                                    bgcolor: alpha(accentColor, 0.1),
                                    color: accentColor
                                }}
                            >
                                <CatIcon category={r.category} size={16} />
                            </Box>

                            <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle2" sx={{ lineHeight: 1.2, mb: 0.25 }}>{r.title}</Typography>
                                <Typography variant="caption" color="text.disabled">
                                    Requested by {r.author} · {r.office}
                                </Typography>
                            </Box>
                        </Paper>
                    );
                })}
            </Box>

            <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="What resource do you need?"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        sx={{ flex: 2 }}
                    />
                    <Box sx={{ flex: 1 }}>
                        <StandardSelect
                            value={newCategory}
                            onChange={(e: any) => setNewCategory(e.target.value as CategoryName)}
                            options={CATEGORIES.filter(c => c !== 'All').map(c => ({ label: c, value: c }))}
                        />
                    </Box>
                </Stack>
                <Button
                    fullWidth
                    variant="contained"
                    onClick={addRequest}
                    disabled={!newTitle.trim()}
                    startIcon={<Add />}
                    sx={{
                        bgcolor: 'text.primary',
                        color: 'background.paper',
                        py: 1,
                        '&:hover': { bgcolor: alpha('#000', 0.8) }
                    }}
                >
                    Request
                </Button>
            </Box>
        </StandardDialog>
    );
};
