import React from 'react';
import {
    Chip,
    Autocomplete,
    TextField,
    alpha
} from '@mui/material';
import { FormField } from '@som/ui';
import { ALL_TAGS } from '../../data/mockItems';

interface TagInputProps {
    tags: string[];
    setTags: (tags: string[]) => void;
}

export const TagInput: React.FC<TagInputProps> = ({ tags, setTags }) => {
    return (
        <FormField label="Tags">
            <Autocomplete
                multiple
                freeSolo
                size="small"
                options={ALL_TAGS}
                value={tags}
                onChange={(_, newValue) => setTags(newValue as string[])}
                renderTags={(value: string[], getTagProps) =>
                    value.map((option: string, index: number) => (
                        <Chip
                            label={option}
                            size="small"
                            {...getTagProps({ index })}
                            sx={{
                                border: 'none',
                                bgcolor: 'action.hover',
                                color: 'text.secondary',
                                '& .MuiChip-label': { px: 0.75 },
                                '& .MuiChip-deleteIcon': {
                                    fontSize: 14,
                                    color: 'text.disabled',
                                    '&:hover': { color: 'error.main' }
                                }
                            }}
                        />
                    ))
                }
                renderInput={(params) => (
                    <TextField
                        {...params}
                        placeholder={tags.length === 0 ? "e.g. facade, parametric..." : ""}
                        sx={{
                            '& .MuiInputBase-root': {
                                bgcolor: 'background.paper',
                            }
                        }}
                    />
                )}
                sx={{
                    '& .MuiAutocomplete-endAdornment': { display: 'none' }
                }}
            />
        </FormField>
    );
};
