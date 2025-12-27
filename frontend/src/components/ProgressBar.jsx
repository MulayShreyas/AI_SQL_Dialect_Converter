import { useEffect, useState } from 'react';
import './ProgressBar.css';

function ProgressBar({ isActive, message = 'Converting SQL statements...' }) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (isActive) {
            setProgress(0);
            const interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 90) {
                        clearInterval(interval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 300);

            return () => clearInterval(interval);
        } else {
            // Complete the progress bar when done
            setProgress(100);
            const timeout = setTimeout(() => setProgress(0), 500);
            return () => clearTimeout(timeout);
        }
    }, [isActive]);

    if (!isActive && progress === 0) return null;

    return (
        <div className="progress-bar-container">
            <div className="progress-info">
                <span className="progress-message">{message}</span>
                <span className="progress-percentage">{Math.round(progress)}%</span>
            </div>
            <div className="progress-bar-track">
                <div 
                    className="progress-bar-fill" 
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}

export default ProgressBar;
