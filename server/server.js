require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Schema
const scoreSchema = new mongoose.Schema({
    name: { type: String, required: true },
    score: { type: Number, required: true },
    rounds: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});

const Score = mongoose.model('Score', scoreSchema);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

// Routes
app.get('/api/scores', async (req, res) => {
    try {
        const scores = await Score.find()
            .sort({ score: -1 })
            .limit(10);
        res.json(scores);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/scores', async (req, res) => {
    try {
        const score = new Score({
            name: req.body.name,
            score: req.body.score,
            rounds: req.body.rounds
        });
        const newScore = await score.save();
        res.status(201).json(newScore);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
