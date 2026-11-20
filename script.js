let selectedCategory = null;
let selectedDifficulty = null;
let quiz;
let timer;
let timeLeft = 15;

class Question {
    constructor(questionText, correctAnswer, incorrectAnswers) {
        this.questionText = questionText;
        this.correctAnswer = correctAnswer;
        this.answerOptions = [correctAnswer, ...incorrectAnswers];
        this.shuffleAnswers();
    }

    shuffleAnswers() {
        for (let i = this.answerOptions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.answerOptions[i], this.answerOptions[j]] = [this.answerOptions[j], this.answerOptions[i]];
        }
    }
}

class Quiz {
    constructor(questions) {
        this.questions = questions;
        this.currentQuestionIndex = 0;
        this.score = 0;
    }

    getCurrentQuestion() {
        return this.questions[this.currentQuestionIndex];
    }

    checkAnswer(answer) {
        if (answer === this.getCurrentQuestion().correctAnswer) {
            this.score++;
            return true;
        }
        return false;
    }

    nextQuestion() {
        this.currentQuestionIndex++;
    }

    isFinished() {
        return this.currentQuestionIndex >= this.questions.length;
    }
}

const startScreen = document.getElementById('first-container');
const quizScreen = document.getElementById('second-container');
const resultScreen = document.getElementById('results-container');
const categorySelect = document.getElementById('category-select');
const difficultySelect = document.getElementById('difficulty-select');

['easy','medium','hard'].forEach(difficulty => {
    const option = document.createElement('option');
    option.value = difficulty;
    option.textContent = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    difficultySelect.appendChild(option);
});

async function loadCategories() {
    const response = await fetch('https://opentdb.com/api_category.php');
    const data = await response.json();

    data.trivia_categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });
}
loadCategories();

categorySelect.addEventListener('change', e => selectedCategory = e.target.value);
difficultySelect.addEventListener('change', e => selectedDifficulty = e.target.value);

function decodeText(text){ return decodeURIComponent(text); }

async function safeFetch(url){
 const response = await fetch(url);
 if(!response.ok) throw new Error('Request failed');
 return response.json();
}

function startTimer(){
 clearInterval(timer);
 timeLeft = 15;
 document.getElementById('timer').textContent = `Time left: ${timeLeft}s`;
 timer = setInterval(()=>{
  timeLeft--;
  document.getElementById('timer').textContent = `Time left: ${timeLeft}s`;
  if(timeLeft <= 0){
   clearInterval(timer);
   handleTimeout();
  }
 },1000);
}

function renderQuestion(){
 const q = quiz.getCurrentQuestion();
 document.getElementById('question-number').textContent = `Question ${quiz.currentQuestionIndex+1} of ${quiz.questions.length}`;
 document.getElementById('question').textContent = q.questionText;
 document.getElementById('score').textContent = `Score: ${quiz.score}`;
 const container = document.getElementById('option');
 container.innerHTML='';
 q.answerOptions.forEach(answer=>{
  const btn=document.createElement('button');
  btn.textContent=answer;
  btn.addEventListener('click', ()=>selectAnswer(btn,answer));
  container.appendChild(btn);
 });
 startTimer();
}

function selectAnswer(button, answer){
 clearInterval(timer);
 const current = quiz.getCurrentQuestion();
 const buttons = document.querySelectorAll('#option button');
 buttons.forEach(b=>b.disabled=true);
 if(quiz.checkAnswer(answer)){
  button.style.backgroundColor='green';
 } else {
  button.style.backgroundColor='red';
  buttons.forEach(b=>{ if(b.textContent===current.correctAnswer){ b.style.backgroundColor='green'; }});
 }
 document.getElementById('next-correct').hidden=false;
}

function handleTimeout(){
 const current = quiz.getCurrentQuestion();
 document.querySelectorAll('#option button').forEach(b=>{
  b.disabled=true;
  if(b.textContent===current.correctAnswer) b.style.backgroundColor='green';
 });
 document.getElementById('next-correct').hidden=false;
}

function showResults(){
 resultScreen.hidden=false;
 quizScreen.hidden=true;
 const percentage=Math.round((quiz.score/quiz.questions.length)*100);
 document.getElementById('final-score').textContent=`Score: ${quiz.score}/${quiz.questions.length}`;
 document.getElementById('final-percentage').textContent=`${percentage}%`;
 document.getElementById('performance-message').textContent = percentage>=80 ? 'Great job!' : percentage>=50 ? 'Good effort!' : 'Keep practising!';
 updateBestScore(quiz.score);
}

function updateBestScore(score){
 const best = Number(localStorage.getItem('bestScore')) || 0;
 if(score > best) localStorage.setItem('bestScore', score);
 document.getElementById('best-score').textContent = localStorage.getItem('bestScore') || 0;
}
updateBestScore(0);

document.getElementById('start-quiz').addEventListener('click', async ()=>{
 if(!selectedCategory || !selectedDifficulty){ alert('Select category and difficulty first'); return; }
 const btn=document.getElementById('start-quiz');
 btn.disabled=true;
 document.getElementById('loading-message').hidden=false;
 try{
  const data = await safeFetch(`https://opentdb.com/api.php?amount=10&category=${selectedCategory}&difficulty=${selectedDifficulty}&encode=url3986`);
  if(data.response_code!==0) throw new Error('No questions');
  const questions=data.results.map(q=>new Question(decodeText(q.question),decodeText(q.correct_answer),q.incorrect_answers.map(a=>decodeText(a))));
  quiz=new Quiz(questions);
  startScreen.hidden=true;
  quizScreen.hidden=false;
  renderQuestion();
 }catch(e){
  document.getElementById('error-message').hidden=false;
 }finally{
  btn.disabled=false;
  document.getElementById('loading-message').hidden=true;
 }
});

document.getElementById('next').addEventListener('click', ()=>{
 quiz.nextQuestion();
 document.getElementById('next-correct').hidden=true;
 if(quiz.isFinished()) showResults();
 else renderQuestion();
});

document.getElementById('play-again').addEventListener('click', ()=>{
 resultScreen.hidden=true;
 startScreen.hidden=false;
 categorySelect.selectedIndex=0;
 difficultySelect.selectedIndex=0;
 selectedCategory=null;
 selectedDifficulty=null;
});
