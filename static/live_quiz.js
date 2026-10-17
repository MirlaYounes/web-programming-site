/* ======================================================
   APPLICATION STATE
====================================================== */

let currentQuestion = 0;
let totalQuestions = 0;
let userAnswers = [];
const questionCache = {};

/* ======================================================
   CHECK WHETHER ALL QUESTIONS ARE ANSWERED
====================================================== */

function allQuestionsAnswered() {
  return (
    totalQuestions > 0 &&
    userAnswers.length === totalQuestions &&
     Array.from(userAnswers).every(answer => Number.isInteger(answer))
  );
}

/* ======================================================
   LOADING AND ERROR MESSAGES
====================================================== */

function setLoading(isLoading) {
  const loading = document.getElementById("loading");

  if (loading) {
    loading.hidden = !isLoading;
  }
}

function clearError() {
  const error = document.getElementById("error");

  if (error) {
    error.textContent = "";
    error.hidden = true;
  }
}

function showError(message) {
  setLoading(false);

  const error = document.getElementById("error");

  if (error) {
    error.textContent = message;
    error.hidden = false;
  }
}

/* ======================================================
   FETCH QUESTION COUNT
====================================================== */

async function fetchQuestionCount() {
  const response = await fetch("/api/questions/count");

  if (!response.ok) {
    throw new Error(
      `Could not load question count: ${response.status}`
    );
  }

  const data = await response.json();

  if (!Number.isInteger(data.count) || data.count <= 0) {
    throw new Error("Invalid question count returned by server.");
  }

  return data.count;
}

/* ======================================================
   FETCH ONE QUESTION AND CACHE IT
====================================================== */

async function getQuestion(index) {
  if (Object.prototype.hasOwnProperty.call(questionCache, index)) {
    return questionCache[index];
  }

  const response = await fetch(`/api/question/${index}`);

  if (!response.ok) {
    throw new Error(
      `Could not load question ${index + 1}: ${response.status}`
    );
  }

  const q = await response.json();

  if (
    typeof q.question !== "string" ||
    !Array.isArray(q.choices) ||
    !Number.isInteger(q.answer) ||
    q.answer < 0 ||
    q.answer >= q.choices.length
  ) {
    throw new Error("The server returned invalid question data.");
  }

  questionCache[index] = q;
  return q;
}

/* ======================================================
   LOAD AND DISPLAY A QUESTION
====================================================== */

async function loadQuestion(index) {
  if (index < 0 || index >= totalQuestions) {
    return;
  }

  clearError();
  setLoading(true);

  try {
    const q = await getQuestion(index);
    currentQuestion = index;
    renderQuestion(q);
  } catch (error) {
    showError(error.message || "Could not load the question.");
  } finally {
    setLoading(false);
  }
}

/* ======================================================
   SAVE AN ANSWER
====================================================== */

function saveAnswer(choiceIndex) {
  userAnswers[currentQuestion] = choiceIndex;
  clearError();
}

/* ======================================================
   NAVIGATION
====================================================== */

async function goNext() {
  if (currentQuestion < totalQuestions - 1) {
    await loadQuestion(currentQuestion + 1);
  }
}

async function goPrevious() {
  if (currentQuestion > 0) {
    await loadQuestion(currentQuestion - 1);
  }
}

async function goFirst() {
  await loadQuestion(0);
}

async function goLast() {
  await loadQuestion(totalQuestions - 1);
}

/* ======================================================
   CALCULATE SCORE
====================================================== */

function calculateScore() {
  let score = 0;

  for (let i = 0; i < totalQuestions; i++) {
    if (userAnswers[i] === questionCache[i].answer) {
      score++;
    }
  }

  return score;
}

/* ======================================================
   CALCULATE PERCENTAGE
====================================================== */

function calculatePercentage(score) {
  if (totalQuestions === 0) return 0;

  return Math.round((score / totalQuestions) * 100);
}

/* ======================================================
   PERFORMANCE MESSAGE
====================================================== */

function getPerformanceMessage(percentage) {
  if (percentage >= 80) {
    return "Excellent";
  } else if (percentage >= 60) {
    return "Good";
  } else if (percentage >= 50) {
    return "Pass";
  } else {
    return "Needs Improvement";
  }
}

