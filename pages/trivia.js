// Trivia Section
let triviaQuestions = [];
let triviaIndex = 0;
let score = 0;

// Function to shuffle an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Fetch trivia questions
fetch("../trivia.json")
  .then((response) => response.json())
  .then((data) => {
    // Shuffle the questions
    triviaQuestions = shuffleArray(data);
    // Shuffle the options for each question
    triviaQuestions.forEach((question) => {
      question.options = shuffleArray(question.options);
    });
    loadTrivia();
  })
  .catch((error) => console.error("Error loading trivia:", error));

// Load Trivia Questions
function loadTrivia() {
  const triviaContent = document.getElementById("trivia-content");

  // Check if trivia game is complete
  if (triviaIndex >= triviaQuestions.length) {
    triviaContent.innerHTML = `
      <p>Trivia completed! Your score: ${score}/${triviaQuestions.length}</p>
      <button id="retry-trivia">Retry Trivia</button>
    `;
    document.getElementById("retry-trivia").addEventListener("click", () => {
      triviaIndex = 0;
      score = 0;
      loadTrivia();
    });
    return;
  }

  // Load the current question
  const question = triviaQuestions[triviaIndex];
  triviaContent.innerHTML = `
    <div class="trivia-question">
      <p class="question-text">${question.question}</p>
      <div class="trivia-options">
        ${question.options
          .map(
            (option) => `
          <button class="trivia-option">${option}</button>
        `
          )
          .join("")}
      </div>
      <p class="trivia-progress">Question ${triviaIndex + 1} of ${
    triviaQuestions.length
  }</p>
    </div>
  `;

  // Add click listeners to the options
  document.querySelectorAll(".trivia-option").forEach((button) => {
    button.addEventListener("click", () => checkAnswer(button.textContent));
  });
}

// Check Trivia Answer
function checkAnswer(selected) {
  const question = triviaQuestions[triviaIndex];
  const options = document.querySelectorAll(".trivia-option");

  // Highlight correct and wrong answers
  options.forEach((option) => {
    if (option.textContent === question.answer) {
      option.classList.add("correct");
    }
    if (option.textContent === selected) {
      option.classList.add(selected === question.answer ? "correct" : "wrong");
    }
    option.disabled = true; // Disable buttons after selecting an answer
  });

  // Update score if the answer is correct
  if (selected === question.answer) {
    score++;
  }

  // Move to the next question after 2 seconds
  setTimeout(() => {
    triviaIndex++;
    loadTrivia();
  }, 1000);
}
