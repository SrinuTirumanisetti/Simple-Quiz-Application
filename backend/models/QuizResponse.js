const mongoose = require('mongoose');

const quizResponseSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    questions: [{
        question: String,
        userAnswer: String,
        correctAnswer: String,
        isCorrect: Boolean,
        allChoices: [String]
    }],
    score: {
        type: Number,
        required: true
    },
    totalQuestions: {
        type: Number,
        default: 15
    },
    timeTaken: {
        type: Number, // in seconds
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('QuizResponse', quizResponseSchema);