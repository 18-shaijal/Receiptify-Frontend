'use client';

import React from 'react';

interface ProgressIndicatorProps {
    current: number;
    total: number;
    status: string;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
    current,
    total,
    status
}) => {
    const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

    return (
        <div className="card fade-in">
            <h2 className="mb-3">⚙️ Generating Documents...</h2>

            <div className="mb-3">
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.75rem'
                }}>
                    <span className="text-muted">{status}</span>
                    <span style={{
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        color: 'var(--primary-light)'
                    }}>
                        {percentage}%
                    </span>
                </div>

                <div className="progress">
                    <div
                        className="progress-bar"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>

            <p className="text-muted text-center">
                Processing {current} of {total} documents
            </p>

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '2rem'
            }}>
                <div className="spinner" style={{
                    width: '3rem',
                    height: '3rem',
                    borderWidth: '4px'
                }} />
            </div>
        </div>
    );
};

export default ProgressIndicator;
