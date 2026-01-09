import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitEmail } from '../utils/api';
import './EmailPage.css';

function EmailPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email) {
            setError('Please enter your email address');
            return;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);

        try {
            await submitEmail(email);
            // Store email in sessionStorage for later use
            sessionStorage.setItem('userEmail', email);
            navigate('/quiz');
        } catch (err) {
            setError('Failed to submit email. Please try again.');
            console.error('Email submission error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="email-page">
            <div className="email-background">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
                <div className="gradient-orb orb-3"></div>
            </div>

            <div className="email-container">
                <div className="email-card glass fade-in">
                    <div className="email-header">
                        <div className="icon-wrapper">
                            <svg className="quiz-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 11H15M9 15H12M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                <path d="M12 7V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </div>
                        <h1>Welcome to the Quiz</h1>
                        <p className="subtitle">Test your knowledge with 15 exciting questions!</p>
                    </div>

                    <form onSubmit={handleSubmit} className="email-form">
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                className="input"
                                placeholder="your.email@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                autoFocus
                            />
                            {error && <p className="error-message">{error}</p>}
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? (
                                <>
                                    <div className="spinner"></div>
                                    <span>Starting Quiz...</span>
                                </>
                            ) : (
                                <>
                                    <span>Start Quiz</span>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="quiz-info">
                        <div className="info-item">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            <span>30 minutes</span>
                        </div>
                        <div className="info-item">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            <span>15 questions</span>
                        </div>
                        <div className="info-item">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>Instant results</span>
                        </div>
                    </div>
                </div>

                <footer className="email-footer">
                    <p>Powered by CausalFunnel</p>
                </footer>
            </div>
        </div>
    );
}

export default EmailPage;
