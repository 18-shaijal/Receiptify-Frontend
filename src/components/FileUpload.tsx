'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import styles from './FileUpload.module.css';

interface FileUploadProps {
    label: string;
    accept: string[];
    acceptLabel: string;
    onFileSelected: (file: File) => void;
    file: File | null;
    error?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
    label,
    accept,
    acceptLabel,
    onFileSelected,
    file,
    error
}) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            onFileSelected(acceptedFiles[0]);
        }
    }, [onFileSelected]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: accept.reduce((acc, ext) => ({ ...acc, [ext]: [] }), {}),
        multiple: false,
        maxSize: 10 * 1024 * 1024 // 10MB
    });

    const removeFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        onFileSelected(null as any);
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <div>
            <h3 className="mb-2">{label}</h3>

            {!file ? (
                <div
                    {...getRootProps()}
                    className={`${styles.dropzone} ${isDragActive ? styles.dropzoneActive : ''}`}
                >
                    <input {...getInputProps()} />
                    <div className={styles.dropzoneIcon}>📁</div>
                    <p className={styles.dropzoneText}>
                        {isDragActive ? 'Drop file here...' : 'Drag & drop file here'}
                    </p>
                    <p className={styles.dropzoneSubtext}>
                        or click to browse | Max size: 10MB
                    </p>
                    <p className={styles.dropzoneSubtext}>
                        Accepted: <code>{acceptLabel}</code>
                    </p>
                </div>
            ) : (
                <div className={styles.fileInfo}>
                    <div className={styles.fileDetails}>
                        <span className={styles.fileIcon}>✓</span>
                        <div>
                            <div className={styles.fileName}>{file.name}</div>
                            <div className={styles.fileSize}>{formatFileSize(file.size)}</div>
                        </div>
                    </div>
                    <button
                        onClick={removeFile}
                        className={styles.removeButton}
                        title="Remove file"
                    >
                        ×
                    </button>
                </div>
            )}

            {error && (
                <div className={styles.error}>{error}</div>
            )}
        </div>
    );
};

export default FileUpload;
