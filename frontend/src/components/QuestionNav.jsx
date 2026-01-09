import './QuestionNav.css';

function QuestionNav({
    totalQuestions,
    currentQuestion,
    visitedQuestions,
    attemptedQuestions,
    onQuestionSelect
}) {
    const getQuestionStatus = (index) => {
        if (attemptedQuestions.has(index)) return 'attempted';
        if (visitedQuestions.has(index)) return 'visited';
        return 'not-visited';
    };

    return (
        <div className="question-nav">
            <h3 className="nav-title">Questions</h3>
            <div className="question-grid">
                {Array.from({ length: totalQuestions }, (_, index) => {
                    const status = getQuestionStatus(index);
                    const isCurrent = index === currentQuestion;

                    return (
                        <button
                            key={index}
                            className={`question-btn ${status} ${isCurrent ? 'current' : ''}`}
                            onClick={() => onQuestionSelect(index)}
                            aria-label={`Question ${index + 1}`}
                        >
                            {index + 1}
                        </button>
                    );
                })}
            </div>

            <div className="nav-legend">
                <div className="legend-item">
                    <div className="legend-indicator attempted"></div>
                    <span>Attempted</span>
                </div>
                <div className="legend-item">
                    <div className="legend-indicator visited"></div>
                    <span>Visited</span>
                </div>
                <div className="legend-item">
                    <div className="legend-indicator not-visited"></div>
                    <span>Not Visited</span>
                </div>
            </div>
        </div>
    );
}

export default QuestionNav;
