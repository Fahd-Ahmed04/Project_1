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

let currentQuestionIndex = 0;
let score = 0;

const questionElement = document.getElementById("question");
const answerButtonsElement = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-button");


// 🆕 دالة لخلط عناصر المصفوفة (لجعل الأسئلة عشوائية)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        // تبديل الأماكن بين العنصر الحالي والعنصر العشوائي
        [array[i], array[j]] = [array[j], array[i]]; 
    }
}


function startQuiz() {
    // 📢 يتم خلط الأسئلة هنا في بداية كل اختبار
    shuffleArray(questions); 

    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "التالي";
    nextButton.style.display = "none";
    showQuestion();
}

function showQuestion() {
    resetState();
    const currentQuestion = questions[currentQuestionIndex];
    const questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

    // ملاحظة: يُفضل خلط الإجابات أيضاً لجعلها عشوائية
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
        button.disabled = true; // تعطيل كل الأزرار بعد الاختيار
    });
    nextButton.style.display = "block";
}

function handleNextButton() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    resetState();
    questionElement.innerHTML = `لقد أحرزت ${score} من أصل ${questions.length} سؤال!`;
    nextButton.innerHTML = "إعادة الاختبار";
    nextButton.style.display = "block";
}

nextButton.addEventListener("click", () => {
    if (currentQuestionIndex < questions.length) {
        handleNextButton();
    } else {
        startQuiz();
    }
});

startQuiz();