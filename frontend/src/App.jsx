import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EmailPage from './pages/EmailPage';
import QuizPage from './pages/QuizPage';
import ReportPage from './pages/ReportPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<EmailPage />} />
                <Route path="/quiz" element={<QuizPage />} />
                <Route path="/report" element={<ReportPage />} />
            </Routes>
        </Router>
    );
}

export default App;
