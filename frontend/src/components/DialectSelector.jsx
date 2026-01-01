import { FiChevronRight, FiArrowRight } from 'react-icons/fi';
import './DialectSelector.css';

// Database brand icons - Using actual database brand imagery
const dialectIcons = {
    'SQL Server': (
        <div className="db-icon sql-server-icon">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="4" fill="#FFF8E7"/>
                <path d="M8 8h16v4H8z" fill="#E8A838"/>
                <path d="M8 14h16v4H8z" fill="#E8A838"/>
                <path d="M8 20h16v4H8z" fill="#E8A838"/>
                <path d="M10 10h2v2h-2zM14 10h8v2h-8z" fill="#fff"/>
                <path d="M10 16h2v2h-2zM14 16h8v2h-8z" fill="#fff"/>
                <path d="M10 22h2v2h-2zM14 22h8v2h-8z" fill="#fff"/>
            </svg>
        </div>
    ),
    'MySQL': (
        <div className="db-icon mysql-icon">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="4" fill="#E8F4F8"/>
                <path d="M16 6c-5.5 0-10 2.5-10 5.5v9c0 3 4.5 5.5 10 5.5s10-2.5 10-5.5v-9c0-3-4.5-5.5-10-5.5z" fill="#00758F"/>
                <ellipse cx="16" cy="11.5" rx="10" ry="5.5" fill="#F29111"/>
                <path d="M12 14c-1-1.5-3-2-4.5-1.5s-2 2-.5 3.5 3 2 4.5 1.5" stroke="#1E4E5F" strokeWidth="1" strokeLinecap="round" fill="none"/>
            </svg>
        </div>
    ),
    'PostgreSQL': (
        <div className="db-icon postgresql-icon">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="4" fill="#E8EEF4"/>
                <ellipse cx="16" cy="16" rx="10" ry="12" fill="#336791"/>
                <ellipse cx="16" cy="12" rx="5" ry="4" fill="#fff" fillOpacity="0.2"/>
                <path d="M13 20c0 3 1.5 6 3 6s3-3 3-6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                <circle cx="13" cy="14" r="1.5" fill="#fff"/>
                <circle cx="19" cy="14" r="1.5" fill="#fff"/>
            </svg>
        </div>
    ),
    'Oracle': (
        <div className="db-icon oracle-icon">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="4" fill="#FFEBEB"/>
                <rect x="4" y="12" width="24" height="8" rx="4" fill="#F80000"/>
                <text x="16" y="18" textAnchor="middle" fill="#fff" fontSize="5" fontWeight="bold" fontFamily="Arial">ORACLE</text>
            </svg>
        </div>
    ),
    'SQLite': (
        <div className="db-icon sqlite-icon">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="4" fill="#E8F0F4"/>
                <path d="M16 4l-10 6v12l10 6 10-6V10l-10-6z" fill="#003B57"/>
                <path d="M11 13l4 4-4 4M16 21h6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
    ),
};

function DialectSelector({ 
    dialects, 
    sourceDialect, 
    targetDialect, 
    onSourceDialectChange, 
    onTargetDialectChange,
    onConvert,
    isConverting,
    canConvert
}) {
    const getDialectIcon = (dialect) => {
        return dialectIcons[dialect] || (
            <div className="db-icon default-icon">
                <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="32" height="32" rx="4" fill="#F0F4FF"/>
                    <circle cx="16" cy="16" r="10" fill="#667eea"/>
                    <path d="M16 10v12M10 16h12" stroke="#fff" strokeWidth="2"/>
                </svg>
            </div>
        );
    };

    return (
        <div className="dialect-selector-container">
            <div className="dialect-header">
                <div className="dialect-header-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="4" width="18" height="4" rx="1" fill="#667eea"/>
                        <rect x="3" y="10" width="18" height="4" rx="1" fill="#8b5cf6"/>
                        <rect x="3" y="16" width="18" height="4" rx="1" fill="#a78bfa"/>
                    </svg>
                </div>
                <div className="dialect-header-text">
                    <h3 className="dialect-title">Select SQDialects</h3>
                    <p className="dialect-subtitle">Choose source and target database dialects for conversion</p>
                </div>
            </div>
            
            <div className="dialect-grid">
                {/* Source Dialect */}
                <div className="dialect-card">
                    <div className="dialect-card-content">
                        <div className="dialect-icon-wrapper">
                            {getDialectIcon(sourceDialect)}
                        </div>
                        <div className="dialect-info">
                            <select
                                className="dialect-select"
                                value={sourceDialect}
                                onChange={(e) => onSourceDialectChange(e.target.value)}
                            >
                                {dialects.length === 0 && (
                                    <option value="">Loading...</option>
                                )}
                                {dialects.map((dialect) => (
                                    <option key={dialect} value={dialect}>
                                        {dialect}
                                    </option>
                                ))}
                            </select>
                            <span className="dialect-hint">Preselected</span>
                        </div>
                    </div>
                    <FiChevronRight className="dialect-arrow" />
                </div>

                {/* Arrow Indicator */}
                <div className="dialect-flow-arrow">
                    <FiArrowRight />
                </div>

                {/* Target Dialect */}
                <div className="dialect-card">
                    <div className="dialect-card-content">
                        <div className="dialect-icon-wrapper">
                            {getDialectIcon(targetDialect)}
                        </div>
                        <div className="dialect-info">
                            <select
                                className="dialect-select"
                                value={targetDialect}
                                onChange={(e) => onTargetDialectChange(e.target.value)}
                            >
                                {dialects.length === 0 && (
                                    <option value="">Loading...</option>
                                )}
                                {dialects.map((dialect) => (
                                    <option key={dialect} value={dialect}>
                                        {dialect}
                                    </option>
                                ))}
                            </select>
                            <span className="dialect-hint">Preselected</span>
                        </div>
                    </div>
                    <FiChevronRight className="dialect-arrow" />
                </div>
            </div>

            {/* Convert Button - Now part of dialect selector section */}
            <div className="dialect-convert-section">
                <button
                    className={`dialect-convert-btn ${isConverting ? 'converting' : ''}`}
                    onClick={onConvert}
                    disabled={isConverting || !canConvert}
                >
                    {isConverting ? (
                        <>
                            <span className="convert-spinner" />
                            Converting...
                        </>
                    ) : (
                        'Convert'
                    )}
                </button>
            </div>
        </div>
    );
}

export default DialectSelector;
