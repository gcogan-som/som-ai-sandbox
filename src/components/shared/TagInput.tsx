import React from 'react';
import { useAtomValue } from 'jotai';
import {
    Chip,
    Autocomplete,
    TextField,
    Box,
} from '@mui/material';
import { FormField } from '@som/ui';
import { DISCIPLINES } from '../../data/disciplines';
import { OFFICES } from '../../data/offices';
import { liveItemsAtom } from '../../atoms/appAtoms';
import { createFilterOptions } from '@mui/material/Autocomplete';

interface TagOption {
    name: string;
    category: string;
}

const filter = createFilterOptions<TagOption>();

interface TagInputProps {
    tags: string[];
    setTags: (tags: string[]) => void;
}

export const TagInput: React.FC<TagInputProps> = ({ tags, setTags }) => {
    const liveItems = useAtomValue(liveItemsAtom);

    // Dynamically gather all tags from LIVE items + Disciplines + Offices
    const dynamicOptions = React.useMemo<TagOption[]>(() => {
        const liveTags = Array.from(new Set(liveItems.flatMap(i => i.tags)));

        const options: TagOption[] = [
            ...DISCIPLINES.map(d => ({ name: d, category: 'Disciplines' })),
            ...OFFICES.map(o => ({ name: o, category: 'Offices' })),
            ...liveTags.filter(t => !DISCIPLINES.includes(t as any) && !OFFICES.includes(t as any))
                .map(t => ({ name: t, category: 'Community Tags' }))
        ];

        return options.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
    }, [liveItems]);

    // Map string tags to TagOption for the Autocomplete value
    const selectedOptions = React.useMemo(() => {
        return tags.map(t => {
            const existing = dynamicOptions.find(o => o.name === t);
            return existing || { name: t, category: 'Custom' };
        });
    }, [tags, dynamicOptions]);

    return (
        <FormField label="Tags">
            <Autocomplete
                multiple
                freeSolo
                size="small"
                options={dynamicOptions}
                getOptionLabel={(option) => {
                    if (typeof option === 'string') return option;
                    return option.name;
                }}
                groupBy={(option) => option.category}
                value={selectedOptions}
                filterOptions={(options, params) => {
                    const filtered = filter(options, params);
                    const { inputValue } = params;
                    const isExisting = options.some((option) => inputValue === option.name);
                    if (inputValue !== '' && !isExisting) {
                        filtered.push({
                            name: inputValue,
                            category: `Add "${inputValue}"`
                        });
                    }
                    return filtered;
                }}
                onChange={(_, newValue) => {
                    const finalTags = newValue.map(v => {
                        if (typeof v === 'string') return v;
                        return v.name;
                    });
                    setTags(finalTags);
                }}
                renderOption={(props, option) => {
                    const { key, ...otherProps } = props as any;
                    return (
                        <Box key={key} component="li" {...otherProps} sx={{ px: 1, py: 0.5 }}>
                            <Chip
                                label={option.name}
                                size="small"
                                sx={{
                                    height: 20,
                                    fontSize: '0.7rem',
                                    borderRadius: '4px',
                                    bgcolor: 'action.hover',
                                    cursor: 'pointer'
                                }}
                            />
                        </Box>
                    );
                }}
                renderTags={(value: TagOption[], getTagProps) =>
                    value.map((option: TagOption, index: number) => {
                        const { key, ...tagProps } = getTagProps({ index });
                        return (
                            <Chip
                                key={key}
                                label={option.name}
                                size="small"
                                {...tagProps}
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
                        );
                    })
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
