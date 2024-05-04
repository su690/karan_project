const recognition = new webkitSpeechRecognition();
recognition.continuous = false;
recognition.lang = 'en-US';

const output = document.getElementById('output');
const startButton = document.getElementById('startButton');
const questionContainer = document.getElementById('questionContainer');

let currentQuestion = -1;
const questions = [
    {
        question: 'Interests?',
        answer: 'Identify what you enjoy doing, such as hobbies, activities, or subjects that captivate your attention and passion.'
    },
    {
        question: 'Strengths?',
        answer: 'Recognize your unique abilities and skills, such as problem-solving, communication, creativity, organization, or technical proficiency.'
    },
    {
        question: 'Career options?',
        answer: 'Explore various professions that align with your interests and strengths, considering fields like technology, customer service, education, or entrepreneurship.'
    },
    {
        question: 'Skills improvement?',
        answer: 'Enhance your abilities through training programs, workshops, online courses, and hands-on experiences relevant to your desired career path.'
    },
    {
        question: 'Assistive tech?',
        answer: 'Utilize assistive technologies such as screen readers, braille displays, magnification software, and accessible mobile apps to perform tasks effectively in the workplace.'
    },
    {
        question: 'Interview prep?',
        answer: 'Prepare for job interviews by practicing common questions, researching the company, dressing professionally, and showcasing your skills and experiences.'
    },
    {
        question: 'Job search?',
        answer: 'Use job search websites, attend networking events, explore career fairs, and consider reaching out to disability employment services for job opportunities.'
    },
    {
        question: 'Resume tips?',
        answer: 'Create a tailored resume highlighting your strengths, experiences, accomplishments, and relevant skills using accessible formats compatible with screen readers.'
    },
    {
        question: 'Workplace rights?',
        answer: 'Understand your rights under the Americans with Disabilities Act (ADA) and similar laws, including entitlement to reasonable accommodations and protections against discrimination.'
    },
    {
        question: 'Networking?',
        answer: 'Build professional connections by attending industry events, joining online communities, participating in mentorship programs, and leveraging social media platforms for networking opportunities.'
    }
];

function startInteraction() {
    startButton.disabled = true;
    speak('Welcome to the Blind Assistance Website. Do you want to proceed? Say Yes or No.');

    recognition.onresult = function(event) {
        const result = event.results[0][0].transcript.toLowerCase();
        output.textContent = `You said: ${result}`;
        if (result.includes('yes')) {
            speak('Great! This website provides career guidance for blind individuals. You can ask questions about interests, strengths, career options, and more. Let\'s begin.');
            currentQuestion = 0;
            askNextQuestion();
        } else if (result.includes('no')) {
            speak('Thank you for visiting. Exiting...');
            startButton.disabled = false;
        } else {
            speak('Sorry, I couldn\'t understand. Please say Yes or No.');
        }
    };

    recognition.onend = function() {
        recognition.start(); // Continuous listening
    };

    recognition.start();
}

function askNextQuestion() {
    if (currentQuestion >= 0 && currentQuestion < questions.length) {
        const question = questions[currentQuestion];
        displayQuestion(question.question);

        speak(`Question: ${question.question}`);
        speak('Do you want to proceed with this question? Say Yes or Next.');

        recognition.onresult = function(event) {
            const result = event.results[0][0].transcript.toLowerCase();
            output.textContent = `You said: ${result}`;
            if (result.includes('yes')) {
                displayAnswer(question.answer);
                speak(`Answer: ${question.answer}`);
                currentQuestion++;
                setTimeout(askNextQuestion, 2000); // Delay before asking the next question
            } else if (result.includes('next')) {
                currentQuestion++;
                setTimeout(askNextQuestion, 1000); // Delay before asking the next question
            } else {
                speak('Sorry, I couldn\'t understand. Please say Yes or Next.');
            }
        };

        recognition.onend = function() {
            recognition.start(); // Continuous listening
        };

        recognition.start();
    } else {
        speak('No more questions. Thank you for visiting. Exiting...');
        startButton.disabled = false;
    }
}

function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
}

function displayQuestion(question) {
    const questionElement = document.createElement('div');
    questionElement.classList.add('question');
    questionElement.textContent = question;
    questionContainer.appendChild(questionElement);
}

function displayAnswer(answer) {
    const answerElement = document.createElement('div');
    answerElement.classList.add('answer');
    answerElement.textContent = answer;
    questionContainer.appendChild(answerElement);
}
