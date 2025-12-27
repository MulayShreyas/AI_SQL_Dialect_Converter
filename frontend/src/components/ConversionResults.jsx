import { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiDownload, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import Prism from 'prismjs';
import './ConversionResults.css';

function ConversionResults({ results, formats, onExport }) {
    const [expandedIndex, setExpandedIndex] = useState(-1);

    const toggleResult = (index) => {
        setExpandedIndex(expandedIndex === index ? -1 : index);
    };

    return (
        <div className="conversion-results">
            <h3 className="results-title">🎯 Conversion Results</h3>

            {/* Summary Metrics */}
            <div className="metrics-grid">
                <div className="metric-card">
                    <div className="metric-value">{results.total_count}</div>
                    <div className="metric-label">Total Statements</div>
                </div>

                <div className="metric-card">
                    <div className="metric-value success">{results.success_count}</div>
                    <div className="metric-label">Converted</div>
                </div>

                <div className="metric-card">
                    <div className="metric-value error">{results.error_count}</div>
                    <div className="metric-label">Errors</div>
                </div>
            </div>

            {/* Results List */}
            <div className="results-list">
                {results.results.map((result, index) => {
                    const isSuccess = result.status === 'success';
                    const isExpanded = expandedIndex === index;

                    return (
                        <div
                            key={index}
                            className={`result-item ${isSuccess ? 'success' : 'error'}`}
                        >
                            <button
                                className="result-header"
                                onClick={() => toggleResult(index)}
                            >
                                <div className="result-header-left">
                                    {isSuccess ? (
                                        <FiCheckCircle className="status-icon success-icon" />
                                    ) : (
                                        <FiXCircle className="status-icon error-icon" />
                                    )}
                                    <span className="result-number">
                                        Statement {index + 1} - {isSuccess ? 'Success' : 'Error'}
                                    </span>
                                </div>
                                <span className="expand-icon">
                                    {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                                </span>
                            </button>

                            {isExpanded && (
                                <div className="result-content">
                                    <div className="result-grid">
                                        {/* Original SQL */}
                                        <div className="result-column">
                                            <h4 className="column-title">Original SQL</h4>
                                            <pre className="sql-code">
                                                <code
                                                    className="language-sql"
                                                    dangerouslySetInnerHTML={{
                                                        __html: Prism.highlight(
                                                            result.original,
                                                            Prism.languages.sql,
                                                            'sql'
                                                        ),
                                                    }}
                                                />
                                            </pre>
                                        </div>

                                        {/* Converted SQL or Error */}
                                        <div className="result-column">
                                            {isSuccess ? (
                                                <>
                                                    <h4 className="column-title">Converted SQL</h4>
                                                    <pre className="sql-code">
                                                        <code
                                                            className="language-sql"
                                                            dangerouslySetInnerHTML={{
                                                                __html: Prism.highlight(
                                                                    result.converted,
                                                                    Prism.languages.sql,
                                                                    'sql'
                                                                ),
                                                            }}
                                                        />
                                                    </pre>
                                                </>
                                            ) : (
                                                <>
                                                    <h4 className="column-title">Error</h4>
                                                    <div className="error-message">{result.notes}</div>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Notes */}
                                    {isSuccess && result.notes && (
                                        <div className="result-notes">
                                            <strong>📝 Notes:</strong> {result.notes}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Export Section */}
            <div className="export-section">
                <h4 className="export-title">📥 Download Results</h4>
                <div className="export-buttons">
                    {formats.map((format) => {
                        const icons = {
                            'PDF': '📄',
                            'Word Document': '📝',
                            'Excel': '📊',
                            'SQL File': '💾',
                        };

                        return (
                            <button
                                key={format}
                                className="export-button"
                                onClick={() => onExport(format)}
                            >
                                <span className="export-icon">{icons[format]}</span>
                                {format}
                                <FiDownload className="download-icon" />
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default ConversionResults;
