const express = require('express');
const router = express.Router();
const User = require('../models/User');
const QuizResponse = require('../models/QuizResponse');

// Submit email endpoint
router.post('/submit-email', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Check if user already exists, if not create new user
        let user = await User.findOne({ email });
        if (!user) {
            user = new User({ email });
            await user.save();
        }

        res.status(200).json({
            message: 'Email submitted successfully',
            email: user.email
        });
    } catch (error) {
        console.error('Error submitting email:', error);
        res.status(500).json({ error: 'Failed to submit email' });
    }
});

// Submit quiz endpoint
router.post('/submit-quiz', async (req, res) => {
    try {
        const { email, questions, score, timeTaken } = req.body;

        if (!email || !questions || score === undefined || timeTaken === undefined) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const quizResponse = new QuizResponse({
            email,
            questions,
            score,
            totalQuestions: questions.length,
            timeTaken
        });

        await quizResponse.save();

        res.status(201).json({
            message: 'Quiz submitted successfully',
            quizId: quizResponse._id,
            score: quizResponse.score,
            totalQuestions: quizResponse.totalQuestions
        });
    } catch (error) {
        console.error('Error submitting quiz:', error);
        res.status(500).json({ error: 'Failed to submit quiz' });
    }
});

// Get quiz results by email
router.get('/quiz/:email', async (req, res) => {
    try {
        const { email } = req.params;

        const quizResponses = await QuizResponse.find({ email }).sort({ createdAt: -1 });

        if (!quizResponses || quizResponses.length === 0) {
            return res.status(404).json({ error: 'No quiz results found for this email' });
        }

        res.status(200).json({ quizResponses });
    } catch (error) {
        console.error('Error fetching quiz results:', error);
        res.status(500).json({ error: 'Failed to fetch quiz results' });
    }
});

// Get latest quiz result by email
router.get('/quiz/:email/latest', async (req, res) => {
    try {
        const { email } = req.params;

        const latestQuiz = await QuizResponse.findOne({ email }).sort({ createdAt: -1 });

        if (!latestQuiz) {
            return res.status(404).json({ error: 'No quiz results found for this email' });
        }

        res.status(200).json({ quiz: latestQuiz });
    } catch (error) {
        console.error('Error fetching latest quiz:', error);
        res.status(500).json({ error: 'Failed to fetch quiz result' });
    }
});

module.exports = router;