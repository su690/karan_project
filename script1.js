const questions = [
    {
        question: "Which planet is known as the Red Planet?",
        options: ["A) Venus", "B) Mars", "C) Jupiter", "D) Saturn"],
        answer: "B) Mars"
    },
    {
        question: "What is the smallest bone in the human body?",
        options: ["A) Femur", "B) Tibia", "C) Stapes", "D) Radius"],
        answer: "C) Stapes"
    },
    {
        question: "What gas do plants absorb during photosynthesis?",
        options: ["A) Nitrogen", "B) Oxygen", "C) Carbon dioxide", "D) Hydrogen"],
        answer: "C) Carbon dioxide"
    },
    {
        question: "Who discovered the theory of relativity?",
        options: ["A) Isaac Newton", "B) Albert Einstein", "C) Galileo Galilei", "D) Nikola Tesla"],
        answer: "B) Albert Einstein"
    },
    {
        question: "What is the process by which plants make their own food called?",
        options: ["A) Respiration", "B) Digestion", "C) Photosynthesis", "D) Fermentation"],
        answer: "C) Photosynthesis"
    },
    {
        question: "What is the nearest star to Earth?",
        options: ["A) Alpha Centauri", "B) Sirius", "C) Proxima Centauri", "D) Betelgeuse"],
        answer: "C) Proxima Centauri"
    },
    {
        question: "What is the Earth's primary source of energy?",
        options: ["A) Wind", "B) Fossil fuels", "C) Sunlight", "D) Geothermal energy"],
        answer: "C) Sunlight"
    },
    {
        question: "What is the hardest natural substance on Earth?",
        options: ["A) Gold", "B) Diamond", "C) Iron", "D) Quartz"],
        answer: "B) Diamond"
    },
    {
        question: "What causes the tides in the ocean?",
        options: ["A) Earth's rotation", "B) Gravitational pull of the Moon", "C) Solar radiation", "D) Underwater earthquakes"],
        answer: "B) Gravitational pull of the Moon"
    }
];

let currentQuestion = 0;
const questionContainer = document.getElementById('question-container');
const answerInput = document.getElementById('answer-input');
const resultContainer = document.getElementById('result-container');
let userResponses = [];

let speakingQuestion = false; // Flag to track if a question is being spoken
let speakingOption = false; // Flag to track if options are being spoken

function speakQuestion(question) {
    speakingQuestion = true; // Set flag to true when speaking starts
    const msg = new SpeechSynthesisUtterance(question.question);
    msg.onend = () => {
        speakingQuestion = false; // Set flag to false when speaking ends
        startSpeechRecognition(); // Start speech recognition after question is fully spoken
    };
    window.speechSynthesis.speak(msg);
}

function speakOption(option, index) {
    speakingOption = true; // Set flag to true when speaking starts
    const msg = new SpeechSynthesisUtterance(option);
    msg.onend = () => {
        speakingOption = false; // Set flag to false when speaking ends
        if (index === questions[currentQuestion].options.length - 1) {
            startSpeechRecognition(); // Start speech recognition after all options are spoken
        }
    };
    window.speechSynthesis.speak(msg);
}

function displayQuestion(question) {
    questionContainer.innerHTML = `<h3>${question.question}</h3>`;
    question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.textContent = option;
        optionDiv.addEventListener('click', () => {
            userResponses[currentQuestion - 1] = optionDiv.textContent.trim().toLowerCase();
            answerInput.value = optionDiv.textContent.trim();
            stopSpeechRecognition(); // Stop speech recognition after selecting an option
        });
        questionContainer.appendChild(optionDiv);
        speakOption(option, index); // Speak the option
    });
}

function startSpeechRecognition() {
    if (!speakingQuestion && !speakingOption) { // Check if neither question nor options are being spoken
        recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-US';

        recognition.onresult = function (event) {
            const response = event.results[0][0].transcript;
            answerInput.value = response;
            stopSpeechRecognition();
            userResponses[currentQuestion - 1] = response.trim().toLowerCase();
        };

        recognition.start();
    }
}

function stopSpeechRecognition() {
    if (recognition) {
        recognition.stop();
    }
}

function nextQuestion() {
    if (currentQuestion < questions.length) {
        const question = questions[currentQuestion];
        speakQuestion(question);
        displayQuestion(question);
        currentQuestion++;
        answerInput.value = ""; // Clear previous answer
    } else {
        questionContainer.innerHTML = "<h3>End of the exam</h3>";
        answerInput.style.display = 'none';
        resultContainer.innerHTML = "<h3>Results:</h3>";
        checkAnswers();
    }
}

answerInput.addEventListener('input', () => {
    userResponses[currentQuestion - 1] = answerInput.value.trim().toLowerCase();
});

function checkAnswers() {
    let score = 0;
    questions.forEach((question, index) => {
        const userAnswer = userResponses[index];
        const correctOption = question.answer.split(')')[0].trim().toLowerCase(); // Extract correct option letter
        const correctAnswer = question.answer.toLowerCase(); // Full correct answer
        
        let isCorrect = false;

        // Check if user's answer matches the correct option letter or the full correct answer
        if (userAnswer === correctOption || userAnswer === correctAnswer) {
            isCorrect = true;
            score++;
        }

        resultContainer.innerHTML += `<div>Question ${index + 1}: ${isCorrect ? '' : ''}. Your Answer: ${userAnswer}. Correct Answer: ${correctAnswer}</div>`;
    });
}
