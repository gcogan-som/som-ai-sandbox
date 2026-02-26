import React from 'react';
import { useAtomValue } from 'jotai';
import { StandardTagInput } from '@som/ui';
import { DISCIPLINES } from '../../data/disciplines';
import { OFFICES } from '../../data/offices';
import { liveItemsAtom } from '../../atoms/appAtoms';

interface TagOption {
    name: string;
    category: string;
}

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

    return (
        <StandardTagInput
            value={tags}
            onChange={setTags}
            options={dynamicOptions}
            label="Tags"
        />
    );
};
