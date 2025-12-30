import { useState } from 'react';
import { FiCheckCircle, FiCopy, FiDownload, FiX, FiFile } from 'react-icons/fi';
import './ConversionResults.css';

function ConversionResults({ results, formats, onExport, onClear, sourceDialect, targetDialect }) {
    const [copiedIndex, setCopiedIndex] = useState(null);
    const [showExportDropdown, setShowExportDropdown] = useState(false);

    const handleCopy = async (text, index) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedIndex(index);
            setTimeout(() => setCopiedIndex(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleCopyAll = async () => {
        const allQueries = results.results
            .filter(r => r.status === 'success')
            .map(r => r.converted)
            .join('\n\n');
        try {
            await navigator.clipboard.writeText(allQueries);
            setCopiedIndex('all');
            setTimeout(() => setCopiedIndex(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const formatConfig = {
        'PDF': { icon: '📄', ext: '.pdf', color: '#ef4444' },
        'Word Document': { icon: '📝', ext: '.docx', color: '#2563eb' },
        'Excel': { icon: '📊', ext: '.xlsx', color: '#16a34a' },
        'SQL File': { icon: '💾', ext: '.sql', color: '#8b5cf6' },
    };

    const successfulResults = results.results.filter(r => r.status === 'success');
    const isBulkMode = results.total_count > 1;

    return (
        <div className="output-section">
            {/* Section Header */}
            <div className="section-header">
                <span className="section-number">3</span>
                <h2 className="section-label">Output / Result Section</h2>
            </div>

            {/* Results Card */}
            <div className="results-card">
                {/* Results Header */}
                <div className="results-header">
                    <div className="results-header-left">
                        <div className="results-icon">
                            <FiCheckCircle />
                        </div>
                        <div className="results-title-section">
                            <h3 className="results-title">
                                Converted {results.success_count} SQL Query{results.success_count !== 1 ? 'ies' : ''}
                            </h3>
                            <p className="results-subtitle">
                                Successfully converted from {sourceDialect} to {targetDialect}
                            </p>
                        </div>
                    </div>
                    
                    <div className="results-actions">
                        <button 
                            className={`action-btn ${copiedIndex === 'all' ? 'copied' : ''}`}
                            onClick={handleCopyAll}
                        >
                            <FiCopy />
                            <span>{copiedIndex === 'all' ? 'Copied!' : 'Copy'}</span>
                        </button>
                        
                        <div className="dropdown-container">
                            <button 
                                className="action-btn"
                                onClick={() => setShowExportDropdown(!showExportDropdown)}
                            >
                                <FiDownload />
                                <span>Download</span>
                            </button>
                            
                            {showExportDropdown && (
                                <div className="export-dropdown">
                                    <p className="dropdown-title">Export as</p>
                                    <div className="format-grid">
                                        {formats.map((format) => {
                                            const config = formatConfig[format] || { icon: '📄', ext: '.txt', color: '#6b7280' };
                                            return (
                                                <button
                                                    key={format}
                                                    className="format-btn"
                                                    onClick={() => {
                                                        onExport(format);
                                                        setShowExportDropdown(false);
                                                    }}
                                                >
                                                    <span className="format-icon">{config.icon}</span>
                                                    <span className="format-ext">{config.ext}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <button 
                                        className="download-all-btn"
                                        onClick={() => {
                                            formats.forEach(format => onExport(format));
                                            setShowExportDropdown(false);
                                        }}
                                    >
                                        Download All
                                    </button>
                                </div>
                            )}
                        </div>
                        
                        <button className="action-btn clear-btn" onClick={onClear}>
                            <FiX />
                            <span>Clear</span>
                        </button>
                    </div>
                </div>

                {/* Converted Queries Display */}
                <div className="queries-container">
                    {successfulResults.map((result, index) => (
                        <div key={index} className="query-row">
                            <span className="query-line-number">{index + 1}</span>
                            <div className="query-content">
                                <code className="query-code">
                                    {formatSqlQuery(result.converted)}
                                </code>
                            </div>
                            <button 
                                className={`copy-inline-btn ${copiedIndex === index ? 'copied' : ''}`}
                                onClick={() => handleCopy(result.converted, index)}
                                title="Copy this query"
                            >
                                <FiCopy />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Bulk Export Section - Shows when multiple queries */}
                {isBulkMode && (
                    <div className="bulk-export-section">
                        <div className="bulk-export-header">
                            <FiFile className="bulk-icon" />
                            <div>
                                <h4 className="bulk-title">Bulk Export Available</h4>
                                <p className="bulk-subtitle">{results.total_count} queries ready for export</p>
                            </div>
                        </div>
                        <div className="bulk-format-options">
                            {formats.map((format) => {
                                const config = formatConfig[format] || { icon: '📄', ext: '.txt', color: '#6b7280' };
                                return (
                                    <button
                                        key={format}
                                        className="bulk-format-btn"
                                        onClick={() => onExport(format)}
                                        style={{ '--accent-color': config.color }}
                                    >
                                        <span className="bulk-format-icon">{config.icon}</span>
                                        <span className="bulk-format-ext">{config.ext}</span>
                                    </button>
                                );
                            })}
                        </div>
                        <button 
                            className="bulk-download-all"
                            onClick={() => formats.forEach(format => onExport(format))}
                        >
                            <FiDownload />
                            Download All Formats
                        </button>
                    </div>
                )}

                {/* Error Results */}
                {results.error_count > 0 && (
                    <div className="error-summary">
                        <p className="error-text">
                            ⚠️ {results.error_count} query{results.error_count !== 1 ? 'ies' : ''} failed to convert
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

// Helper function to format SQL with syntax highlighting
function formatSqlQuery(sql) {
    if (!sql) return null;
    
    // Keywords to highlight
    const keywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'INSERT', 'UPDATE', 'DELETE', 'INTO', 'VALUES', 'SET', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'ON', 'AS', 'ORDER', 'BY', 'GROUP', 'HAVING', 'LIMIT', 'OFFSET', 'CREATE', 'TABLE', 'DROP', 'ALTER', 'INDEX', 'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'NOT', 'NULL', 'DEFAULT', 'UNIQUE', 'CHECK', 'CONSTRAINT'];
    
    // Split by spaces while preserving the spaces
    const parts = sql.split(/(\s+)/);
    
    return parts.map((part, i) => {
        const upperPart = part.toUpperCase();
        if (keywords.includes(upperPart)) {
            return <span key={i} className="sql-keyword">{part}</span>;
        }
        if (part === '*') {
            return <span key={i} className="sql-operator">{part}</span>;
        }
        if (part === '=' || part === '>' || part === '<' || part === '!=' || part === '>=' || part === '<=') {
            return <span key={i} className="sql-operator">{part}</span>;
        }
        if (/^\d+$/.test(part)) {
            return <span key={i} className="sql-number">{part}</span>;
        }
        if (part.startsWith("'") || part.startsWith('"')) {
            return <span key={i} className="sql-string">{part}</span>;
        }
        return part;
    });
}

export default ConversionResults;
