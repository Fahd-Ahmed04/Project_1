const questions = [
    {
        question: "بدأ الجيل الثاني للتعليم الإلكتروني مع بداية استعمال الإنترنت.",
        answers: [
            { text: "صح", correct: true },
            { text: "خطا", correct: false },
        ]
    },
    {
        question: "أي من الأدوات التالية تُعتبر من أدوات بناء محتوى بيئات التعلم الشخصية؟ (الإجابة: المدونات)",
        answers: [
            { text: "المؤتمرات", correct: false },
            { text: "المدونات", correct: true },
            { text: "البريد الإلكتروني", correct: false },
            { text: "الشاشات", correct: false },
        ]
    },
    {
        question: "صح ام خطا : أهم الحواس المستخدمة في بيئات تعلم الواقع الافتراضي هي حاسة اللمس.",
        answers: [
            { text: "صح", correct: true },
            { text: "خطا", correct: false },
        ]
    },
    {
        question: "يُعتبر التعليم المدمج أحد أنواع التعليم الإلكتروني.",
        answers: [
            { text: "صح", correct: true },
            { text: "خطا", correct: false },
        ]
    },
    {
        question: "أي من التالي لا يُعتبر من أجهزة قراءة الكتاب الإلكتروني؟",
        answers: [
            { text: "القلم الضوئي", correct: true },
            { text: "القارئ الإلكتروني", correct: false },
            { text: "الهاتف الذكي", correct: false },
            { text: "الحاسوب اللوحي", correct: false },
        ]
    },
    {
        question: "أي من التالي لا يُعتبر من أنظمة إدارة التعلم الإلكتروني؟",
        answers: [
            { text: "Moodle", correct: false },
            { text: "Blackboard", correct: false },
            { text: "Java Script", correct: true },
            { text: "LMS", correct: false },
        ]
    },
    {
        question: "لا يحتاج التعليم الإلكتروني المباشر إلى وجود المتعلمين في نفس وقت وجود المعلم.",
            answers: [
            { text: "صح", correct: false },
            { text: "خطا", correct: true },
        ]
    },
    {
        question: "السؤال: يقدم تطبيق Human body VR 3D خدمة عرض المدن والشوارع بصورة ثلاثية الأبعاد بدقة عالية.",
        answers: [
            
            { text: "صح", correct: false },
            { text: "خطا", correct: true },
        
        ]
    },
    {
        question: " تُعرف بيئات التعلم الشخصية بأنها أنظمة تدعم التعليم والتعلم وتحاكي البيئة الافتراضية وتعمل عبر الإنترنت.",
        answers: [
            
            { text: "صح", correct: false },
            { text: "خطا", correct: true },
        
        ]
    },
    {
        question: "أي من الخيارات التالية لا يُعتبر من متطلبات التعليم الإلكتروني؟",
        answers: [
            
            { text: "عقد اللقاءات الإلكترونية", correct: false },
            { text: "توفر شبكة الإنترنت", correct: false },
            { text: "تأهيل المعلمين", correct: false },
            { text: "الحضور إلى المؤسسة التعليمية", correct: true },
        
        ]
    },
];

const USER_KEY = 'quiz_username';
const EMAIL_KEY = 'quiz_email';


let currentQuestionIndex = 0;
let score = 0;

const loginContainer = document.getElementById("login-container");
const quizContainer = document.getElementById("quiz-container");
const resultContainer = document.getElementById("result-container");

const usernameInput = document.getElementById("username-input");
const loginButton = document.getElementById("login-button");
const emailInput = document.getElementById("email-input");

const questionElement = document.getElementById("question");
const answerButtonsElement = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-button");

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function checkLoginState() {
    const username = localStorage.getItem(USER_KEY);

    loginContainer.style.display = 'none';
    quizContainer.style.display = 'none';
    resultContainer.style.display = 'none';

    if (username) {
        quizContainer.style.display = 'block';
        startQuiz();
    } else {
        loginContainer.style.display = 'block';
    }
}

function handleLogin() {
    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();

    if (username && email) {
        localStorage.setItem(USER_KEY, username);
        localStorage.setItem(EMAIL_KEY, email);

        checkLoginState();
    } else {
        alert("الرجاء إدخال الاسم والإيميل.");
    }
}

function startQuiz() {
    shuffleArray(questions);

    currentQuestionIndex = 0;
    score = 0;
    nextButton.style.display = "none";
    showQuestion();
}

function showQuestion() {
    resetState();
    const currentQuestion = questions[currentQuestionIndex];
    const questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

    shuffleArray(currentQuestion.answers);

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click", selectAnswer);
        answerButtonsElement.appendChild(button);
    });
}

function resetState() {
    nextButton.style.display = "none";
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function selectAnswer(e) {
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";

    if (isCorrect) {
        selectedBtn.classList.add("correct");
        score++;
    } else {
        selectedBtn.classList.add("incorrect");
    }

    Array.from(answerButtonsElement.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.classList.add("correct");
        }
        button.disabled = true;
    });
    nextButton.style.display = "block";
}

function handleNextButton() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showFinalResult();
    }
}

function showFinalResult() {
    const username = localStorage.getItem(USER_KEY);
    const email = localStorage.getItem(EMAIL_KEY);

    quizContainer.style.display = "none";

    resultContainer.innerHTML = `
        <h2>نتيجتك النهائية</h2>

        <p><strong>الاسم:</strong> ${username}</p>
        <p><strong>البريد الإلكتروني:</strong> ${email}</p>

        <p style="font-size: 2rem; color:#007bff; font-weight:bold;">
            ${score} / ${questions.length}
        </p>

        <button id="restart-btn" class="btn" style="margin-top:15px;">إعادة الاختبار</button>
        <button id="logout-btn" class="btn" style="background:#dc3545; margin-top:15px;">تسجيل الخروج</button>
    `;

    resultContainer.style.display = "block";

    document.getElementById("restart-btn").addEventListener("click", restartQuiz);
    document.getElementById("logout-btn").addEventListener("click", logoutUser);
}

function restartQuiz() {
    score = 0;
    currentQuestionIndex = 0;

    resultContainer.style.display = "none";
    quizContainer.style.display = "block";

    startQuiz();
}

function logoutUser() {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(EMAIL_KEY);
    location.reload();
}

document.addEventListener('DOMContentLoaded', checkLoginState);

loginButton.addEventListener('click', handleLogin);

nextButton.addEventListener("click", handleNextButton);
