import { FiCheckCircle, FiXCircle, FiDownload } from 'react-icons/fi';
import './ConversionResults.css';

function ConversionResults({ results, formats, onExport }) {

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

                    return (
                        <div
                            key={index}
                            className={`result-item ${isSuccess ? 'success' : 'error'}`}
                        >
                            <div className="result-header-simple">
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
                                {!isSuccess && (
                                    <div className="error-message-inline">{result.notes}</div>
                                )}
                            </div>
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
