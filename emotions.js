let currentRoundSentences = [];
let currentSentenceIndex = 0;
let correctAnswers = 0;
let mugGameCount = 0;

// Function to load JSON data from the hosted file
async function loadSentencesFromJson() {
  try {
    const response = await fetch('https://raw.githubusercontent.com/yourusername/yourrepo/main/sentences_200.json'); // Replace with your actual GitHub URL
    const sentences = await response.json();
    return sentences;
  } catch (error) {
    console.error("Error loading JSON:", error);
  }
}

// Function to shuffle the array (Fisher-Yates shuffle)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Function to get random sentences from the loaded pool
function getRandomSentences(sentences, numSentences) {
  const shuffledSentences = shuffleArray(sentences);
  return shuffledSentences.slice(0, numSentences);
}

// Function to load a new round
async function loadNewRound() {
  const sentences = await loadSentencesFromJson();
  currentRoundSentences = getRandomSentences(sentences, 10);
  currentSentenceIndex = 0;
  correctAnswers = 0;
  mugGameCount = 0;
  sessionStorage.setItem('score', 0); // Initialize score
  loadSentence();
}

// Function to load the current sentence
function loadSentence() {
  if (currentSentenceIndex < currentRoundSentences.length) {
    const sentenceData = currentRoundSentences[currentSentenceIndex];
    document.querySelector('.sentence').innerHTML = sentenceData.text;
    // Dynamically load emojis
    const emojis = shuffleArray([sentenceData.correct, ...sentenceData.incorrect]);
    document.querySelector('.emoji-options').innerHTML = emojis.map(emoji =>
      `<span class="emoji" data-expression="${emoji}">${emoji}</span>`).join('');
  } else {
    showFinalResult(); // Game completed, show result
  }
}

// Function to trigger the mug-filling game
function startMugGame() {
  document.querySelector('.mug-game').style.display = 'block'; // Show the mug game section
  fillMug();
}

// Function to simulate mug filling
function fillMug() {
  const mugFill = document.querySelector('.mug-fill');
  mugFill.style.height = "100%"; // Fills the mug
}

// Function to handle completion of the mug game
document.querySelector('.complete-mug-game').addEventListener('click', function() {
  document.querySelector('.mug-game').style.display = 'none'; // Hide the mug game
  mugGameCount++;
  loadSentence();
});

// Handle emoji selection
document.addEventListener('click', function(event) {
  if (event.target.classList.contains('emoji')) {
    const selectedExpression = event.target.getAttribute('data-expression');
    const correctExpression = currentRoundSentences[currentSentenceIndex].correct;
    const feedback = document.querySelector('.feedback');

    if (selectedExpression === correctExpression) {
      feedback.textContent = "Correct!";
      correctAnswers++;

      // Update score in sessionStorage
      let score = parseInt(sessionStorage.getItem('score')) || 0;
      sessionStorage.setItem('score', score + 1);

      if (correctAnswers % 2 === 0) {
        startMugGame(); // Trigger the mug game every 2 correct answers
      } else {
        currentSentenceIndex++;
        loadSentence();
      }
    } else {
      feedback.textContent = "Wrong, moving to the next sentence.";
      currentSentenceIndex++;
      loadSentence(); // Proceed to the next sentence even if the answer is wrong
    }
  }
});

// Show final result
function showFinalResult() {
  const finalScore = sessionStorage.getItem('score');
  document.querySelector('.result').style.display = 'block';
  document.querySelector('.result').innerHTML = `
    <h2>Game Over!</h2>
    <p>Your final score is: ${finalScore}</p>
    <button id="nextPageButton">Go to the next page</button>
  `;
  document.querySelector('#nextPageButton').addEventListener('click', function() {
    window.location.href = 'next_page.html'; // Replace with the actual next page URL
  });
}

// On page load, start the first round
loadNewRound();
