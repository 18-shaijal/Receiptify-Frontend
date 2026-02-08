'use client';

import React from 'react';

interface ValidationResult {
    valid: boolean;
    missingInExcel: string[];
    extraInExcel: string[];
    warnings: string[];
}

interface ValidationDisplayProps {
    placeholders: string[];
    excelHeaders: string[];
    rowCount: number;
    validation: ValidationResult;
    onProceed: () => void;
    onCancel: () => void;
}

const ValidationDisplay: React.FC<ValidationDisplayProps> = ({
    placeholders,
    excelHeaders,
    rowCount,
    validation,
    onProceed,
    onCancel
}) => {
    return (
        <div className="card fade-in">
            <h2 className="mb-3">📋 Validation Results</h2>

            <div className="grid grid-cols-2 mb-4">
                <div>
                    <h3 className="mb-2">Template Placeholders</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {placeholders.map((p, i) => (
                            <span key={i} className="badge badge-primary">
                                {p}
                            </span>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="mb-2">Excel Columns</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {excelHeaders.map((h, i) => (
                            <span key={i} className="badge badge-success">
                                {h}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mb-4">
                <p className="text-muted">
                    Total rows to process: <strong style={{ color: 'var(--primary-light)' }}>{rowCount}</strong>
                </p>
            </div>

            {validation.missingInExcel.length > 0 && (
                <div className="alert alert-danger mb-3">
                    <strong>⚠️ Missing in Excel:</strong>
                    <p className="mt-1">
                        The following placeholders are in the template but not in Excel: {' '}
                        {validation.missingInExcel.map((p, i) => (
                            <code key={i} style={{
                                background: 'var(--bg-tertiary)',
                                padding: '0.125rem 0.5rem',
                                borderRadius: 'var(--radius-sm)',
                                marginRight: '0.5rem'
                            }}>
                                {p}
                            </code>
                        ))}
                    </p>
                    <p className="text-muted mt-2">
                        These placeholders will remain empty in generated documents.
                    </p>
                </div>
            )}

            {validation.extraInExcel.length > 0 && (
                <div className="alert alert-warning mb-3">
                    <strong>ℹ️ Extra in Excel:</strong>
                    <p className="mt-1">
                        The following columns are in Excel but not used in template: {' '}
                        {validation.extraInExcel.map((p, i) => (
                            <code key={i} style={{
                                background: 'var(--bg-tertiary)',
                                padding: '0.125rem 0.5rem',
                                borderRadius: 'var(--radius-sm)',
                                marginRight: '0.5rem'
                            }}>
                                {p}
                            </code>
                        ))}
                    </p>
                    <p className="text-muted mt-2">
                        These columns will be ignored during generation.
                    </p>
                </div>
            )}

            {validation.valid && validation.extraInExcel.length === 0 && (
                <div className="alert alert-success mb-3">
                    <strong>✓ Perfect Match!</strong>
                    <p className="mt-1">
                        All template placeholders match Excel columns exactly.
                    </p>
                </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button
                    onClick={onCancel}
                    className="button button-outline"
                >
                    Cancel
                </button>
                <button
                    onClick={onProceed}
                    className="button button-primary"
                    style={{ flex: 1 }}
                >
                    {validation.valid ? 'Proceed to Preview' : 'Continue Anyway'}
                </button>
            </div>
        </div>
    );
};

export default ValidationDisplay;
