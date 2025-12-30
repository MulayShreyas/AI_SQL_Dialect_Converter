import { useState, useEffect } from 'react';
import './ProgressBar.css';

function ProgressBar({ isActive, message }) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (isActive) {
            setProgress(0);
            const interval = setInterval(() => {
                setProgress((prev) => {
                    // Simulate progress that slows down as it approaches 95%
                    const increment = Math.max(1, (95 - prev) * 0.1);
                    const newProgress = Math.min(95, prev + increment);
                    return newProgress;
                });
            }, 200);

            return () => clearInterval(interval);
        } else {
            setProgress(100);
        }
    }, [isActive]);

    if (!isActive && progress === 0) return null;

    return (
        <div className="progress-container">
            <div className="progress-header">
                <span className="progress-message">
                    <span className="progress-spinner"></span>
                    {message || 'Processing...'}
                </span>
                <span className="progress-percentage">{Math.round(progress)}%</span>
            </div>
            <div className="progress-bar-container">
                <div 
                    className="progress-bar-fill" 
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}

export default ProgressBar;
