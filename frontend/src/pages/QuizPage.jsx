import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchQuizQuestions, submitQuiz } from '../utils/api';
import Timer from '../components/Timer';
import QuestionNav from '../components/QuestionNav';
import './QuizPage.css';

function QuizPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [visitedQuestions, setVisitedQuestions] = useState(new Set([0]));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [startTime] = useState(Date.now());
    const hasLoadedQuestions = useRef(false); // Prevent double-fetch in StrictMode

    const QUIZ_DURATION = 30 * 60; // 30 minutes in seconds

    useEffect(() => {
        const userEmail = sessionStorage.getItem('userEmail');
        if (!userEmail) {
            navigate('/');
            return;
        }
        setEmail(userEmail);

        // Prevent double API call in React StrictMode
        if (hasLoadedQuestions.current) {
            return;
        }
        hasLoadedQuestions.current = true;

        // Fetch questions from OpenTDB API
        const loadQuestions = async () => {
            try {
                setLoading(true);
                const data = await fetchQuizQuestions(15);

                // Process questions to shuffle choices
                const processedQuestions = data.map((q) => {
                    const allChoices = [...q.incorrect_answers, q.correct_answer];
                    // Shuffle choices
                    const shuffledChoices = allChoices.sort(() => Math.random() - 0.5);

                    return {
                        question: decodeHTML(q.question),
                        correctAnswer: decodeHTML(q.correct_answer),
                        choices: shuffledChoices.map(decodeHTML),
                        type: q.type,
                        difficulty: q.difficulty,
                        category: decodeHTML(q.category)
                    };
                });

                setQuestions(processedQuestions);
                setLoading(false);
            } catch (err) {
                setError('Failed to load quiz questions. Please try again.');
                setLoading(false);
                console.error('Error loading questions:', err);
            }
        };

        loadQuestions();
    }, [navigate]);

    // Decode HTML entities
    const decodeHTML = (html) => {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    };

    const handleAnswerSelect = (choice) => {
        setUserAnswers({
            ...userAnswers,
            [currentQuestion]: choice
        });
    };

    const handleQuestionChange = (index) => {
        setCurrentQuestion(index);
        setVisitedQuestions(new Set([...visitedQuestions, index]));
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            handleQuestionChange(currentQuestion + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            handleQuestionChange(currentQuestion - 1);
        }
    };

    const handleSubmit = async () => {
        if (submitting) return;

        const confirmSubmit = window.confirm(
            `You have answered ${Object.keys(userAnswers).length} out of ${questions.length} questions.\n\nAre you sure you want to submit?`
        );

        if (!confirmSubmit) return;

        setSubmitting(true);

        try {
            const timeTaken = Math.floor((Date.now() - startTime) / 1000);

            const quizData = {
                email,
                questions: questions.map((q, index) => ({
                    question: q.question,
                    userAnswer: userAnswers[index] || '',
                    correctAnswer: q.correctAnswer,
                    isCorrect: userAnswers[index] === q.correctAnswer,
                    allChoices: q.choices
                })),
                score: questions.filter((q, index) => userAnswers[index] === q.correctAnswer).length,
                totalQuestions: questions.length,
                timeTaken
            };

            await submitQuiz(quizData);

            // Store quiz data for report page
            sessionStorage.setItem('quizResults', JSON.stringify(quizData));
            navigate('/report');
        } catch (err) {
            alert('Failed to submit quiz. Please try again.');
            setSubmitting(false);
            console.error('Error submitting quiz:', err);
        }
    };

    const attemptedQuestions = new Set(Object.keys(userAnswers).map(Number));

    if (loading) {
        return (
            <div className="quiz-page loading-state">
                <div className="spinner"></div>
                <p>Loading quiz questions...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="quiz-page error-state">
                <div className="error-card">
                    <h2>Error</h2>
                    <p>{error}</p>
                    <button className="btn btn-primary" onClick={() => navigate('/')}>
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const currentQ = questions[currentQuestion];

    return (
        <div className="quiz-page">
            <div className="quiz-header">
                <div className="container">
                    <div className="header-content">
                        <div className="quiz-branding">
                            <h2>Quiz Application</h2>
                            <p className="user-email">{email}</p>
                        </div>
                        <Timer duration={QUIZ_DURATION} onTimeUp={handleSubmit} />
                    </div>
                </div>
            </div>

            <div className="quiz-container container">
                <div className="quiz-main">
                    <div className="question-card glass">
                        <div className="question-header">
                            <div className="question-meta">
                                <span className="question-number">
                                    Question {currentQuestion + 1} of {questions.length}
                                </span>
                                <span className="question-category">{currentQ.category}</span>
                                <span className={`question-difficulty ${currentQ.difficulty}`}>
                                    {currentQ.difficulty}
                                </span>
                            </div>
                        </div>

                        <h3 className="question-text">{currentQ.question}</h3>

                        <div className="choices-container">
                            {currentQ.choices.map((choice, index) => (
                                <button
                                    key={index}
                                    className={`choice-btn ${userAnswers[currentQuestion] === choice ? 'selected' : ''}`}
                                    onClick={() => handleAnswerSelect(choice)}
                                >
                                    <span className="choice-letter">
                                        {String.fromCharCode(65 + index)}
                                    </span>
                                    <span className="choice-text">{choice}</span>
                                    {userAnswers[currentQuestion] === choice && (
                                        <svg className="check-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path d="M7 10L9 12L13 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="question-actions">
                            <button
                                className="btn btn-secondary"
                                onClick={handlePrevious}
                                disabled={currentQuestion === 0}
                            >
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Previous
                            </button>

                            {currentQuestion < questions.length - 1 ? (
                                <button className="btn btn-primary" onClick={handleNext}>
                                    Next
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            ) : (
                                <button
                                    className="btn btn-primary"
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                >
                                    {submitting ? 'Submitting...' : 'Submit Quiz'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <aside className="quiz-sidebar">
                    <QuestionNav
                        totalQuestions={questions.length}
                        currentQuestion={currentQuestion}
                        visitedQuestions={visitedQuestions}
                        attemptedQuestions={attemptedQuestions}
                        onQuestionSelect={handleQuestionChange}
                    />

                    <div className="quiz-stats">
                        <div className="stat-item">
                            <div className="stat-value">{Object.keys(userAnswers).length}</div>
                            <div className="stat-label">Answered</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-value">{questions.length - Object.keys(userAnswers).length}</div>
                            <div className="stat-label">Remaining</div>
                        </div>
                    </div>

                    <button
                        className="btn btn-primary submit-btn-sidebar"
                        onClick={handleSubmit}
                        disabled={submitting}
                    >
                        {submitting ? 'Submitting...' : 'Submit Quiz'}
                    </button>
                </aside>
            </div>
        </div>
    );
}

export default QuizPage;
