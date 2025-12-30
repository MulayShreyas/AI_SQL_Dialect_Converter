import { FiChevronRight, FiArrowRight } from 'react-icons/fi';
import './DialectSelector.css';

// Dialect icons mapping
const dialectIcons = {
    'SQL Server': (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="dialect-svg">
            <path d="M12 2L4 6v12l8 4 8-4V6l-8-4z" fill="#CC2927"/>
            <path d="M12 2v20M4 6l8 4 8-4M4 18l8-4 8 4" stroke="#fff" strokeWidth="1.5"/>
        </svg>
    ),
    'MySQL': (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="dialect-svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#00758F"/>
            <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" fill="#F29111"/>
        </svg>
    ),
    'PostgreSQL': (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="dialect-svg">
            <circle cx="12" cy="12" r="10" fill="#336791"/>
            <path d="M12 6v12M8 10h8" stroke="#fff" strokeWidth="2"/>
        </svg>
    ),
    'Oracle': (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="dialect-svg">
            <rect x="2" y="8" width="20" height="8" rx="4" fill="#F80000"/>
        </svg>
    ),
    'SQLite': (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="dialect-svg">
            <circle cx="12" cy="12" r="10" fill="#003B57"/>
            <path d="M8 12l3 3 5-6" stroke="#fff" strokeWidth="2"/>
        </svg>
    ),
};

function DialectSelector({ 
    dialects, 
    sourceDialect, 
    targetDialect, 
    onSourceDialectChange, 
    onTargetDialectChange 
}) {
    const getDialectIcon = (dialect) => {
        return dialectIcons[dialect] || (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="dialect-svg">
                <circle cx="12" cy="12" r="10" fill="#667eea"/>
                <path d="M12 8v8M8 12h8" stroke="#fff" strokeWidth="2"/>
            </svg>
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
        </div>
    );
}

export default DialectSelector;
