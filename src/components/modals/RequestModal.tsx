import React from 'react';
import { useAtom } from 'jotai';
import { requestsAtom, showReqAtom } from '../../atoms/modalAtoms';


export const RequestModal: React.FC = () => {
    const [requests, setRequests] = useAtom(requestsAtom);
    const [, setShowReq] = useAtom(showReqAtom);
    const onClose = () => setShowReq(false);

    const vote = (id: number) =>
        setRequests(requests.map((r) => (r.id === id ? { ...r, votes: r.votes + 1 } : r)));

    const sorted = [...requests].sort((a, b) => b.votes - a.votes);

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
                <div style={{ height: 3, background: 'linear-gradient(90deg,#6AADCF,#B494D0)' }} />
                <div style={{ padding: '24px 28px 28px' }}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 18,
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
                            Requests ({requests.length})
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
                    <p
                        style={{
                            fontSize: 12.5,
                            color: '#555',
                            lineHeight: 1.55,
                            margin: '0 0 18px',
                            fontFamily: 'var(--sans)',
                        }}
                    >
                        Vote on resources you'd like someone to create. The most-requested items get prioritized.
                    </p>
                    {sorted.map((r) => (
                        <div
                            key={r.id}
                            style={{
                                display: 'flex',
                                gap: 12,
                                alignItems: 'center',
                                background: '#161616',
                                borderRadius: 10,
                                padding: '12px 14px',
                                border: '1px solid #1e1e1e',
                                marginBottom: 6,
                            }}
                        >
                            <button
                                onClick={() => vote(r.id)}
                                style={{
                                    background: '#1a1a1a',
                                    border: '1px solid #262626',
                                    borderRadius: 6,
                                    padding: '4px 8px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    minWidth: 36,
                                    flexShrink: 0,
                                }}
                            >
                                <svg
                                    width="10"
                                    height="10"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#6AADCF"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                >
                                    <polyline points="18 15 12 9 6 15" />
                                </svg>
                                <span
                                    style={{
                                        fontSize: 11,
                                        color: '#6AADCF',
                                        fontFamily: 'var(--mono)',
                                        marginTop: 1,
                                    }}
                                >
                                    {r.votes}
                                </span>
                            </button>
                            <div style={{ flex: 1 }}>
                                <div
                                    style={{
                                        fontSize: 13,
                                        color: '#ccc',
                                        fontFamily: 'var(--sans)',
                                        fontWeight: 500,
                                        marginBottom: 2,
                                    }}
                                >
                                    {r.title}
                                </div>
                                <div style={{ fontSize: 10.5, color: '#555', fontFamily: 'var(--sans)' }}>
                                    {r.author} · {r.office}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
