'use client';

import React from 'react';

interface DownloadOptionsProps {
    sessionId: string;
    filesGenerated: number;
    onDownloadZip: () => void;
    onReset: () => void;
}

const DownloadOptions: React.FC<DownloadOptionsProps> = ({
    sessionId,
    filesGenerated,
    onDownloadZip,
    onReset
}) => {
    return (
        <div className="card fade-in">
            <h2 className="mb-3">✓ Documents Generated Successfully!</h2>

            <div className="alert alert-success mb-4">
                <strong>🎉 Generation Complete!</strong>
                <p className="mt-1">
                    Successfully generated <strong>{filesGenerated}</strong> documents in both DOCX and ODT formats.
                </p>
            </div>

            <div style={{
                background: 'var(--bg-secondary)',
                padding: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                marginBottom: '2rem'
            }}>
                <h3 className="mb-3">📦 Download Options</h3>

                <div style={{
                    display: 'grid',
                    gap: '1rem'
                }}>
                    <div style={{
                        padding: '1.25rem',
                        background: 'var(--bg-tertiary)',
                        borderRadius: 'var(--radius-md)',
                        border: '2px solid var(--primary)',
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <div>
                                <h4 style={{ marginBottom: '0.5rem' }}>📁 Complete Archive</h4>
                                <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                                    Download ZIP with all documents in DOCX and ODT formats
                                </p>
                            </div>
                            <button
                                onClick={onDownloadZip}
                                className="button button-primary"
                                style={{ marginLeft: '1rem' }}
                            >
                                Download ZIP
                            </button>
                        </div>
                    </div>

                    <div style={{
                        padding: '1.25rem',
                        background: 'var(--bg-tertiary)',
                        borderRadius: 'var(--radius-md)',
                    }}>
                        <h4 style={{ marginBottom: '0.75rem' }}>📋 What's Included:</h4>
                        <ul style={{
                            listStyle: 'none',
                            paddingLeft: 0,
                            color: 'var(--text-secondary)'
                        }}>
                            <li style={{ marginBottom: '0.5rem' }}>
                                ✓ <strong>{filesGenerated}</strong> DOCX files in <code>/docx/</code> folder
                            </li>
                            <li>
                                ✓ <strong>{filesGenerated}</strong> ODT files in <code>/odt/</code> folder
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div style={{
                display: 'flex',
                gap: '1rem'
            }}>
                <button
                    onClick={onReset}
                    className="button button-outline"
                    style={{ flex: 1 }}
                >
                    Generate More Documents
                </button>
            </div>
        </div>
    );
};

export default DownloadOptions;
