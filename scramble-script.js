const verbs = [
  { word: "Eating", image: "img/eating.png" },
  { word: "Playing", image: "img/playing.jpg" },
  { word: "Shower", image: "img/bath.jpg" },
  { word: "Singing", image: "img/singing.png" },
  { word: "Praying", image: "img/praying.png" }
];

let currentWordIndex = 0;
let score = 0;
let timer;
let timeRemaining = 20;
let sortableInstance;  // Reference for the Sortable instance

function startGame() {
  currentWordIndex = 0;  // Reset index to start at the first word
  score = 0;             // Reset score
  shuffleWords();        // Shuffle words every time the game starts
  hideAllModals();       // Ensure all modals are hidden at the start of the game
  loadWord(verbs[currentWordIndex]);
  startTimer();
}

function shuffleWords() {
  verbs.sort(() => Math.random() - 0.5);
}

function loadWord(verb) {
  const scrambled = scrambleWord(verb.word);
  document.getElementById('verb-image').src = verb.image;
  const container = document.getElementById('scrambled-word');
  container.innerHTML = '';  // Clear previous word

  scrambled.forEach(letter => {
    const letterDiv = document.createElement('div');
    letterDiv.textContent = letter;
    container.appendChild(letterDiv);
  });

  // Destroy previous sortable instance if it exists
  if (sortableInstance) {
    sortableInstance.destroy();
  }

  // Enable drag-and-drop with Sortable.js
  sortableInstance = Sortable.create(container, {
    animation: 150,
    onEnd: () => {
      if (isCorrectOrder()) {
        clearInterval(timer);
        score++;
        showModal('congrats-modal');
      }
    }
  });
}

function scrambleWord(word) {
  return word.split('').sort(() => Math.random() - 0.5);
}

function isCorrectOrder() {
  const letters = Array.from(document.getElementById('scrambled-word').children);
  const userAnswer = letters.map(letter => letter.textContent).join('');
  return userAnswer === verbs[currentWordIndex].word;
}

function startTimer() {
  clearInterval(timer);  // Ensure no other timers are running
  timeRemaining = 20;
  document.getElementById('time-remaining').textContent = timeRemaining;
  timer = setInterval(() => {
    timeRemaining--;
    document.getElementById('time-remaining').textContent = timeRemaining;
    if (timeRemaining === 0) {
      clearInterval(timer);
      showModal('time-up-modal');
    }
  }, 1000);
}

function showModal(modalId) {
  document.getElementById(modalId).classList.add('show');
}

function hideModal(modalId) {
  document.getElementById(modalId).classList.remove('show');
}

function hideAllModals() {
  hideModal('congrats-modal');   // Hide the congratulations modal
  hideModal('time-up-modal');    // Hide the time-up modal
  hideModal('final-score-modal'); // Hide the final score modal
}

document.getElementById('next-word-btn').addEventListener('click', () => {
  currentWordIndex++;
  if (currentWordIndex < verbs.length) {
    hideModal('congrats-modal');  // Hide the congratulations modal
    loadWord(verbs[currentWordIndex]);
    startTimer();
  } else {
    showFinalScore();
  }
});

document.getElementById('replay-word-btn').addEventListener('click', () => {
  hideModal('time-up-modal');
  loadWord(verbs[currentWordIndex]);
  startTimer();
});

document.getElementById('skip-word-btn').addEventListener('click', () => {
  currentWordIndex++;
  if (currentWordIndex < verbs.length) {
    hideModal('time-up-modal');
    loadWord(verbs[currentWordIndex]);
    startTimer();
  } else {
    showFinalScore();
  }
});

document.getElementById('play-again-btn').addEventListener('click', () => {
  hideModal('final-score-modal');
  startGame();  // Restart the game from the beginning
});

function showFinalScore() {
  document.getElementById('final-score').textContent = score;
  showModal('final-score-modal');
}

// Start the game initially
startGame();
