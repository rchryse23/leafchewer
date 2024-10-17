const sentences = [
  { text: "Don shot the basketball at the hoop.", type: "Active" },
  { text: "The boy carried the bucket of water.", type: "Active" },
  { text: "Stephen kicked the soccer ball.", type: "Active" },
  { text: "The boys watched a movie.", type: "Active" },
  { text: "The man watered his lawn.", type: "Active" },
  { text: "The pilot flew the plane.", type: "Active" },
  { text: "The two officials are signing the document.", type: "Active" },
  { text: "The plane was flown by the pilot.", type: "Passive" },
  { text: "The winner will be announced by the team.", type: "Passive" },
  { text: "The lawn is being watered by the man.", type: "Passive" },
  { text: "The movie was watched by the boys.", type: "Passive" },
  { text: "The bucket of water was carried by the boy.", type: "Passive" },
  { text: "The soccer ball was kicked by Stephen.", type: "Passive" }
];

let currentSentenceIndex = 0;
let score = 0;
let timer;
let timeRemaining = 25;
const results = [];
let ghostElement = null; // Temporary element for visual feedback

function startGame() {
  currentSentenceIndex = 0;
  score = 0;
  results.length = 0;
  hideModal();
  loadSentence(sentences[currentSentenceIndex]);
  startTimer();
}

function loadSentence(sentence) {
  const sentenceElement = document.getElementById('current-sentence');
  sentenceElement.textContent = sentence.text;
  sentenceElement.setAttribute('data-type', sentence.type);
  document.getElementById('timer').style.display = 'block';
}

function startTimer() {
  clearInterval(timer);
  timeRemaining = 25;
  document.getElementById('time-remaining').textContent = timeRemaining;
  timer = setInterval(() => {
    timeRemaining--;
    document.getElementById('time-remaining').textContent = timeRemaining;
    if (timeRemaining === 0) {
      clearInterval(timer);
      moveToNextSentence();
    }
  }, 1000);
}

// Drag & Touch Handling
const sentenceElement = document.getElementById('current-sentence');

function createGhostElement(text) {
  ghostElement = document.createElement('div');
  ghostElement.className = 'ghost';
  ghostElement.textContent = text;
  document.body.appendChild(ghostElement);
}

function removeGhostElement() {
  if (ghostElement) {
    document.body.removeChild(ghostElement);
    ghostElement = null;
  }
}

function handleDragStart(e) {
  e.dataTransfer?.setData('text', sentenceElement.getAttribute('data-type'));
  sentenceElement.classList.add('dragging');
}

function handleDragEnd() {
  sentenceElement.classList.remove('dragging');
}

function handleTouchStart(e) {
  const text = sentenceElement.textContent;
  createGhostElement(text);
}

function handleTouchMove(e) {
  if (ghostElement) {
    const touch = e.touches[0];
    ghostElement.style.left = `${touch.clientX}px`;
    ghostElement.style.top = `${touch.clientY}px`;
  }
}

function handleTouchEnd(e) {
  const targetBox = document.elementFromPoint(
    e.changedTouches[0].clientX,
    e.changedTouches[0].clientY
  );
  dropSentence(targetBox);
  removeGhostElement();
}

$('.drop-box').on('dragover', (e) => e.preventDefault());

$('.drop-box').on('drop', function (e) {
  e.preventDefault();
  dropSentence(this);
});

function dropSentence(targetBox) {
  const expectedType = sentenceElement.getAttribute('data-type').toLowerCase();
  const selectedBoxType = targetBox.id.replace('-box', '');

  const isCorrect = expectedType === selectedBoxType;
  if (isCorrect) score++;

  results.push({
    sentence: sentences[currentSentenceIndex].text,
    selected: selectedBoxType,
    correct: isCorrect ? "Correct" : "Incorrect"
  });

  moveToNextSentence();
}

function moveToNextSentence() {
  currentSentenceIndex++;
  if (currentSentenceIndex < sentences.length) {
    loadSentence(sentences[currentSentenceIndex]);
    startTimer();
  } else {
    endGame();
  }
}

function endGame() {
  clearInterval(timer);
  document.getElementById('timer').style.display = 'none';
  document.getElementById('current-sentence').textContent = "Congratulations!";
  showFinalScore();
}

function showFinalScore() {
  document.getElementById('final-score').textContent = score;
  displayResults();
  showModal();
}

function displayResults() {
  const resultsContainer = document.getElementById('results-container');
  resultsContainer.innerHTML = '';

  results.forEach(result => {
    const resultItem = document.createElement('p');
    resultItem.textContent = `${result.sentence} - ${result.selected} (${result.correct})`;
    resultsContainer.appendChild(resultItem);
  });
}

function showModal() {
  document.getElementById('final-score-modal').classList.add('show');
}

function hideModal() {
  document.getElementById('final-score-modal').classList.remove('show');
}

document.getElementById('next-btn').addEventListener('click', moveToNextSentence);
document.getElementById('skip-btn').addEventListener('click', moveToNextSentence);
document.getElementById('restart-game-btn').addEventListener('click', startGame);

sentenceElement.addEventListener('dragstart', handleDragStart);
sentenceElement.addEventListener('dragend', handleDragEnd);
sentenceElement.addEventListener('touchstart', handleTouchStart);
sentenceElement.addEventListener('touchmove', handleTouchMove);
sentenceElement.addEventListener('touchend', handleTouchEnd);

startGame();
