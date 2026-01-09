import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ReportPage.css';

function ReportPage() {
    const navigate = useNavigate();
    const [quizResults, setQuizResults] = useState(null);

    useEffect(() => {
        const results = sessionStorage.getItem('quizResults');
        if (!results) {
            navigate('/');
            return;
        }

        try {
            const parsedResults = JSON.parse(results);
            setQuizResults(parsedResults);
        } catch (err) {
            console.error('Error parsing quiz results:', err);
            navigate('/');
        }
    }, [navigate]);

    const handleRetake = () => {
        sessionStorage.removeItem('quizResults');
        navigate('/');
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    if (!quizResults) {
        return (
            <div className="report-page loading-state">
                <div className="spinner"></div>
                <p>Loading results...</p>
            </div>
        );
    }

    const { questions, score, totalQuestions, timeTaken, email } = quizResults;
    const scoreNum = Number(score) || 0;
    const totalNum = Number(totalQuestions) || (questions && questions.length) || 0;

    const percentage =
        totalNum > 0
            ? ((scoreNum / totalNum) * 100).toFixed(2)
            : '0.00';

    return (
        <div className="report-page">
            <div className="report-header">
                <div className="container">
                    <div className="header-content fade-in">
                        <div className="score-card glass">
                            <div className="score-icon">
                                {percentage >= 70 ? (
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                ) : (
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                        <path d="M12 8V12M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                )}
                            </div>
                            <h1>Quiz Complete!</h1>
                            <div className="score-display">
                                <div className="score-value">{score}/{totalQuestions}</div>
                                <div className="score-percentage">{percentage}%</div>
                            </div>
                            <div className="score-meta">
                                <div className="meta-item">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                        <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                    <span>Time: {formatTime(timeTaken)}</span>
                                </div>
                                <div className="meta-item">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" />
                                        <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                    <span>{email}</span>
                                </div>
                            </div>
                            <button className="btn btn-primary" onClick={handleRetake}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    <path d="M4 12L1 9M4 12L1 15M4 12H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Retake Quiz
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="report-container container">
                <h2 className="section-title">Detailed Results</h2>

                <div className="questions-list">
                    {questions.map((q, index) => (
                        <div key={index} className={`question-result-card ${q.isCorrect ? 'correct' : 'incorrect'} slide-in`} style={{ animationDelay: `${index * 0.05}s` }}>
                            <div className="result-header">
                                <div className="result-number">Question {index + 1}</div>
                                <div className={`result-badge ${q.isCorrect ? 'correct' : 'incorrect'}`}>
                                    {q.isCorrect ? (
                                        <>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            Correct
                                        </>
                                    ) : (
                                        <>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            Incorrect
                                        </>
                                    )}
                                </div>
                            </div>

                            <p className="result-question">{q.question}</p>

                            <div className="answers-comparison">
                                {q.userAnswer && (
                                    <div className={`answer-box ${q.isCorrect ? 'correct-answer' : 'wrong-answer'}`}>
                                        <div className="answer-label">Your Answer</div>
                                        <div className="answer-text">{q.userAnswer}</div>
                                    </div>
                                )}

                                {!q.isCorrect && (
                                    <div className="answer-box correct-answer">
                                        <div className="answer-label">Correct Answer</div>
                                        <div className="answer-text">{q.correctAnswer}</div>
                                    </div>
                                )}

                                {!q.userAnswer && (
                                    <div className="answer-box unanswered">
                                        <div className="answer-label">Not Answered</div>
                                        <div className="answer-text">You didn't answer this question</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <footer className="report-footer">
                <div className="container">
                    <p>Thank you for taking the quiz!</p>
                    <p className="footer-brand">Powered by CausalFunnel</p>
                </div>
            </footer>
        </div>
    );
}

export default ReportPage;
