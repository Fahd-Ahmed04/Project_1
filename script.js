const questions = [
    {
        question: "ما هي عاصمة جمهورية مصر العربية؟",
        answers: [
            { text: "الإسكندرية", correct: false },
            { text: "القاهرة", correct: true },
            { text: "الجيزة", correct: false },
        ]
    },
    {
        question: "أي من اللغات التالية تستخدم لتنسيق صفحات الويب؟",
        answers: [
            { text: "HTML", correct: false },
            { text: "CSS", correct: true },
            { text: "Python", correct: false },
        ]
    },
    {
        question: "كم عدد الكواكب في مجموعتنا الشمسية؟",
        answers: [
            { text: "ثمانية", correct: true },
            { text: "سبعة", correct: false },
            { text: "تسعة", correct: false },
        ]
    },
    {
        question: "ما هي القيمة التقريبية للعدد (باي) π؟",
        answers: [
            { text: "2.718", correct: false },
            { text: "3.141", correct: true },
            { text: "1.618", correct: false },
        ]
    }
];

// 🔑 مفاتيح التخزين المحلية
const USER_KEY = 'quiz_username';
const COMPLETED_KEY = 'quiz_completed';
const SCORE_KEY = 'quiz_score';

let currentQuestionIndex = 0;
let score = 0;

// 🔗 عناصر واجهة المستخدم
const loginContainer = document.getElementById("login-container");
const quizContainer = document.getElementById("quiz-container");
const resultContainer = document.getElementById("result-container");

const usernameInput = document.getElementById("username-input");
const loginButton = document.getElementById("login-button");

const questionElement = document.getElementById("question");
const answerButtonsElement = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-button");

// ----------------------------------------------------
// 🆕 وظائف إدارة حالة التسجيل والاختبار
// ----------------------------------------------------

// دالة لخلط عناصر المصفوفة (لجعل الأسئلة والإجابات عشوائية)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; 
    }
}

function checkLoginState() {
    const isCompleted = localStorage.getItem(COMPLETED_KEY);
    const username = localStorage.getItem(USER_KEY);

    // إخفاء الكل أولاً
    loginContainer.style.display = 'none';
    quizContainer.style.display = 'none';
    resultContainer.style.display = 'none';

    if (username && isCompleted === 'true') {
        // الحالة 3: مسجل دخول وأكمل الاختبار
        displayResultFromStorage();
    } else if (username) {
        // الحالة 2: مسجل دخول ولم يكمل الاختبار
        quizContainer.style.display = 'block';
        startQuiz();
    } else {
        // الحالة 1: غير مسجل دخول
        loginContainer.style.display = 'block';
    }
}

function handleLogin() {
    const username = usernameInput.value.trim();
    if (username) {
        localStorage.setItem(USER_KEY, username);
        checkLoginState(); // الانتقال إلى حالة الاختبار
    } else {
        alert("الرجاء إدخال اسمك أو رقمك الجامعي.");
    }
}

function displayResultFromStorage() {
    const username = localStorage.getItem(USER_KEY) || 'يا مستخدم';
    const finalScore = localStorage.getItem(SCORE_KEY) || 0;
    
    // عرض النتيجة المخزنة
    resultContainer.innerHTML = `
        <h1>مرحباً ${username}!</h1>
        <h2>نتيجة الاختبار</h2>
        <p>لقد أكملت الاختبار سابقاً. نتيجتك النهائية هي:</p>
        <p style="font-size: 2.5rem; color: #007bff; font-weight: bold;">
            ${finalScore} / ${questions.length}
        </p>
        <p style="color: #dc3545; font-weight: bold;">
            لا يمكن إعادة الاختبار بعد التسجيل والإكمال.
        </p>
    `;
    resultContainer.style.display = 'block';
}

// ----------------------------------------------------
// وظائف الاختبار الأساسية (مُعدَّلة)
// ----------------------------------------------------

function startQuiz() {
    // خلط الأسئلة عند بدء الاختبار
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

    // خلط الإجابات
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

    // عرض الإجابة الصحيحة وتعطيل الأزرار
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
        showFinalResult(); // استدعاء دالة النتيجة النهائية
    }
}

// 📢 دالة عرض النتيجة النهائية وحفظ حالة الإكمال
function showFinalResult() {
    // 💾 حفظ حالة الإكمال والنتيجة في التخزين المحلي
    localStorage.setItem(COMPLETED_KEY, 'true');
    localStorage.setItem(SCORE_KEY, score);
    
    // الانتقال إلى عرض النتيجة المخزنة
    checkLoginState();
}

// ----------------------------------------------------
// 🚀 تفعيل الأحداث
// ----------------------------------------------------

// البدء عند تحميل الصفحة للتحقق من الحالة
document.addEventListener('DOMContentLoaded', checkLoginState);

// التعامل مع زر تسجيل الدخول
loginButton.addEventListener('click', handleLogin);

// التعامل مع زر التالي
nextButton.addEventListener("click", handleNextButton);