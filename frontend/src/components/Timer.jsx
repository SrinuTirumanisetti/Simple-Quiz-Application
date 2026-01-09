import { useState, useEffect } from 'react';
import './Timer.css';

function Timer({ duration, onTimeUp }) {
    const [timeLeft, setTimeLeft] = useState(duration);

    useEffect(() => {
        if (timeLeft <= 0) {
            onTimeUp();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, onTimeUp]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const percentage = (timeLeft / duration) * 100;
    const isWarning = timeLeft <= 300; // Last 5 minutes
    const isCritical = timeLeft <= 60; // Last minute

    return (
        <div className={`timer-container ${isWarning ? 'warning' : ''} ${isCritical ? 'critical' : ''}`}>
            <div className="timer-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </div>
            <div className="timer-content">
                <div className="timer-label">Time Remaining</div>
                <div className="timer-display">{formatTime(timeLeft)}</div>
            </div>
            <div className="timer-progress">
                <div
                    className="timer-progress-bar"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
}

export default Timer;
