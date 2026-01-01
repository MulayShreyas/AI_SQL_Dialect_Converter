import { useState } from 'react';
import { FiCopy, FiDownload, FiX } from 'react-icons/fi';
import './ConversionResults.css';

function ConversionResults({ results, formats, onExport, onClear, sourceDialect, targetDialect }) {
    const [copiedIndex, setCopiedIndex] = useState(null);
    const [showExportDropdown, setShowExportDropdown] = useState(false);
    const [selectedFormat, setSelectedFormat] = useState(null);

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

    const handleDownload = () => {
        if (selectedFormat) {
            onExport(selectedFormat);
            setShowExportDropdown(false);
            setSelectedFormat(null);
        }
    };

    // Format configuration matching the reference image exactly
    const formatConfig = {
        'PDF': { 
            icon: (
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="4" y="2" width="16" height="20" rx="2" fill="#EF4444"/>
                    <path d="M8 6h8M8 10h8M8 14h5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
            ), 
            ext: '.pdf', 
            color: '#EF4444',
            bgColor: '#FEF2F2'
        },
        'Word Document': { 
            icon: (
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="4" y="2" width="16" height="20" rx="2" fill="#2563EB"/>
                    <path d="M8 6h8M8 10h8M8 14h8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
            ), 
            ext: '.docx', 
            color: '#2563EB',
            bgColor: '#EFF6FF'
        },
        'Excel': { 
            icon: (
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="4" y="2" width="16" height="20" rx="2" fill="#16A34A"/>
                    <path d="M8 8h8M8 12h8M8 16h8M12 8v12" stroke="white" strokeWidth="1.5"/>
                </svg>
            ), 
            ext: '.xlsx', 
            color: '#16A34A',
            bgColor: '#F0FDF4'
        },
        'SQL File': { 
            icon: (
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="4" y="2" width="16" height="20" rx="2" fill="#8B5CF6"/>
                    <path d="M8 8h8M8 12h8M8 16h5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
            ), 
            ext: '.sql', 
            color: '#8B5CF6',
            bgColor: '#FAF5FF'
        },
    };

    const successfulResults = results.results.filter(r => r.status === 'success');

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
                            <span className="results-emoji">✏️</span>
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
                                onClick={() => {
                                    setShowExportDropdown(!showExportDropdown);
                                    if (showExportDropdown) {
                                        setSelectedFormat(null);
                                    }
                                }}
                            >
                                <FiDownload />
                                <span>Download</span>
                            </button>
                            
                            {showExportDropdown && (
                                <div className="export-dropdown">
                                    <p className="dropdown-title">Export as</p>
                                    <div className="format-grid">
                                        {formats.map((format) => {
                                            const config = formatConfig[format] || { 
                                                icon: (
                                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <rect x="4" y="2" width="16" height="20" rx="2" fill="#6B7280"/>
                                                    </svg>
                                                ), 
                                                ext: '.txt', 
                                                color: '#6B7280',
                                                bgColor: '#F9FAFB'
                                            };
                                            return (
                                                <button
                                                    key={format}
                                                    className={`format-btn ${selectedFormat === format ? 'selected' : ''}`}
                                                    onClick={() => setSelectedFormat(format)}
                                                >
                                                    <div className="format-icon-wrapper">
                                                        {config.icon}
                                                    </div>
                                                    <span className="format-ext">{config.ext}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <button 
                                        className={`download-btn ${!selectedFormat ? 'disabled' : ''}`}
                                        onClick={handleDownload}
                                        disabled={!selectedFormat}
                                    >
                                        <FiDownload />
                                        <span>Download {selectedFormat && formatConfig[selectedFormat]?.ext}</span>
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
