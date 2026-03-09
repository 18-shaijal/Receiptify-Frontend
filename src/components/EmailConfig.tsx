'use client';

import React from 'react';

interface EmailResult {
    row: number;
    email: string;
    status: 'sent' | 'failed';
    error?: string;
}

interface EmailConfigProps {
    excelHeaders: string[];
    rowCount: number;
    emailColumn: string;
    setEmailColumn: (col: string) => void;
    emailSubject: string;
    setEmailSubject: (val: string) => void;
    emailBody: string;
    setEmailBody: (val: string) => void;
    onSend: () => void;
    onCancel: () => void;
    onStop?: () => void;
    sending: boolean;
    sendProgress: { current: number; total: number };
    results: { totalSent: number; totalFailed: number; results: EmailResult[] } | null;
}

export default function EmailConfig({
    excelHeaders,
    rowCount,
    emailColumn,
    setEmailColumn,
    emailSubject,
    setEmailSubject,
    emailBody,
    setEmailBody,
    onSend,
    onCancel,
    onStop,
    sending,
    sendProgress,
    results,
}: EmailConfigProps) {

    const insertPlaceholder = (
        setter: (val: string) => void,
        currentValue: string,
        placeholder: string
    ) => {
        setter(`${currentValue}{{${placeholder}}}`);
    };

    return (
        <div className="card fade-in">
            <h2 className="mb-3">📧 Send Documents via Email</h2>

            {!results ? (
                <>
                    {/* Email Column Selector */}
                    <div className="mb-4">
                        <h3 className="mb-2" style={{ fontSize: '1rem' }}>
                            📬 Select Email Column
                        </h3>
                        <p className="text-muted mb-2" style={{ fontSize: '0.875rem' }}>
                            Choose which Excel column contains the recipient email addresses.
                        </p>
                        <select
                            className="input"
                            value={emailColumn}
                            onChange={(e) => setEmailColumn(e.target.value)}
                            style={{ cursor: 'pointer' }}
                        >
                            <option value="">-- Select email column --</option>
                            {excelHeaders.map((header) => (
                                <option key={header} value={header}>
                                    {header}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Email Subject */}
                    <div className="mb-4">
                        <h3 className="mb-2" style={{ fontSize: '1rem' }}>
                            ✉️ Email Subject
                        </h3>
                        <p className="text-muted mb-2" style={{ fontSize: '0.875rem' }}>
                            Use <code>{`{{PLACEHOLDER}}`}</code> to personalise the subject.
                        </p>
                        <input
                            type="text"
                            className="input mb-2"
                            value={emailSubject}
                            onChange={(e) => setEmailSubject(e.target.value)}
                            placeholder="e.g. Your Receipt — {{NAME}}"
                            style={{ width: '100%', fontSize: '1rem', padding: '0.75rem' }}
                        />
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {excelHeaders.map((header) => (
                                <button
                                    key={header}
                                    type="button"
                                    onClick={() =>
                                        insertPlaceholder(setEmailSubject, emailSubject, header)
                                    }
                                    className="card-interactive"
                                    style={{
                                        padding: '0.25rem 0.75rem',
                                        fontSize: '0.75rem',
                                        borderRadius: '20px',
                                        cursor: 'pointer',
                                        background: 'var(--glass-bg)',
                                        border: '1px solid var(--glass-border)',
                                    }}
                                >
                                    + {header}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Email Body */}
                    <div className="mb-4">
                        <h3 className="mb-2" style={{ fontSize: '1rem' }}>
                            📝 Email Body
                        </h3>
                        <p className="text-muted mb-2" style={{ fontSize: '0.875rem' }}>
                            Write your email body. Placeholders like{' '}
                            <code>{`{{PLACEHOLDER}}`}</code> will be replaced per recipient.
                        </p>
                        <textarea
                            className="input email-body-textarea"
                            value={emailBody}
                            onChange={(e) => setEmailBody(e.target.value)}
                            placeholder={`Dear {{NAME}},\n\nPlease find your document attached.\n\nBest regards`}
                            rows={6}
                        />
                        <div
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '0.5rem',
                                marginTop: '0.5rem',
                            }}
                        >
                            {excelHeaders.map((header) => (
                                <button
                                    key={header}
                                    type="button"
                                    onClick={() =>
                                        insertPlaceholder(setEmailBody, emailBody, header)
                                    }
                                    className="card-interactive"
                                    style={{
                                        padding: '0.25rem 0.75rem',
                                        fontSize: '0.75rem',
                                        borderRadius: '20px',
                                        cursor: 'pointer',
                                        background: 'var(--glass-bg)',
                                        border: '1px solid var(--glass-border)',
                                    }}
                                >
                                    + {header}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Info Banner */}
                    <div className="alert alert-warning mb-4">
                        <strong>⚠️ Heads up:</strong> This will send{' '}
                        <strong>{rowCount}</strong> individual emails, one per Excel row.
                        Make sure your SMTP credentials are configured on the server.
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button onClick={onCancel} className="button button-outline">
                            ← Back
                        </button>
                        <button
                            onClick={onSend}
                            disabled={!emailColumn || !emailSubject || sending}
                            className="button button-primary"
                            style={{ flex: 1 }}
                        >
                            {sending ? (
                                <>
                                    <span
                                        className="spinner"
                                        style={{ marginRight: '0.5rem' }}
                                    />
                                    Sending {sendProgress.current}/{sendProgress.total}...
                                </>
                            ) : (
                                `Send All Emails (${rowCount} recipients)`
                            )}
                        </button>
                    </div>

                    {/* Progress bar while sending */}
                    {sending && sendProgress.total > 0 && (
                        <div className="mt-3">
                            <div className="progress">
                                <div
                                    className="progress-bar"
                                    style={{
                                        width: `${(sendProgress.current / sendProgress.total) * 100}%`,
                                    }}
                                />
                            </div>
                            <p
                                className="text-muted mt-1"
                                style={{ fontSize: '0.875rem', textAlign: 'center' }}
                            >
                                Sending email {sendProgress.current} of {sendProgress.total}…
                            </p>
                            {onStop && (
                                <button
                                    onClick={onStop}
                                    className="button button-danger mt-3"
                                    style={{ width: '100%', background: 'var(--danger)', color: 'white' }}
                                >
                                    🚫 Stop Sending
                                </button>
                            )}
                        </div>
                    )}
                </>
            ) : (
                /* Results Display */
                <>
                    <div
                        className={`alert ${results.totalFailed === 0 ? 'alert-success' : 'alert-warning'
                            } mb-4`}
                    >
                        <strong>
                            {results.totalFailed === 0 ? '✅ All Sent!' : '⚠️ Partially Sent'}
                        </strong>
                        <p className="mt-1">
                            <strong>{results.totalSent}</strong> sent successfully
                            {results.totalFailed > 0 && (
                                <>
                                    , <strong style={{ color: 'var(--danger)' }}>{results.totalFailed}</strong> failed
                                </>
                            )}
                        </p>
                    </div>

                    <div className="email-results-table-container mb-4">
                        <table className="email-results-table">
                            <thead>
                                <tr>
                                    <th>Row</th>
                                    <th>Email</th>
                                    <th>Status</th>
                                    <th>Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.results.map((r) => (
                                    <tr key={r.row}>
                                        <td>{r.row}</td>
                                        <td>{r.email}</td>
                                        <td>
                                            <span
                                                className={`badge ${r.status === 'sent'
                                                    ? 'badge-success'
                                                    : 'badge-danger'
                                                    }`}
                                            >
                                                {r.status === 'sent' ? '✓ Sent' : '✗ Failed'}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            {r.error || '—'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <button onClick={onCancel} className="button button-primary" style={{ width: '100%' }}>
                        ← Back to Download
                    </button>
                </>
            )}
        </div>
    );
}
