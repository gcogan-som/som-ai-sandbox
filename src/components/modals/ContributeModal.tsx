import React, { useState } from 'react';
import { CATEGORIES } from '../../data/categories';
import { DISCIPLINES } from '../../data/disciplines';
import { TagInput } from '../shared/TagInput';

interface ContributeModalProps {
    onClose: () => void;
}

export const ContributeModal: React.FC<ContributeModalProps> = ({ onClose }) => {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        kind: 'use',
        name: '',
        desc: '',
        type: 'Gems',
        discipline: 'General',
        link: '',
        prompt: '',
    });
    const [tags, setTags] = useState<string[]>([]);
    const upd = (k: string, v: string) => setForm({ ...form, [k]: v });

    const Field = ({
        label,
        k,
        ph,
        multi,
    }: {
        label: string;
        k: string;
        ph: string;
        multi?: boolean;
    }) => (
        <div style={{ marginBottom: 14 }}>
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
                {label}
            </label>
            {multi ? (
                <textarea
                    rows={3}
                    value={(form as any)[k]}
                    onChange={(e) => upd(k, e.target.value)}
                    placeholder={ph}
                    style={{
                        width: '100%',
                        background: '#151515',
                        border: '1px solid #1e1e1e',
                        borderRadius: 8,
                        padding: '9px 12px',
                        color: '#bbb',
                        fontSize: 12,
                        fontFamily: 'var(--sans)',
                        resize: 'vertical',
                        outline: 'none',
                        boxSizing: 'border-box',
                    }}
                />
            ) : (
                <input
                    value={(form as any)[k]}
                    onChange={(e) => upd(k, e.target.value)}
                    placeholder={ph}
                    style={{
                        width: '100%',
                        background: '#151515',
                        border: '1px solid #1e1e1e',
                        borderRadius: 8,
                        padding: '9px 12px',
                        color: '#bbb',
                        fontSize: 12,
                        fontFamily: 'var(--sans)',
                        outline: 'none',
                        boxSizing: 'border-box',
                    }}
                />
            )}
        </div>
    );

    const Select = ({ label, k, opts }: { label: string; k: string; opts: readonly string[] | string[] }) => (
        <div style={{ marginBottom: 14 }}>
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
                {label}
            </label>
            <select
                value={(form as any)[k]}
                onChange={(e) => upd(k, e.target.value)}
                style={{
                    width: '100%',
                    background: '#151515',
                    border: '1px solid #1e1e1e',
                    borderRadius: 8,
                    padding: '9px 12px',
                    color: '#bbb',
                    fontSize: 12,
                    fontFamily: 'var(--sans)',
                    outline: 'none',
                }}
            >
                {opts.map((o) => (
                    <option key={o} value={o}>
                        {o}
                    </option>
                ))}
            </select>
        </div>
    );

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0,0,0,0.7)',
                backdropFilter: 'blur(16px)',
                animation: 'fadeIn 0.2s ease',
            }}
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: '#131313',
                    borderRadius: 18,
                    maxWidth: 520,
                    width: '92%',
                    border: '1px solid #262626',
                    overflow: 'hidden',
                    animation: 'slideUp 0.3s ease',
                    maxHeight: '88vh',
                    overflowY: 'auto',
                }}
            >
                <div
                    style={{
                        height: 3,
                        background: 'linear-gradient(90deg,#D4845A,#6AADCF,#CBAA5E,#E07BA0,#B494D0,#8BC78A)',
                    }}
                />
                <div style={{ padding: '24px 28px 28px' }}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 20,
                        }}
                    >
                        <h2
                            style={{
                                fontSize: 22,
                                fontWeight: 400,
                                color: '#eee',
                                margin: 0,
                                fontFamily: 'var(--serif)',
                            }}
                        >
                            {step === 1 ? 'Contribute' : 'Almost There'}
                        </h2>
                        <button
                            onClick={onClose}
                            style={{
                                background: '#1a1a1a',
                                border: '1px solid #262626',
                                borderRadius: 7,
                                width: 32,
                                height: 32,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: '#666',
                                fontSize: 16,
                            }}
                        >
                            ×
                        </button>
                    </div>

                    {/* Progress */}
                    <div
                        style={{
                            display: 'flex',
                            gap: 5,
                            marginBottom: 22,
                        }}
                    >
                        {[1, 2].map((s) => (
                            <div
                                key={s}
                                style={{
                                    height: 2,
                                    flex: 1,
                                    borderRadius: 2,
                                    background: step >= s ? '#D4845A' : '#1e1e1e',
                                    transition: 'background 0.3s',
                                }}
                            />
                        ))}
                    </div>

                    {step === 1 ? (
                        <>
                            {/* Kind toggle */}
                            <div style={{ display: 'flex', gap: 7, marginBottom: 18 }}>
                                {(['use', 'learn'] as const).map((k) => (
                                    <button
                                        key={k}
                                        onClick={() => upd('kind', k)}
                                        style={{
                                            flex: 1,
                                            padding: '10px',
                                            borderRadius: 9,
                                            border: `1px solid ${form.kind === k ? '#D4845A' : '#1e1e1e'}`,
                                            background: form.kind === k ? 'rgba(212,132,90,0.06)' : '#151515',
                                            color: form.kind === k ? '#D4845A' : '#555',
                                            fontSize: 11,
                                            fontFamily: 'var(--sans)',
                                            cursor: 'pointer',
                                            transition: 'all 0.15s',
                                        }}
                                    >
                                        <div style={{ fontSize: 16, marginBottom: 3 }}>{k === 'use' ? '🔧' : '📖'}</div>
                                        {k === 'use' ? 'Share a Tool' : 'Write a Guide'}
                                    </button>
                                ))}
                            </div>
                            <Field label="Name" k="name" ph="Give it a clear, descriptive name" />
                            <Field label="Description" k="desc" ph="How does this help the firm?" multi />
                            <Select label="Category" k="type" opts={CATEGORIES.filter((c) => c !== 'All')} />
                            <Select label="Discipline" k="discipline" opts={DISCIPLINES} />
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                                <button
                                    onClick={() => setStep(2)}
                                    style={{
                                        padding: '10px 22px',
                                        borderRadius: 9,
                                        background: '#D4845A',
                                        border: 'none',
                                        color: '#111',
                                        fontSize: 12,
                                        fontWeight: 600,
                                        fontFamily: 'var(--sans)',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Next →
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Field label="Link" k="link" ph="Paste the URL to your resource" />
                            <TagInput tags={tags} setTags={setTags} />
                            <div style={{ marginTop: 14 }}>
                                <Field label="Prompt / Instructions" k="prompt" ph="Optional: paste the prompt text" multi />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                                <button
                                    onClick={() => setStep(1)}
                                    style={{
                                        padding: '10px 18px',
                                        borderRadius: 9,
                                        background: 'transparent',
                                        border: '1px solid #262626',
                                        color: '#777',
                                        fontSize: 12,
                                        fontFamily: 'var(--sans)',
                                        cursor: 'pointer',
                                    }}
                                >
                                    ← Back
                                </button>
                                <button
                                    onClick={onClose}
                                    style={{
                                        padding: '10px 22px',
                                        borderRadius: 9,
                                        background: '#8BC78A',
                                        border: 'none',
                                        color: '#111',
                                        fontSize: 12,
                                        fontWeight: 600,
                                        fontFamily: 'var(--sans)',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Submit ✓
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
