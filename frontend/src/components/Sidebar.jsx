import { FiKey, FiDatabase, FiFileText } from 'react-icons/fi';
import './Sidebar.css';

function Sidebar({
    dialects,
    formats,
    sourceDialect,
    targetDialect,
    outputFormat,
    apiKey,
    onSourceDialectChange,
    onTargetDialectChange,
    onOutputFormatChange,
    onApiKeyChange,
}) {
    return (
        <aside className="sidebar">
            <div className="sidebar-content">
                <h2 className="sidebar-title">⚙️ Configuration</h2>
                <div className="sidebar-divider" />

                {/* API Key Section */}
                <div className="config-section">
                    <label className="config-label">
                        <FiKey className="label-icon" />
                        OpenRouter API Key
                    </label>
                    <input
                        type="password"
                        className="config-input"
                        placeholder="Enter your API key"
                        value={apiKey}
                        onChange={(e) => onApiKeyChange(e.target.value)}
                    />
                    <p className="config-hint">
                        Get your API key from{' '}
                        <a
                            href="https://openrouter.ai"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="config-link"
                        >
                            openrouter.ai
                        </a>
                    </p>
                </div>

                <div className="sidebar-divider" />

                {/* Source Dialect */}
                <div className="config-section">
                    <label className="config-label">
                        <FiDatabase className="label-icon" />
                        📤 Source Dialect
                    </label>
                    <select
                        className="config-select"
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

                {/* Target Dialect */}
                <div className="config-section">
                    <label className="config-label">
                        <FiDatabase className="label-icon" />
                        📥 Target Dialect
                    </label>
                    <select
                        className="config-select"
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

                <div className="sidebar-divider" />
                
                <div className="sidebar-footer">
                    Powered by OpenRouter AI
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;
