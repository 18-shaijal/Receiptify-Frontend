'use client';

import React, { useState } from 'react';
import axios from 'axios';
import FileUpload from '@/components/FileUpload';
import ValidationDisplay from '@/components/ValidationDisplay';
import ProgressIndicator from '@/components/ProgressIndicator';
import DownloadOptions from '@/components/DownloadOptions';
import Notification from '@/components/Notification';
import ReceiptPreview from '@/components/ReceiptPreview';

type Step = 'upload' | 'validate' | 'preview' | 'generate' | 'download';

interface ValidationResult {
    valid: boolean;
    missingInExcel: string[];
    extraInExcel: string[];
    warnings: string[];
}

interface NotificationState {
    message: string;
    type: 'success' | 'error' | 'warning';
}

const API_BASE = '/api';

export default function Home() {
    const [currentStep, setCurrentStep] = useState<Step>('upload');
    const [templateFile, setTemplateFile] = useState<File | null>(null);
    const [excelFile, setExcelFile] = useState<File | null>(null);
    const [templatePath, setTemplatePath] = useState<string>('');
    const [excelPath, setExcelPath] = useState<string>('');

    const [placeholders, setPlaceholders] = useState<string[]>([]);
    const [excelHeaders, setExcelHeaders] = useState<string[]>([]);
    const [rowCount, setRowCount] = useState<number>(0);
    const [validation, setValidation] = useState<ValidationResult | null>(null);

    const [generating, setGenerating] = useState(false);
    const [generationProgress, setGenerationProgress] = useState({ current: 0, total: 0 });

    const [sessionId, setSessionId] = useState<string>('');
    const [filesGenerated, setFilesGenerated] = useState<number>(0);
    const [previewData, setPreviewData] = useState<Record<string, any> | null>(null);

    const [notification, setNotification] = useState<NotificationState | null>(null);
    const [loading, setLoading] = useState(false);

    const showNotification = (message: string, type: 'success' | 'error' | 'warning') => {
        setNotification({ message, type });
    };

    const uploadFile = async (file: File, endpoint: string, currentSessionId?: string): Promise<string> => {
        const formData = new FormData();
        formData.append(endpoint === 'template' ? 'template' : 'excel', file);

        const sidToUse = currentSessionId || sessionId;
        if (sidToUse) {
            formData.append('sessionId', sidToUse);
        }

        const response = await axios.post(`${API_BASE}/upload/${endpoint}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        const newSessionId = response.data.data.sessionId;
        if (newSessionId && !sessionId) {
            setSessionId(newSessionId);
        }

        return newSessionId;
    };

    const handleValidate = async () => {
        if (!templateFile || !excelFile) {
            showNotification('Please upload both template and Excel files', 'error');
            return;
        }

        setLoading(true);
        try {
            // Upload files (sequentially to ensure sessionId is shared)
            const sId1 = await uploadFile(templateFile, 'template');
            const sId2 = await uploadFile(excelFile, 'excel', sId1);

            const activeSessionId = sId1 || sId2 || sessionId;

            // Validate
            const response = await axios.post(`${API_BASE}/validate`, {
                sessionId: activeSessionId
            });

            const data = response.data.data;
            setPlaceholders(data.placeholders);
            setExcelHeaders(data.excelHeaders);
            setRowCount(data.rowCount);
            setValidation(data.validation);
            setCurrentStep('validate');

            showNotification('Validation complete!', 'success');
        } catch (error: any) {
            console.error('Validation error:', error);
            showNotification(
                error.response?.data?.error || 'Failed to validate files',
                'error'
            );
        } finally {
            setLoading(false);
        }
    };

    const handlePreview = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_BASE}/preview`, {
                sessionId
            });

            const { sessionId: sid, previewPath, previewData: pData } = response.data.data;
            setPreviewData(pData);
            setSessionId(sid);

            // Download preview
            const filename = previewPath.split('/').pop();
            // window.open(`${API_BASE}/download/${sid}/${filename}`, '_blank');

            showNotification('Preview ready! Review the receipt below.', 'success');
            setCurrentStep('generate');
        } catch (error: any) {
            console.error('Preview error:', error);
            showNotification(
                error.response?.data?.error || 'Failed to generate preview',
                'error'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleGenerate = async () => {
        setGenerating(true);
        setGenerationProgress({ current: 0, total: rowCount });

        try {
            const response = await axios.post(`${API_BASE}/generate`, {
                sessionId
            });

            const data = response.data.data;
            setSessionId(data.sessionId);
            setFilesGenerated(data.totalGenerated);
            // Store downloadUrl for direct use if needed
            (window as any)._downloadUrl = data.downloadUrl;
            setGenerationProgress({ current: data.totalGenerated, total: rowCount });

            // Simulate progress for better UX
            for (let i = 0; i <= data.totalGenerated; i++) {
                await new Promise(resolve => setTimeout(resolve, 50));
                setGenerationProgress({ current: i, total: rowCount });
            }

            setGenerating(false);
            setCurrentStep('download');
            showNotification('All documents generated successfully! Click below to download.', 'success');
        } catch (error: any) {
            console.error('Generation error:', error);
            setGenerating(false);
            showNotification(
                error.response?.data?.error || 'Failed to generate documents',
                'error'
            );
        }
    };

    const handleDownloadZip = () => {
        const directUrl = (window as any)._downloadUrl;
        if (directUrl) {
            window.location.href = directUrl;
            showNotification('Starting cloud download...', 'success');
            return;
        }

        const link = document.createElement('a');
        link.href = `${API_BASE}/download/zip/${sessionId}`;
        link.setAttribute('download', `documents_${sessionId}.zip`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        showNotification('Downloading ZIP archive...', 'success');
    };

    const handleReset = () => {
        setCurrentStep('upload');
        setTemplateFile(null);
        setExcelFile(null);
        setTemplatePath('');
        setExcelPath('');
        setPlaceholders([]);
        setExcelHeaders([]);
        setRowCount(0);
        setValidation(null);
        setSessionId('');
        setFilesGenerated(0);
    };

    return (
        <>
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}

            <div className="container">
                <header className="text-center mb-4">
                    <h1 className="mb-2">📄 Receipt Generator</h1>
                    <p className="text-muted" style={{ fontSize: '1.125rem' }}>
                        Automate bulk document generation from Excel data and Word templates
                    </p>
                </header>

                {currentStep === 'upload' && (
                    <div className="card fade-in">
                        <h2 className="mb-3">Step 1: Upload Files</h2>

                        <div className="grid grid-cols-2">
                            <FileUpload
                                label="📑 Template File"
                                accept={[
                                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                                    'application/vnd.oasis.opendocument.text'
                                ]}
                                acceptLabel=".docx, .odt"
                                onFileSelected={setTemplateFile}
                                file={templateFile}
                            />

                            <FileUpload
                                label="📊 Excel Data"
                                accept={['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']}
                                acceptLabel=".xlsx"
                                onFileSelected={setExcelFile}
                                file={excelFile}
                            />
                        </div>

                        <div className="mt-4">
                            <button
                                onClick={handleValidate}
                                disabled={!templateFile || !excelFile || loading}
                                className="button button-primary"
                                style={{ width: '100%' }}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner" style={{ marginRight: '0.5rem' }} />
                                        Validating...
                                    </>
                                ) : (
                                    'Validate & Continue →'
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {currentStep === 'validate' && validation && (
                    <ValidationDisplay
                        placeholders={placeholders}
                        excelHeaders={excelHeaders}
                        rowCount={rowCount}
                        validation={validation}
                        onProceed={handlePreview}
                        onCancel={handleReset}
                    />
                )}

                {currentStep === 'generate' && !generating && (
                    <div className="card fade-in">
                        <h2 className="mb-3">Step 3: Generate Documents</h2>

                        <div className="alert alert-success mb-4">
                            <strong>✓ Preview Successful!</strong>
                            <p className="mt-1">
                                Ready to generate <strong>{rowCount}</strong> documents.
                            </p>
                        </div>

                        {previewData && (
                            <ReceiptPreview
                                data={previewData}
                                placeholders={placeholders}
                            />
                        )}

                        <p className="text-muted mb-4">
                            This will create documents in both DOCX and ODT formats for all {rowCount} rows in your Excel file.
                        </p>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={handleReset}
                                className="button button-outline"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleGenerate}
                                className="button button-primary"
                                style={{ flex: 1 }}
                            >
                                Generate All Documents
                            </button>
                        </div>
                    </div>
                )}

                {generating && (
                    <ProgressIndicator
                        current={generationProgress.current}
                        total={generationProgress.total}
                        status={`Generating document ${generationProgress.current} of ${generationProgress.total}...`}
                    />
                )}

                {currentStep === 'download' && (
                    <DownloadOptions
                        sessionId={sessionId}
                        filesGenerated={filesGenerated}
                        onDownloadZip={handleDownloadZip}
                        onReset={handleReset}
                    />
                )}

                <footer className="text-center mt-4" style={{
                    padding: '2rem 0',
                    borderTop: '1px solid var(--glass-border)'
                }}>
                    <p className="text-muted">
                        Built with Next.js, Express, and modern web technologies
                    </p>
                </footer>
            </div>
        </>
    );
}
