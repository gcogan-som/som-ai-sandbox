import React, { useState, useRef } from 'react';
import { ALL_TAGS } from '../../data/mockItems';

interface TagInputProps {
    tags: string[];
    setTags: (tags: string[]) => void;
}

export const TagInput: React.FC<TagInputProps> = ({ tags, setTags }) => {
    const [input, setInput] = useState('');
    const [focused, setFocused] = useState(false);
    const ref = useRef<HTMLInputElement>(null);

    const suggestions =
        input.length > 0
            ? ALL_TAGS.filter(
                (t) => t.toLowerCase().includes(input.toLowerCase()) && !tags.includes(t)
            ).slice(0, 6)
            : [];

    const add = (t: string) => {
        const clean = t.trim().toLowerCase();
        if (clean && !tags.includes(clean)) {
            setTags([...tags, clean]);
            setInput('');
        }
    };
    const remove = (t: string) => setTags(tags.filter((x) => x !== t));

    return (
        <div>
            <label
                style={{
                    display: 'block',
                    fontSize: 9,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: '#555',
                    fontFamily: 'var(--sans)',
                    marginBottom: 5,
                }}
            >
                Tags
            </label>
            <div
                onClick={() => ref.current?.focus()}
                style={{
                    background: '#151515',
                    border: '1px solid #1e1e1e',
                    borderRadius: 8,
                    padding: '6px 8px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 4,
                    minHeight: 36,
                    alignItems: 'center',
                    cursor: 'text',
                }}
            >
                {tags.map((t) => (
                    <span
                        key={t}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            fontSize: 11,
                            color: '#D4845A',
                            background: 'rgba(212,132,90,0.1)',
                            border: '1px solid rgba(212,132,90,0.2)',
                            padding: '2px 8px',
                            borderRadius: 100,
                            fontFamily: 'var(--mono)',
                        }}
                    >
                        {t}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                remove(t);
                            }}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#D4845A80',
                                cursor: 'pointer',
                                fontSize: 12,
                                padding: 0,
                                lineHeight: 1,
                            }}
                        >
                            ×
                        </button>
                    </span>
                ))}
                <div style={{ position: 'relative', flex: 1, minWidth: 80 }}>
                    <input
                        ref={ref}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setTimeout(() => setFocused(false), 150)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && input.trim()) {
                                e.preventDefault();
                                add(input);
                            }
                            if (e.key === 'Backspace' && !input && tags.length) remove(tags[tags.length - 1]);
                        }}
                        placeholder={tags.length === 0 ? 'e.g. facade, parametric...' : ''}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            outline: 'none',
                            color: '#bbb',
                            fontSize: 12,
                            fontFamily: 'var(--sans)',
                            width: '100%',
                            padding: '2px 0',
                        }}
                    />
                    {focused && suggestions.length > 0 && (
                        <div
                            style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                marginTop: 4,
                                background: '#1a1a1a',
                                border: '1px solid #262626',
                                borderRadius: 7,
                                padding: 3,
                                zIndex: 20,
                                minWidth: 160,
                                boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
                            }}
                        >
                            {suggestions.map((s) => (
                                <div
                                    key={s}
                                    onMouseDown={() => add(s)}
                                    style={{
                                        padding: '5px 10px',
                                        borderRadius: 5,
                                        cursor: 'pointer',
                                        fontSize: 11.5,
                                        color: '#999',
                                        fontFamily: 'var(--mono)',
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = '#222')}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                                >
                                    {s}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
