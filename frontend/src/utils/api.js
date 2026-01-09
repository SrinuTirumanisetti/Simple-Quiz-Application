import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;
if (!API_BASE_URL) {
    console.warn('VITE_API_URL is not defined in environment variables');
}

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Email submission
export const submitEmail = async (email) => {
    const response = await api.post('/submit-email', { email });
    return response.data;
};

// Quiz submission
export const submitQuiz = async (quizData) => {
    const response = await api.post('/submit-quiz', quizData);
    return response.data;
};

// Get quiz results
export const getQuizResults = async (email) => {
    const response = await api.get(`/quiz/${email}/latest`);
    return response.data;
};

// Fetch questions from OpenTDB API
export const fetchQuizQuestions = async (amount = 15) => {
    try {
        console.log('Fetching quiz questions from OpenTDB API...');
        const response = await axios.get(`https://opentdb.com/api.php?amount=${amount}`);
        console.log('API Response:', response.data);

        if (response.data && response.data.results) {
            console.log(`Successfully fetched ${response.data.results.length} questions`);
            return response.data.results;
        } else {
            console.error('Invalid API response format:', response.data);
            throw new Error('Invalid response format from API');
        }
    } catch (error) {
        console.error('Error fetching quiz questions:', error);
        console.error('Error details:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
        throw error;
    }
};

export default api;
