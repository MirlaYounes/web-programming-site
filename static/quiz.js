// ======================================================
// QUESTIONS
// ======================================================
const questions = [
{
  question: "Which of the following is a correct way to write an arrow function in JavaScript?",
  choices: [
    "const add = (a, b) => a + b;", 
    "function => add(a, b) { return a + b; }", 
    "arrow add = (a, b) => { a + b };", 
    "const add = => (a, b) { return a + b; }"
  ],
  answer: 0,
  explanation: "Arrow functions use the `=>` syntax after the parameter list to define functions concisely.",
},
   {
    question: "Which JavaScript operator tests strict equality?",
    choices: ["=", "==", "===", "!="],
    answer: 2,
    explanation: "The === operator compares both value and type without performing implicit type conversion.",
  },
{
    question: "Which keyword declares a block-scoped variable that can later be reassigned?",
    choices: ["var", "let", "const", "static"],
    answer: 1,
    explanation: "let declares a block-scoped variable whose value may later be reassigned.",
  },
  {
    question: "Which built-in method returns the length of a string in JavaScript?",
    choices: [".size", ".length", ".index()", ".count()"],
    answer: 1,
    explanation: "The .length property returns the total number of code units in a string.",
  },
  {
    question: "What will `typeof []` evaluate to?",
    choices: ["array", "object", "null", "undefined"],
    answer: 1,
    explanation: "In JavaScript, arrays are a special type of object, so typeof returns 'object'.",
  }
];


// ======================================================
// APPLICATION STATE
// ======================================================
let currentQuestion = 0;
const userAnswers = new Array(questions.length);

// ======================================================
// SAVE AN ANSWER
// ======================================================
function saveAnswer(choiceIndex) {
  //   Save the user's answer for the current question.
  userAnswers[currentQuestion] = choiceIndex;
}

// ======================================================
// NAVIGATION
// ======================================================
function goNext() {
  //   Move to the next question if not at the last question.
if(currentQuestion < questions.length - 1) {
  currentQuestion++;
  renderQuestion();
}
}
function goPrevious() {
  //   Move to the previous question if not at the first question.
if(currentQuestion > 0) {
  currentQuestion--;
  renderQuestion();
}
}

function goFirst() {
  //   Move to the first question.
  currentQuestion = 0;
  renderQuestion();
}
function goLast() {
  //   Move to the last question.
  currentQuestion = questions.length - 1;
  renderQuestion();
}

// ======================================================
// CALCULATE SCORE
// ======================================================
function calculateScore() {
  //   Calculate the user's score based on their answers.
let score=0;
for(let i=0;i<questions.length;i++){
  if(userAnswers[i] === questions[i].answer){
    score++;
  }
}
return score;
}

// ======================================================
// CALCULATE PERCENTAGE
// ======================================================
function calculatePercentage(score) {
  //   Calculate the percentage score based on the total number of questions.
 if (questions.length === 0) return 0;
  return Math.round((score / questions.length) * 100);
}

// ======================================================
// PERFORMANCE MESSAGE
// ======================================================
function getPerformanceMessage(percentage) {
  if (percentage >= 80) {
    return "Excellent";
  } else if (percentage >= 60) {
    return "Good";
  } else if (percentage >= 50) {
    return "Pass";
  } else {
    return "needs Improvement";
  }
}

// ======================================================
// BUILD CORRECTION
// ======================================================
function buildCorrection() {
  let correction = "";

  //   Build a correction string that includes the question, the user's answer,
  //   the correct answer, and an explanation for each question.


  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const userChoiceIndex = userAnswers[i];
    const userChoiceText = userChoiceIndex !== undefined ? q.choices[userChoiceIndex] : "Not answered";
    const correctChoiceText = q.choices[q.answer];
 const result =
      userChoiceIndex === q.answer
        ? "Correct"
        : "Incorrect";
    correction += `Q${i + 1}: ${q.question}\n`;
    correction += `Your Answer: ${userChoiceText}\n`;
    correction += `Correct Answer: ${correctChoiceText}\n`;
    correction += `Result: ${result}\n`;
    correction += `Explanation: ${q.explanation}\n\n`;
  }

  return correction;
}

