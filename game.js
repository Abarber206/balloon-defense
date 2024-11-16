// Get canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 1500;
canvas.height = 1000;

// Get UI elements
const scoreElement = document.getElementById('scoreValue');
const roundElement = document.getElementById('roundValue');
const nextRoundElement = document.getElementById('nextRound');
const countdownElement = document.getElementById('countdownValue');
const gameOverScreen = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');
const finalRoundElement = document.getElementById('finalRound');
const themeSelect = document.getElementById('theme');
const leaderboardList = document.getElementById('leaderboardList');
const playerNameInput = document.getElementById('playerName');

// Game variables
let score = 0;
let round = 1;
let gameActive = true;
let activeCircles = 0;
let roundStartTime = Date.now();
let lastTime = 0;
let deltaTime = 0;
let nextBalloonId = 0;
const roundDuration = 30000; // 30 seconds per round
let countdownStarted = false;
let countdownTime = 3;
let lastCountdownUpdate = 0;

// API endpoints (change this to your deployed server URL)
const API_URL = 'http://localhost:3000/api';

// Audio setup
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Game settings
const baseSpeed = 0.5;
const speedIncreasePerTier = 0.2;
const smallSpeedIncrease = 0.02;
const maxSpeedMultiplier = 3;

// Fetch top scores from the server
async function fetchLeaderboard() {
    try {
        const response = await fetch(`${API_URL}/scores`);
        const scores = await response.json();
        displayLeaderboard(scores);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
    }
}

// Save score to the server
async function saveScore() {
    const playerName = document.getElementById('playerName').value || 'Anonymous';
    try {
        const response = await fetch(`${API_URL}/scores`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: playerName,
                score: score,
                rounds: round - 1
            })
        });
        
        if (response.ok) {
            await fetchLeaderboard();
            document.getElementById('gameOver').style.display = 'none';
        } else {
            console.error('Error saving score');
        }
    } catch (error) {
        console.error('Error saving score:', error);
    }
}

// Display leaderboard
function displayLeaderboard(scores) {
    const leaderboardList = document.getElementById('leaderboardList');
    leaderboardList.innerHTML = '';
    scores.forEach((entry, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${index + 1}. ${entry.name}: ${entry.score}`;
        leaderboardList.appendChild(listItem);
    });
}

// Initialize the game
window.addEventListener('load', () => {
    loadTheme();
    hideCursor();
    initBackgroundPatterns();
    initPolkaDotsPattern();
    startGame();
    fetchLeaderboard(); // Fetch initial leaderboard
});

// Rest of your existing game.js code here
