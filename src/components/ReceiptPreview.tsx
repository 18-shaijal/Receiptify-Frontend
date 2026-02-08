import React from 'react';

interface ReceiptPreviewProps {
    data: Record<string, any>;
    placeholders: string[];
}

const ReceiptPreview: React.FC<ReceiptPreviewProps> = ({ data, placeholders }) => {
    return (
        <div className="receipt-container fade-in">
            <div className="receipt-paper">
                <div className="receipt-header">
                    <h2>RECEIPT PREVIEW</h2>
                    <div className="receipt-divider"></div>
                </div>

                <div className="receipt-content">
                    {placeholders.map((placeholder) => {
                        const value = data[placeholder.toUpperCase()] || data[placeholder] || '---';
                        return (
                            <div key={placeholder} className="receipt-row">
                                <span className="receipt-label">{placeholder}:</span>
                                <span className="receipt-value">{String(value)}</span>
                            </div>
                        );
                    })}
                </div>

                <div className="receipt-footer">
                    <div className="receipt-divider"></div>
                    <p>Thank you for your business!</p>
                </div>
            </div>
        </div>
    );
};

export default ReceiptPreview;
