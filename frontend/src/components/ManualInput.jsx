import { useState, useEffect, useRef } from 'react';
import { FiEdit3 } from 'react-icons/fi';
import './ManualInput.css';

function ManualInput({ onSubmit }) {
    const [sqlText, setSqlText] = useState('');
    const onSubmitRef = useRef(onSubmit);
    const isPastingRef = useRef(false);

    // Update ref when onSubmit changes
    useEffect(() => {
        onSubmitRef.current = onSubmit;
    }, [onSubmit]);

    // Auto-parse when user types SQL (debounced)
    useEffect(() => {
        // Don't auto-parse if the text was just pasted (handlePaste already handles it)
        if (sqlText.trim() && !isPastingRef.current) {
            const timeoutId = setTimeout(() => {
                onSubmitRef.current(sqlText);
            }, 1000); // Debounce for 1 second

            return () => clearTimeout(timeoutId);
        }
        
        // Reset the pasting flag
        if (isPastingRef.current) {
            isPastingRef.current = false;
        }
    }, [sqlText]); // Only depend on sqlText

    const handlePaste = (e) => {
        const pastedText = e.clipboardData.getData('text');
        if (pastedText.trim()) {
            isPastingRef.current = true; // Mark that we're pasting
            setSqlText(pastedText);
            // Auto-parse immediately on paste
            setTimeout(() => onSubmitRef.current(pastedText), 100);
        }
    };

    return (
        <div className="manual-input-container">
            <h3 className="section-title">✍️ Paste SQL Query</h3>
            <p className="section-subtitle">Paste or type your SQL statements (auto-parses as you type)</p>

            <textarea
                className="sql-textarea"
                placeholder="Paste your SQL here... (e.g., SELECT * FROM users WHERE id = 1;)"
                value={sqlText}
                onChange={(e) => setSqlText(e.target.value)}
                onPaste={handlePaste}
                rows={8}
            />

            <div className="input-footer">
                <span className="input-hint">
                    <FiEdit3 className="hint-icon" />
                    Auto-parses as you type or paste
                </span>
            </div>
        </div>
    );
}

export default ManualInput;
