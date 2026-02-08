'use client';

import React, { useEffect } from 'react';

interface NotificationProps {
    message: string;
    type: 'success' | 'error' | 'warning';
    onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const icons = {
        success: '✓',
        error: '✗',
        warning: '⚠'
    };

    const colors = {
        success: 'var(--success)',
        error: 'var(--danger)',
        warning: 'var(--warning)'
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: '2rem',
                right: '2rem',
                maxWidth: '400px',
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(12px)',
                border: `2px solid ${colors[type]}`,
                borderRadius: 'var(--radius-lg)',
                padding: '1rem 1.5rem',
                boxShadow: 'var(--shadow-xl)',
                zIndex: 1000,
                animation: 'slideInRight 0.3s ease-out',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
            }}
        >
            <span style={{
                fontSize: '1.5rem',
                color: colors[type]
            }}>
                {icons[type]}
            </span>
            <p style={{
                flex: 1,
                margin: 0,
                color: 'var(--text-primary)'
            }}>
                {message}
            </p>
            <button
                onClick={onClose}
                style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: '1.5rem',
                    padding: '0',
                    lineHeight: 1
                }}
            >
                ×
            </button>
            <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
        </div>
    );
};

export default Notification;
