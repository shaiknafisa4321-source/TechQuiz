// TechQuiz questions (kept from your original quiz)
const questions = [
    {
        question: "What does HTML stand for?",
        answers: [
            "Hyper Text Markup Language",
            "High Tech Machine Language",
            "Hyperlinks Text Language",
            "Home Tool Markup Language"
        ],
        correct: 0
    },
    {
        question: "Which language is used to style web pages?",
        answers: ["Python", "CSS", "Java", "SQL"],
        correct: 1
    },
    {
        question: "Which language makes websites interactive?",
        answers: ["HTML", "CSS", "JavaScript", "SQL"],
        correct: 2
    },
    {
        question: "What is the full form of URL?",
        answers: [
            "Uniform Resource Locator",
            "Universal Record Link",
            "Unified Resource Language",
            "User Reference Location"
        ],
        correct: 0
    },
    {
        question: "Which Python library is used for Machine Learning?",
        answers: ["React", "Bootstrap", "Scikit-learn", "jQuery"],
        correct: 2
    },
    {
        question: "What is the purpose of a database?",
        answers: [
            "Store and organize data",
            "Design images",
            "Style web pages",
            "Browse websites"
        ],
        correct: 0
    },
    {
        question: "Why is Bootstrap used for?",
        answers: [
            "To create databases",
            "To build responsive websites quickly",
            "To write Python programs",
            "To manage computer hardware"
        ],
        correct: 1
    },
    {
        question: "Which HTML tag creates a hyperlink?",
        answers: ["<link>", "<a>", "<href>", "<url>"],
        correct: 1
    }
];

const LEADERBOARD_KEY = "techQuizLeaderboard";

let currentQuestion = 0;
let score = 0;
let playerName = "";

const screens = {
    start: document.getElementById("start-screen"),
    quiz: document.getElementById("quiz-screen"),
    result: document.getElementById("result-screen"),
    leaderboard: document.getElementById("leaderboard-screen")
};

const playerNameInput = document.getElementById("player-name");
const nameError = document.getElementById("name-error");

document.getElementById("start-button").addEventListener("click", startQuiz);
document.getElementById("next-button").addEventListener("click", nextQuestion);
document.getElementById("restart-button").addEventListener("click", startQuiz);
document.getElementById("view-leaderboard-button").addEventListener("click", showLeaderboard);
document.getElementById("result-leaderboard-button").addEventListener("click", showLeaderboard);
document.getElementById("leaderboard-play-button").addEventListener("click", startQuiz);
document.getElementById("home-button").addEventListener("click", showHome);
document.getElementById("leaderboard-home-button").addEventListener("click", showHome);
document.getElementById("clear-leaderboard-button").addEventListener("click", clearLeaderboard);

playerNameInput.addEventListener("input", () => {
    nameError.textContent = "";
});

function showScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.add("hidden"));
    screens[screenName].classList.remove("hidden");
}

function startQuiz() {
    const enteredName = playerNameInput.value.trim();

    // When starting from the result or leaderboard screen, reuse the current name.
    if (enteredName) {
        playerName = enteredName.slice(0, 24);
    } else if (!playerName) {
        nameError.textContent = "Please enter your name before starting.";
        showScreen("start");
        playerNameInput.focus();
        return;
    }

    nameError.textContent = "";
    currentQuestion = 0;
    score = 0;
    showScreen("quiz");
    showQuestion();
}

function showQuestion() {
    const questionData = questions[currentQuestion];

    document.getElementById("question-number").textContent =
        `Question ${currentQuestion + 1} of ${questions.length}`;
    document.getElementById("score").textContent = `Score: ${score}`;
    document.getElementById("question").textContent = questionData.question;
    document.getElementById("feedback").textContent = "";
    document.getElementById("next-button").classList.add("hidden");
    document.getElementById("progress-bar").style.width =
        `${(currentQuestion / questions.length) * 100}%`;

    const answersDiv = document.getElementById("answers");
    answersDiv.innerHTML = "";

    questionData.answers.forEach((answer, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = answer;
        button.classList.add("answer-button");
        button.addEventListener("click", () => checkAnswer(index));
        answersDiv.appendChild(button);
    });
}

