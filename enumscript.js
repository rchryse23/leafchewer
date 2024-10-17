
const sentences = [
    { text: "The child was very excited, in the ice cream parlor. There was a world of chocolate, vanilla, mango, strawberry, apple, grapes, and every possible flavor.", type: "Enumeration" },
    { text: "What could I say about Fernando? He was someone attentive. He liked watching video games, singing, going fishing with his friends, and studying. In short, he was a very well-rounded young man.", type: "Enumeration" },
    { text: "He came and talked to us for a few moments. He seemed upset; but, he managed to get through all the bad news.", type: "Narration" },
    { text: "It was late summer the last time we saw Max. He was standing at the edge of the hill, and he never looked up even though he knew we were there.", type: "Narration" },
    { text: "My favorite foods are spaghetti, fried chicken, chicken salad, ice cream and all pastas in the world.", type: "Enumeration" },
    { text: "I can't help but remember how good my father was. He always made sure I was okay, complete with all the things I need at school.", type: "Narration" },
    { text: "My kids are naughty but nice. They know how to play by themselves. They know how to eat using spoon and fork.", type: "Enumeration" }
];

let currentSentence = 0;
let score = 0;
const answers = [];
let speechSynthesisUtterance;

const sentenceDisplay = document.getElementById('sentence-display');
const narrationBtn = document.getElementById('narration-btn');
const enumerationBtn = document.getElementById('enumeration-btn');
const startBtn = document.getElementById('start-btn');
const resultArea = document.getElementById('result-area');
const scoreDisplay = document.getElementById('score-display');
const answersList = document.getElementById('answers-list');
const restartBtn = document.getElementById('restart-btn');

function startGame() {
    currentSentence = 0;
    score = 0;
    answers.length = 0;
    resultArea.style.display = 'none';
    document.getElementById('game-area').style.display = 'block';
    startBtn.style.display = 'none'; // Hide the start button
    showNextSentence();
}

function showNextSentence() {
    if (currentSentence < sentences.length) {
        const sentence = sentences[currentSentence].text;
        sentenceDisplay.textContent = sentence;
        speak(sentence);
    } else {
        endGame();
    }
}

function checkAnswer(type) {
    stopSpeech(); // Stop any ongoing speech before moving on
    const correct = sentences[currentSentence].type === type;
    if (correct) score++;
    answers.push({
        sentence: sentences[currentSentence].text,
        playerAnswer: type,
        correctAnswer: sentences[currentSentence].type,
        correct: correct
    });
    currentSentence++;
    showNextSentence();
}

function endGame() {
    stopSpeech(); // Stop any ongoing speech at the end of the game
    document.getElementById('game-area').style.display = 'none';
    resultArea.style.display = 'block';
    scoreDisplay.textContent = `Your score: ${score} / ${sentences.length}`;
    answersList.innerHTML = answers.map(a =>
        `<li>${a.sentence} - Your Answer: ${a.playerAnswer} - Correct Answer: ${a.correctAnswer}</li>`
    ).join('');
}

function speak(text) {
    stopSpeech(); // Ensure any previous speech is stopped
    speechSynthesisUtterance = new SpeechSynthesisUtterance(text);
    speechSynthesisUtterance.lang = 'en-US';
    window.speechSynthesis.speak(speechSynthesisUtterance);
}

function stopSpeech() {
    if (speechSynthesisUtterance) {
        speechSynthesisUtterance.onend = null; // Remove previous listeners
        window.speechSynthesis.cancel(); // Stop the speech
    }
}

narrationBtn.addEventListener('click', () => checkAnswer('Narration'));
enumerationBtn.addEventListener('click', () => checkAnswer('Enumeration'));
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);