// ======================================================
// PROVIDED INTERFACE CODE
//
// DOM manipulation and events will be studied later.
// ======================================================

// ======================================================
// SUBMIT QUIZ
// ======================================================
function submitQuiz() {
  const score = calculateScore();
  const percentage = calculatePercentage(score);
  const message = getPerformanceMessage(percentage);
  const correction = buildCorrection();
  showResults(score, percentage, message, correction);
}

function renderQuestion() {
  const q = questions[currentQuestion];

  // --------------------------------------------------
  // QUESTION NUMBER
  // --------------------------------------------------
  document.getElementById("progress").textContent =
    `Question ${currentQuestion + 1} of ${questions.length}`;

  // --------------------------------------------------
  // QUESTION
  // --------------------------------------------------
  document.getElementById("questionText").textContent = q.question;

  // --------------------------------------------------
  // CHOICES
  // --------------------------------------------------
  const choicesContainer = document.getElementById("choices");
  choicesContainer.innerHTML = "";
  for (let i = 0; i < q.choices.length; i++) {
    const label = document.createElement("label");
    label.className = "choice";
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "answer";
    radio.value = i;
    // Restore an answer previously selected
    // by the user.
    if (userAnswers[currentQuestion] === i) {
      radio.checked = true;
    }
    // When the user selects this answer,
    // save its index.
    radio.onclick = function () {
      saveAnswer(i);
    };
    label.appendChild(radio);
    label.appendChild(document.createTextNode(" " + q.choices[i]));
    choicesContainer.appendChild(label);
  }

  // --------------------------------------------------
  // NAVIGATION BUTTONS
  // --------------------------------------------------
  document.getElementById("firstBtn").disabled = currentQuestion === 0;
  document.getElementById("previousBtn").disabled = currentQuestion === 0;
  document.getElementById("nextBtn").disabled =
    currentQuestion === questions.length - 1;
  document.getElementById("lastBtn").disabled =
    currentQuestion === questions.length - 1;
}

// ======================================================
// DISPLAY RESULTS
// ======================================================
function showResults(score, percentage, message, correction) {
  document.getElementById("quizPanel").style.display = "none";
  document.getElementById("resultsPanel").style.display = "block";
  document.getElementById("scoreText").textContent =
    `Score: ${score} / ${questions.length}`;
  document.getElementById("percentageText").textContent =
    `Percentage: ${percentage}%`;
  document.getElementById("performanceText").textContent = message;
  document.getElementById("correction").textContent = correction;
}

// ======================================================
// START APPLICATION
// ======================================================
renderQuestion();
const form = document.getElementById("profile-form");
const reviewPanel = document.getElementById("review-panel");
const editBtn = document.getElementById("edit-btn");
const confirmBtn = document.getElementById("confirm-btn");

form.addEventListener("submit", function (e) {
    e.preventDefault(); 

    if (!form.checkValidity()) { 
        form.reportValidity();
        return; 
    }

    // Continue right here: collect the data and show the review panel
    const fullName = document.getElementById("fullname").value;
    const grad = document.querySelector('input[name="graduation"]:checked')?.value || "";
    const skills = [...document.querySelectorAll('input[name="skills"]:checked')].map(cb => cb.value);
    const software = [...document.getElementById("software").selectedOptions].map(opt => opt.value);

    document.getElementById("review-fullname").textContent = fullName;
    document.getElementById("review-graduation").textContent = grad;
    document.getElementById("review-skills").textContent = skills.join(", ");
    document.getElementById("review-software").textContent = software.join(", ");

    form.classList.add("hidden");
    reviewPanel.classList.add("open");
});

editBtn.addEventListener("click", function () {
    reviewPanel.classList.remove("open");
    form.classList.remove("hidden");
});

confirmBtn.addEventListener("click", function () {
    HTMLFormElement.prototype.submit.call(form);
});