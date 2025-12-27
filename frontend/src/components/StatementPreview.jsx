import { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-sql';
import './StatementPreview.css';

function StatementPreview({ statements }) {
    const [expandedIndex, setExpandedIndex] = useState(0);

    const toggleStatement = (index) => {
        setExpandedIndex(expandedIndex === index ? -1 : index);
    };

    return (
        <div className="statement-preview">
            <h3 className="preview-title">📜 Extracted SQL Statements</h3>
            <div className="preview-info">
                Found <strong>{statements.length}</strong> SQL statement(s)
            </div>

            <div className="statements-list">
                {statements.map((statement, index) => (
                    <div key={index} className="statement-item">
                        <button
                            className="statement-header"
                            onClick={() => toggleStatement(index)}
                        >
                            <span className="statement-number">Statement {index + 1}</span>
                            <span className="expand-icon">
                                {expandedIndex === index ? <FiChevronUp /> : <FiChevronDown />}
                            </span>
                        </button>

                        {expandedIndex === index && (
                            <div className="statement-content">
                                <pre className="sql-code">
                                    <code
                                        className="language-sql"
                                        dangerouslySetInnerHTML={{
                                            __html: Prism.highlight(
                                                statement,
                                                Prism.languages.sql,
                                                'sql'
                                            ),
                                        }}
                                    />
                                </pre>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default StatementPreview;
