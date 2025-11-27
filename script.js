let questions = [];
let index = 0;
let correct = 0;
let wrong = 0;

const qText = document.getElementById("question-text");
const optionsBox = document.getElementById("options-box");
const expBox = document.getElementById("explanation");
const expText = document.getElementById("explanation-text");

const nextBtn = document.getElementById("next-btn");

const qNum = document.getElementById("q-num");
const qTotal = document.getElementById("q-total");

const scoreVal = document.getElementById("score-val");
const correctVal = document.getElementById("correct-val");
const wrongVal = document.getElementById("wrong-val");

/* Funny sound effects */
const popSound = new Audio("https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3");
const errorSound = new Audio("https://assets.mixkit.co/active_storage/sfx/2011/2011-preview.mp3");

/* LOAD DATA */
fetch("data.json")
    .then(r => r.json())
    .then(data => {
        questions = data;
        qTotal.textContent = questions.length;
        loadQuestion();
    });

function loadQuestion() {
    const q = questions[index];

    qNum.textContent = index + 1;
    qText.textContent = q.question;

    expBox.classList.add("hidden");

    // LOCK NEXT BUTTON STARTING EACH QUESTION
    nextBtn.classList.add("disabled");
    nextBtn.classList.add("hidden");

    optionsBox.innerHTML = "";

    q.options.forEach((opt, i) => {
        const div = document.createElement("div");
        div.className = "option";
        div.innerHTML = `<strong>${String.fromCharCode(65 + i)}</strong> ${opt}`;
        div.onclick = () => selectOption(div, opt);
        optionsBox.appendChild(div);
    });
}

function selectOption(el, chosen) {
    const q = questions[index];
    const all = document.querySelectorAll(".option");

    // Disable ALL options after selection
    all.forEach(o => o.style.pointerEvents = "none");

    if (chosen === q.correctAnswer) {
        correct++;
        scoreVal.textContent = correct;
        correctVal.textContent = correct;

        el.classList.add("correct");
        popSound.play();
        fireConfetti();

    } else {
        wrong++;
        wrongVal.textContent = wrong;

        el.classList.add("wrong");
        errorSound.play();

        // Highlight the correct answer too
        const correctOption = [...all].find(x =>
            x.innerText.includes(q.correctAnswer)
        );
        if (correctOption) correctOption.classList.add("correct");
    }

    // Reveal explanation
    expText.textContent = q.explanation;
    expBox.classList.remove("hidden");

    // ENABLE NEXT BUTTON (right OR wrong attempt)
    nextBtn.classList.remove("disabled");
    nextBtn.classList.remove("hidden");
}

function nextQuestion() {
    index++;
    if (index >= questions.length) {
        alert("Quiz Complete!");
        return;
    }
    loadQuestion();
}

nextBtn.onclick = nextQuestion;

function fireConfetti() {
    confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
    });
}
