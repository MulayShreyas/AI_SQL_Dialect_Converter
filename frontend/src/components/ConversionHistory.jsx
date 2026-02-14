import { useState, useEffect } from 'react';
import { FiX, FiClock, FiTrash2, FiCopy, FiArrowRight, FiRefreshCw } from 'react-icons/fi';
import { apiService } from '../services/api';
import { toast } from 'react-toastify';
import './ConversionHistory.css';

function ConversionHistory({ isOpen, onClose, onLoadConversion }) {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        if (isOpen) {
            loadHistory();
        }
    }, [isOpen]);

    const loadHistory = async () => {
        setLoading(true);
        try {
            const data = await apiService.getConversionHistory();
            setHistory(data.conversions);
            setTotal(data.total);
        } catch (error) {
            console.error('Failed to load history:', error);
            toast.error('Failed to load conversion history');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (conversionId) => {
        try {
            await apiService.deleteConversion(conversionId);
            setHistory(history.filter(h => h.conversion_id !== conversionId));
            setTotal(total - 1);
            toast.success('Conversion deleted');
        } catch (error) {
            toast.error('Failed to delete conversion');
        }
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard');
    };

    const handleLoad = (conversion) => {
        if (onLoadConversion) {
            onLoadConversion(conversion);
        }
        onClose();
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const truncateSQL = (sql, maxLength = 100) => {
        if (!sql) return '';
        return sql.length > maxLength ? sql.substring(0, maxLength) + '...' : sql;
    };

    if (!isOpen) return null;

    return (
        <div className="history-modal-overlay" onClick={onClose}>
            <div className="history-modal" onClick={(e) => e.stopPropagation()}>
                <div className="history-header">
                    <div className="history-title">
                        <FiClock />
                        <h2>Conversion History</h2>
                        <span className="history-count">{total} conversions</span>
                    </div>
                    <div className="history-actions">
                        <button className="history-refresh" onClick={loadHistory} title="Refresh">
                            <FiRefreshCw className={loading ? 'spinning' : ''} />
                        </button>
                        <button className="history-close" onClick={onClose}>
                            <FiX size={24} />
                        </button>
                    </div>
                </div>

                <div className="history-content">
                    {loading ? (
                        <div className="history-loading">
                            <div className="history-spinner"></div>
                            <p>Loading history...</p>
                        </div>
                    ) : history.length === 0 ? (
                        <div className="history-empty">
                            <FiClock size={48} />
                            <h3>No conversions yet</h3>
                            <p>Your saved conversions will appear here</p>
                        </div>
                    ) : (
                        <div className="history-list">
                            {history.map((item) => (
                                <div key={item.conversion_id} className="history-item">
                                    <div className="history-item-header">
                                        <div className="history-dialects">
                                            <span className="dialect-badge source">{item.source_dialect}</span>
                                            <FiArrowRight />
                                            <span className="dialect-badge target">{item.target_dialect}</span>
                                        </div>
                                        <div className="history-item-meta">
                                            <span className={`status-badge ${item.conversion_status.toLowerCase()}`}>
                                                {item.conversion_status}
                                            </span>
                                            <span className="history-date">{formatDate(item.created_at)}</span>
                                        </div>
                                    </div>
                                    
                                    {item.input_query && (
                                        <div className="history-sql-preview">
                                            <div className="sql-section">
                                                <span className="sql-label">Input:</span>
                                                <code>{truncateSQL(item.input_query)}</code>
                                            </div>
                                            {item.output_query && (
                                                <div className="sql-section">
                                                    <span className="sql-label">Output:</span>
                                                    <code>{truncateSQL(item.output_query)}</code>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="history-item-actions">
                                        {item.output_query && (
                                            <button 
                                                className="history-action-btn copy"
                                                onClick={() => handleCopy(item.output_query)}
                                                title="Copy output"
                                            >
                                                <FiCopy />
                                                Copy
                                            </button>
                                        )}
                                        <button 
                                            className="history-action-btn load"
                                            onClick={() => handleLoad(item)}
                                            title="Load conversion"
                                        >
                                            <FiRefreshCw />
                                            Load
                                        </button>
                                        <button 
                                            className="history-action-btn delete"
                                            onClick={() => handleDelete(item.conversion_id)}
                                            title="Delete"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ConversionHistory;
