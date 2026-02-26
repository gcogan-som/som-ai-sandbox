import React, { useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import {
    Box,
    Typography,
    Button,
    TextField,
    Rating,
    Stack,
    CircularProgress
} from '@mui/material';
import { Send } from '@mui/icons-material';
import { StandardDialog, FormField } from '@som/ui';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { showFeedbackAtom } from '../../atoms/modalAtoms';
import { isDevModeAtom } from '../../atoms/appAtoms';
import { useAuth } from '../../lib/auth/AuthContext';

export const FeedbackModal: React.FC = () => {
    const [showFeedback, setShowFeedback] = useAtom(showFeedbackAtom);
    const devMode = useAtomValue(isDevModeAtom);
    const { user } = useAuth();

    const [feedback, setFeedback] = useState('');
    const [rating, setRating] = useState<number | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleClose = () => {
        setShowFeedback(false);
        // Reset after animation
        setTimeout(() => {
            setFeedback('');
            setRating(null);
            setSubmitted(false);
            setSubmitting(false);
        }, 300);
    };

    const handleSubmit = async () => {
        if (!feedback.trim()) return;

        setSubmitting(true);
        const feedbackData = {
            text: feedback.trim(),
            rating: rating,
            url: window.location.href,
            user: user?.email || 'anonymous',
            userName: user?.displayName || 'Anonymous',
            timestamp: serverTimestamp(),
            source: 'AI Sandbox'
        };

        if (devMode) {
            console.log('Dev Mode: Feedback submitted', feedbackData);
            setSubmitting(false);
            setSubmitted(true);
        } else {
            try {
                await addDoc(collection(db, 'feedback'), feedbackData);
                setSubmitting(false);
                setSubmitted(true);
            } catch (error) {
                console.error('Error submitting feedback:', error);
                setSubmitting(false);
                alert('Failed to submit feedback. Please try again later.');
            }
        }
    };

    return (
        <StandardDialog
            open={showFeedback}
            onClose={handleClose}
            title="Submit Feedback"
            maxWidth="sm"
        >
            <Box sx={{ p: 1 }}>
                {submitted ? (
                    <Stack spacing={2} alignItems="center" sx={{ py: 4 }}>
                        <Typography variant="h6">Thank you!</Typography>
                        <Typography variant="body2" color="text.secondary" align="center">
                            Your feedback has been submitted. We appreciate your input as we continue to improve the AI Sandbox.
                        </Typography>
                        <Button variant="contained" onClick={handleClose} sx={{ mt: 2 }}>
                            Close
                        </Button>
                    </Stack>
                ) : (
                    <Stack spacing={3}>
                        <Typography variant="body2" color="text.secondary">
                            Found a bug? Have a feature request? Or just want to share your experience?
                            We'd love to hear from you.
                        </Typography>

                        <FormField label="How was your experience?" id="feedback-rating">
                            <Rating
                                value={rating}
                                onChange={(_, newValue) => setRating(newValue)}
                                size="large"
                            />
                        </FormField>

                        <FormField label="Details" id="feedback-text" required>
                            <TextField
                                multiline
                                rows={4}
                                fullWidth
                                placeholder="Tell us more..."
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                            />
                        </FormField>

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1 }}>
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                disabled={!feedback.trim() || submitting}
                                startIcon={submitting ? <CircularProgress size={20} /> : <Send />}
                                sx={{
                                    minWidth: 120,
                                    bgcolor: 'text.primary',
                                    color: 'background.paper',
                                    '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' }
                                }}
                            >
                                {submitting ? 'Sending...' : 'Send Feedback'}
                            </Button>
                        </Box>
                    </Stack>
                )}
            </Box>
        </StandardDialog>
    );
};
