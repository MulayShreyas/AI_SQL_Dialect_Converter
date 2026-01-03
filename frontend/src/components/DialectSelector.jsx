import { FiChevronRight, FiArrowRight } from 'react-icons/fi';
import './DialectSelector.css';

// Database brand icons - Using official database brand imagery
const dialectIcons = {
    'SQL Server': (
        <div className="db-icon sql-server-icon">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="6" fill="#fff"/>
                <path d="M24 6C14.059 6 6 9.582 6 14v20c0 4.418 8.059 8 18 8s18-3.582 18-8V14c0-4.418-8.059-8-18-8z" fill="#CC2927"/>
                <ellipse cx="24" cy="14" rx="18" ry="8" fill="#E8E8E8"/>
                <path d="M24 18c7.732 0 14-2.686 14-6s-6.268-6-14-6-14 2.686-14 6 6.268 6 14 6z" fill="#CC2927"/>
                <text x="24" y="32" textAnchor="middle" fill="#fff" fontSize="6" fontWeight="bold" fontFamily="Arial">SQL</text>
            </svg>
        </div>
    ),
    'MySQL': (
        <div className="db-icon mysql-icon">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="6" fill="#fff"/>
                <path d="M38.5 36.5c-1.2-1.5-2.5-2-4.5-2.5-2-.5-3.5-1-5-2.5 1.5-2 2.5-4.5 2.5-7 0-6.5-5-11.5-11-11.5-3 0-5.5 1-7.5 3-2-1.5-4.5-3-7.5-3v2c2 0 4 1 5.5 2-1 1.5-1.5 3.5-1.5 5.5 0 6.5 5 11.5 11 11.5 2 0 4-.5 5.5-1.5 1 1 2 1.5 3.5 2 2 .5 4 1.5 5 3l3.5-1z" fill="#00758F"/>
                <ellipse cx="20.5" cy="24" rx="9" ry="9" fill="#F29111"/>
                <path d="M15 24c0-3 2.5-5.5 5.5-5.5s5.5 2.5 5.5 5.5-2.5 5.5-5.5 5.5S15 27 15 24z" fill="#fff" fillOpacity="0.3"/>
            </svg>
        </div>
    ),
    'PostgreSQL': (
        <div className="db-icon postgresql-icon">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="6" fill="#fff"/>
                <path d="M35.5 28c-.5 4-2 7-4 9-2 1.5-4.5 2-7 1.5-2-.5-4-2-5-4-.5-1.5-.5-3 0-4.5.5-2 2-3.5 4-4 2-.5 4 0 5.5 1 1 .5 2 1.5 2.5 2.5.5-1 .5-2 .5-3 0-4-2-7.5-5-10-2-2-5-3-8-3-4 0-7.5 2-10 5.5-2 3-3 6.5-2.5 10.5.5 4 2.5 7 5.5 9.5 2.5 2 5.5 3 9 3 4 0 7.5-1.5 10-4.5 2-2.5 3.5-5.5 4-9z" fill="#336791"/>
                <ellipse cx="18" cy="20" rx="3" ry="3.5" fill="#fff"/>
                <circle cx="18" cy="20" r="1.5" fill="#336791"/>
                <path d="M30 32c0 2-1.5 4-3.5 4S23 34 23 32s1.5-3 3.5-3 3.5 1 3.5 3z" fill="#336791"/>
            </svg>
        </div>
    ),
    'Oracle': (
        <div className="db-icon oracle-icon">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="6" fill="#fff"/>
                <rect x="4" y="18" width="40" height="12" rx="6" fill="#F80000"/>
                <text x="24" y="27" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold" fontFamily="Arial, sans-serif">ORACLE</text>
            </svg>
        </div>
    ),
    'SQLite': (
        <div className="db-icon sqlite-icon">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="6" fill="#fff"/>
                <path d="M24 4L8 14v20l16 10 16-10V14L24 4z" fill="#003B57"/>
                <path d="M24 4L8 14l16 10 16-10L24 4z" fill="#0F80CC"/>
                <path d="M24 24v20l16-10V14L24 24z" fill="#003B57"/>
                <path d="M24 24L8 14v20l16 10V24z" fill="#044A6A"/>
                <circle cx="24" cy="18" r="4" fill="#fff"/>
            </svg>
        </div>
    ),
    'MariaDB': (
        <div className="db-icon mariadb-icon">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="6" fill="#fff"/>
                <path d="M40 18c-2-3-5-5-9-5-3 0-5 1-7 3-2-2-4-3-7-3-5 0-9 4-9 9 0 3 1 5 3 7 2 3 5 5 9 7 4-2 7-4 9-7 2-2 3-4 3-7 0-1 0-2-.5-3 1.5.5 3 1.5 4 3 1.5 2 2.5 4.5 2.5 7 0 5-4 9.5-10 11-3 1-6 1-9 0-5-1.5-9-5-11-9-.5-1.5-1-3-1-5h4c0 1 .5 2 1 3 1.5 3 4 5 7.5 6 2 .5 4 .5 6 0 4-1 7-4 7-7.5 0-2-.5-3.5-2-5z" fill="#C0765A"/>
                <circle cx="17" cy="22" r="5" fill="#C0765A"/>
                <circle cx="17" cy="22" r="2" fill="#fff"/>
            </svg>
        </div>
    ),
    'Teradata': (
        <div className="db-icon teradata-icon">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="6" fill="#fff"/>
                <path d="M6 16h36v4H6z" fill="#F37440"/>
                <path d="M6 22h36v4H6z" fill="#F37440"/>
                <path d="M6 28h36v4H6z" fill="#F37440"/>
                <circle cx="12" cy="18" r="2" fill="#fff"/>
                <circle cx="12" cy="24" r="2" fill="#fff"/>
                <circle cx="12" cy="30" r="2" fill="#fff"/>
            </svg>
        </div>
    ),
    'Snowflake': (
        <div className="db-icon snowflake-icon">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="6" fill="#fff"/>
                <path d="M24 6v36M10.5 16.5L37.5 31.5M37.5 16.5L10.5 31.5" stroke="#29B5E8" strokeWidth="4" strokeLinecap="round"/>
                <circle cx="24" cy="6" r="3" fill="#29B5E8"/>
                <circle cx="24" cy="42" r="3" fill="#29B5E8"/>
                <circle cx="10.5" cy="16.5" r="3" fill="#29B5E8"/>
                <circle cx="37.5" cy="31.5" r="3" fill="#29B5E8"/>
                <circle cx="37.5" cy="16.5" r="3" fill="#29B5E8"/>
                <circle cx="10.5" cy="31.5" r="3" fill="#29B5E8"/>
                <circle cx="24" cy="24" r="5" fill="#29B5E8"/>
            </svg>
        </div>
    ),
    'BigQuery': (
        <div className="db-icon bigquery-icon">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="6" fill="#fff"/>
                <path d="M24 8L8 18v12l16 10 16-10V18L24 8z" fill="#4386FA"/>
                <path d="M24 8v22l16-10V18L24 8z" fill="#3367D6"/>
                <circle cx="24" cy="22" r="6" fill="#fff"/>
                <path d="M28 26l6 8" stroke="#AECBFA" strokeWidth="3" strokeLinecap="round"/>
            </svg>
        </div>
    ),
    'Amazon Redshift': (
        <div className="db-icon redshift-icon">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="6" fill="#fff"/>
                <path d="M24 6C14 6 6 10 6 15v18c0 5 8 9 18 9s18-4 18-9V15c0-5-8-9-18-9z" fill="#8C4FFF"/>
                <ellipse cx="24" cy="15" rx="18" ry="9" fill="#B07DFF"/>
                <path d="M24 24c5.523 0 10-2.239 10-5s-4.477-5-10-5-10 2.239-10 5 4.477 5 10 5z" fill="#fff" fillOpacity="0.3"/>
                <path d="M16 28h16M16 33h16" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            </svg>
        </div>
    ),
    'IBM DB2': (
        <div className="db-icon db2-icon">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="6" fill="#fff"/>
                <rect x="8" y="12" width="32" height="24" rx="2" fill="#052FAD"/>
                <text x="24" y="22" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="bold" fontFamily="Arial">IBM</text>
                <text x="24" y="32" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold" fontFamily="Arial">DB2</text>
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
