import './StatementPreview.css';

function StatementPreview({ statements }) {
    return (
        <div className="statement-preview">
            <div className="preview-info">
                Found <strong>{statements.length}</strong> SQL statement(s)
            </div>
        </div>
    );
}

export default StatementPreview;
