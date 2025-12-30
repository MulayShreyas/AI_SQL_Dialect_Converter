import { FiCode } from 'react-icons/fi';
import './StatementPreview.css';

function StatementPreview({ statements }) {
    if (!statements || statements.length === 0) return null;

    return (
        <div className="statement-preview">
            <div className="preview-header">
                <FiCode className="preview-icon" />
                <h4 className="preview-title">Detected SQL Statements</h4>
                <span className="preview-count">{statements.length} statement(s)</span>
            </div>
            <div className="statements-list">
                {statements.slice(0, 5).map((statement, index) => (
                    <div key={index} className="statement-item">
                        <span className="statement-number">{index + 1}</span>
                        <code className="statement-code">
                            {statement.length > 100 
                                ? statement.substring(0, 100) + '...' 
                                : statement}
                        </code>
                    </div>
                ))}
                {statements.length > 5 && (
                    <div className="statement-item more-indicator">
                        <span className="statement-number">+</span>
                        <span className="statement-code">
                            {statements.length - 5} more statement(s)...
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default StatementPreview;
