import { FiRefreshCw } from 'react-icons/fi';
import './DialectSelector.css';

function DialectSelector({ 
    dialects, 
    sourceDialect, 
    targetDialect, 
    onSourceDialectChange, 
    onTargetDialectChange 
}) {
    const handleSwap = () => {
        const temp = sourceDialect;
        onSourceDialectChange(targetDialect);
        onTargetDialectChange(temp);
    };

    return (
        <div className="dialect-selector-container">
            <h3 className="dialect-title">🔄 Select SQL Dialects</h3>
            <p className="dialect-subtitle">Choose source and target database dialects for conversion</p>
            
            <div className="dialect-grid">
                {/* Source Dialect */}
                <div className="dialect-field">
                    <label className="dialect-label">
                        📤 Source Dialect
                    </label>
                    <select
                        className="dialect-select"
                        value={sourceDialect}
                        onChange={(e) => onSourceDialectChange(e.target.value)}
                    >
                        {dialects.map((dialect) => (
                            <option key={dialect} value={dialect}>
                                {dialect}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Swap Button */}
                <button 
                    className="swap-button" 
                    onClick={handleSwap}
                    title="Swap dialects"
                >
                    <FiRefreshCw />
                </button>

                {/* Target Dialect */}
                <div className="dialect-field">
                    <label className="dialect-label">
                        📥 Target Dialect
                    </label>
                    <select
                        className="dialect-select"
                        value={targetDialect}
                        onChange={(e) => onTargetDialectChange(e.target.value)}
                    >
                        {dialects.map((dialect) => (
                            <option key={dialect} value={dialect}>
                                {dialect}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}

export default DialectSelector;
