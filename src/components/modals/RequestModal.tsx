import React from 'react';
import { useAtom } from 'jotai';
import {
    Box,
    Typography,
    Button,
    Paper,
    alpha
} from '@mui/material';
import { ArrowUpward } from '@mui/icons-material';
import { StandardDialog } from '@som/ui';
import { requestsAtom, showReqAtom } from '../../atoms/modalAtoms';

export const RequestModal: React.FC = () => {
    const [requests, setRequests] = useAtom(requestsAtom);
    const [, setShowReq] = useAtom(showReqAtom);
    const onClose = () => setShowReq(false);

    const vote = (id: number) =>
        setRequests(requests.map((r) => (r.id === id ? { ...r, votes: r.votes + 1 } : r)));

    const sorted = [...requests].sort((a, b) => b.votes - a.votes);

    return (
        <StandardDialog
            open={true}
            onClose={onClose}
            title={`Requests (${requests.length})`}
        >
            <Box
                sx={{
                    height: 3,
                    background: 'linear-gradient(90deg,#6AADCF,#B494D0)',
                    mt: -2.5,
                    mx: -3,
                    mb: 2.5
                }}
            />

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, lineHeight: 1.6 }}>
                Vote on resources you'd like someone to create. The most-requested items get prioritized.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {sorted.map((r) => (
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
                        <Button
                            onClick={() => vote(r.id)}
                            size="small"
                            variant="outlined"
                            sx={{
                                minWidth: 40,
                                p: 0.5,
                                flexDirection: 'column',
                                gap: 0.25,
                                borderColor: alpha('#6AADCF', 0.2),
                                color: '#6AADCF',
                            }}
                        >
                            <ArrowUpward sx={{ fontSize: 12 }} />
                            <Typography variant="caption" sx={{ fontFamily: 'monospace', lineHeight: 1 }}>{r.votes}</Typography>
                        </Button>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle2" sx={{ lineHeight: 1.2, mb: 0.5 }}>{r.title}</Typography>
                            <Typography variant="caption" color="text.disabled">
                                Requested by {r.author} · {r.office}
                            </Typography>
                        </Box>
                    </Paper>
                ))}
            </Box>
        </StandardDialog>
    );
};