/* ======================================================
   BUILD CORRECTION
====================================================== */

function buildCorrection() {
  let correction = "";

  for (let i = 0; i < totalQuestions; i++) {
    const q = questionCache[i];
    const userChoiceIndex = userAnswers[i];

    const userChoiceText =
      userChoiceIndex !== undefined
        ? q.choices[userChoiceIndex]
        : "Not answered";

    const correctChoiceText = q.choices[q.answer];

    const result =
      userChoiceIndex === q.answer ? "Correct" : "Incorrect";

    correction += `Q${i + 1}: ${q.question}\n`;
    correction += `Your Answer: ${userChoiceText}\n`;
    correction += `Correct Answer: ${correctChoiceText}\n`;
    correction += `Result: ${result}\n`;
    correction += `Explanation: ${q.explanation || ""}\n\n`;
  }

  return correction;
}

/* ======================================================
   SUBMIT QUIZ
====================================================== */

async function submitQuiz() {
  clearError();

  if (!allQuestionsAnswered()) {
    showError("Please answer all the questions before submitting."); // ADDED
    return;
  }

  setLoading(true);

  try {
    // Ensure all questions are cached for scoring/correction.
    for (let i = 0; i < totalQuestions; i++) {
      await getQuestion(i);
    }

    const score = calculateScore();
    const percentage = calculatePercentage(score);
    const message = getPerformanceMessage(percentage);
    const correction = buildCorrection();

    showResults(score, percentage, message, correction);
  } catch (error) {
    showError(error.message || "Could not submit the quiz.");
  } finally {
    setLoading(false);
  }
}

/* ======================================================
   RENDER QUESTION
====================================================== */

function renderQuestion(q) {
  clearError();

  document.getElementById("progress").textContent =
    `Question ${currentQuestion + 1} of ${totalQuestions}`;

  document.getElementById("questionText").textContent = q.question;

  const choicesContainer = document.getElementById("choices");
  choicesContainer.innerHTML = "";

  for (let i = 0; i < q.choices.length; i++) {
    const label = document.createElement("label");
    label.className = "choice";

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "answer";
    radio.value = i;

    if (userAnswers[currentQuestion] === i) {
      radio.checked = true;
    }

    radio.addEventListener("change", function () {
      saveAnswer(i);
    });

    label.appendChild(radio);
    label.appendChild(document.createTextNode(" " + q.choices[i]));

    choicesContainer.appendChild(label);
  }

  document.getElementById("firstBtn").disabled =
    currentQuestion === 0;

  document.getElementById("previousBtn").disabled =
    currentQuestion === 0;

  document.getElementById("nextBtn").disabled =
    currentQuestion === totalQuestions - 1;

  document.getElementById("lastBtn").disabled =
    currentQuestion === totalQuestions - 1;
}

/* ======================================================
   DISPLAY RESULTS
====================================================== */

function showResults(score, percentage, message, correction) {
  document.getElementById("quizPanel").style.display = "none";
  document.getElementById("resultsPanel").style.display = "block";

  document.getElementById("scoreText").textContent =
    `Score: ${score} / ${totalQuestions}`;

  document.getElementById("percentageText").textContent =
    `Percentage: ${percentage}%`;

  document.getElementById("performanceText").textContent = message;
  document.getElementById("correction").textContent = correction;
}

/* ======================================================
   START APPLICATION
====================================================== */

async function initializeQuiz() {
  setLoading(true);
  clearError();

  document.getElementById("quizPanel").style.display = "none";
  document.getElementById("resultsPanel").style.display = "none";

  try {
    totalQuestions = await fetchQuestionCount();
    userAnswers = new Array(totalQuestions);

    const firstQuestion = await getQuestion(0);
    currentQuestion = 0;

    renderQuestion(firstQuestion);
    document.getElementById("quizPanel").style.display = "";
  } catch (error) {
    showError(error.message || "Could not initialize the quiz.");
  } finally {
    setLoading(false);
  }
}

initializeQuiz();