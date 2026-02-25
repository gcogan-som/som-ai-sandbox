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
                            variant="outlined"
                            label={option}
                            {...getTagProps({ index })}
                            sx={{
                                height: 20,
                                fontSize: '10px',
                                fontFamily: 'monospace',
                                bgcolor: alpha('#D4845A', 0.1),
                                color: '#D4845A',
                                borderColor: alpha('#D4845A', 0.2),
                                '& .MuiChip-deleteIcon': {
                                    fontSize: 12,
                                    color: alpha('#D4845A', 0.5),
                                    '&:hover': { color: '#D4845A' }
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
                                bgcolor: 'background.default',
                                fontSize: '12px',
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