function checkAnswer(selectedIndex) {
    const correctAnswer = questions[currentQuestion].correct;
    const buttons = document.getElementById("answers").children;

    // Prevent a player from answering the same question more than once.
    if (buttons[0].disabled) return;

    for (let i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
        if (i === correctAnswer) {
            buttons[i].classList.add("correct");
        }
    }

    const feedback = document.getElementById("feedback");

    if (selectedIndex === correctAnswer) {
        score++;
        feedback.textContent = "Correct Answer! Well Done!";
        feedback.style.color = "green";
    } else {
        buttons[selectedIndex].classList.add("wrong");
        feedback.textContent = "Wrong Answer! Try the next question.";
        feedback.style.color = "red";
    }

    document.getElementById("score").textContent = `Score: ${score}`;
    document.getElementById("progress-bar").style.width =
        `${((currentQuestion + 1) / questions.length) * 100}%`;

    const nextButton = document.getElementById("next-button");
    nextButton.textContent = currentQuestion === questions.length - 1
        ? "See Results"
        : "Next Question";
    nextButton.classList.remove("hidden");
}

function nextQuestion() {
    currentQuestion++;

    if (currentQuestion < questions.length) {
        showQuestion();
    } else {
        showResult();
    }
}

function getLeaderboard() {
    try {
        const savedScores = JSON.parse(localStorage.getItem(LEADERBOARD_KEY)) || [];
        return Array.isArray(savedScores) ? savedScores : [];
    } catch (error) {
        console.error("Could not read leaderboard data:", error);
        return [];
    }
}

function saveScore() {
    const leaderboard = getLeaderboard();

    leaderboard.push({
        name: playerName,
        score: score,
        total: questions.length,
        date: new Date().toISOString()
    });

    // Sort by highest score first. For equal scores, the earlier result ranks higher.
    leaderboard.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return new Date(a.date) - new Date(b.date);
    });

    // Keep the 50 best attempts in the browser.
    try {
        localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard.slice(0, 50)));
    } catch (error) {
        console.error("Could not save leaderboard data:", error);
        alert("Your score could not be saved. Please check your browser storage settings.");
    }

    return leaderboard;
}

function showResult() {
    showScreen("result");

    document.getElementById("final-score").textContent =
        `${playerName}, your score: ${score} / ${questions.length}`;

    let message;
    if (score === questions.length) {
        message = "Excellent! You got all answers correct!";
    } else if (score >= 5) {
        message = "Good Job! Keep Learning!";
    } else {
        message = "Keep Practicing! You can do better!";
    }
    document.getElementById("message").textContent = message;

    const leaderboard = saveScore();
    const playerPosition = leaderboard.findIndex(entry =>
        entry.name === playerName &&
        entry.score === score &&
        entry.date === leaderboard[leaderboard.length - 1]?.date
    );

    // Calculate this attempt's position using its saved timestamp.
    const latestAttempt = leaderboard
        .filter(entry => entry.name === playerName && entry.score === score)
        .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    const rank = latestAttempt
        ? leaderboard.findIndex(entry => entry === latestAttempt) + 1
        : null;

    document.getElementById("player-rank").textContent = rank
        ? `Your leaderboard position: #${rank}`
        : "Your score has been recorded!";
}

function showLeaderboard() {
    showScreen("leaderboard");
    renderLeaderboard();
}

function renderLeaderboard() {
    const leaderboard = getLeaderboard();
    const list = document.getElementById("leaderboard-list");
    const emptyMessage = document.getElementById("empty-leaderboard");

    list.innerHTML = "";

    if (leaderboard.length === 0) {
        emptyMessage.classList.remove("hidden");
        return;
    }

    emptyMessage.classList.add("hidden");

    leaderboard.slice(0, 10).forEach((entry, index) => {
        const row = document.createElement("div");
        row.className = "leaderboard-row";

        const rank = document.createElement("div");
        rank.className = "leaderboard-rank";
        rank.textContent = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`;

        const details = document.createElement("div");
        const name = document.createElement("div");
        name.className = "leaderboard-name";
        name.textContent = entry.name;

        const date = document.createElement("span");
        date.className = "leaderboard-date";
        date.textContent = entry.date
            ? new Date(entry.date).toLocaleString()
            : "";

        details.appendChild(name);
        details.appendChild(date);

        const points = document.createElement("div");
        points.className = "leaderboard-score";
        points.textContent = `${entry.score} / ${entry.total}`;

        row.appendChild(rank);
        row.appendChild(details);
        row.appendChild(points);
        list.appendChild(row);
    });
}

function clearLeaderboard() {
    const confirmed = confirm("Are you sure you want to clear all leaderboard scores?");
    if (!confirmed) return;

    localStorage.removeItem(LEADERBOARD_KEY);
    renderLeaderboard();
}

function showHome() {
    showScreen("start");
}
