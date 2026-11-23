# Trivio

Trivio is a browser-based trivia quiz app built with HTML, CSS, and vanilla JavaScript. It uses the [Open Trivia Database](https://opentdb.com/api_config.php) to provide 10-question quizzes chosen by category and difficulty.

## Features

- Choose from all available Open Trivia DB categories
- Select easy, medium, or hard difficulty
- 15-second timer for each question
- Dynamically generated answer options in randomized order
- Immediate visual feedback for correct and incorrect answers
- Running score and question progress
- Final score, percentage, and performance message
- Best score saved with browser `localStorage`
- Loading, error, retry, and play-again states

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript
- Open Trivia DB API
- Browser `localStorage`

## Getting Started

### Run locally

No build step or package installation is required.

1. Clone or download this project.
2. Open `index.html` directly in a browser.


## How to Play

1. Choose a trivia category.
2. Choose a difficulty level.
3. Select **Start Quiz**.
4. Answer each question before the 15-second timer expires.
5. Use **Next** to move to the following question.
6. Review your final score and percentage at the end.
7. Select **Play Again** to start another quiz.

## Project Structure

```text
.
├── index.html
├── style.css
├── script.js
├── README.md
└── AppScreenshot/
```


