// scripts/addQuestions.js
require('dotenv').config();
const mongoose = require('mongoose');
const QuizQuestion = require('../models/QuizQuestion');

// Массив с 20 вопросами (пример)
const questions = [
  {
    question: "What is React?",
    correctAnswer: "A JavaScript library for building user interfaces",
    wrongAnswers: [
      "A database management system",
      "A CSS framework",
      "A programming language"
    ]
  },
  {
    question: "What does JSX stand for?",
    correctAnswer: "JavaScript XML",
    wrongAnswers: [
      "Java Syntax Extension",
      "JavaScript X-code",
      "JavaScript Extension"
    ]
  },
  {
    question: "Which hook is used to manage state in functional components?",
    correctAnswer: "useState",
    wrongAnswers: [
      "useEffect",
      "useContext",
      "useMemo"
    ]
  },
  {
    question: "What is a key in React lists used for?",
    correctAnswer: "To identify elements uniquely",
    wrongAnswers: [
      "To style components",
      "To filter elements",
      "To bind event handlers"
    ]
  },
  {
    question: "What does the virtual DOM do?",
    correctAnswer: "Efficiently updates the UI",
    wrongAnswers: [
      "Stores component state",
      "Manages CSS transitions",
      "Handles HTTP requests"
    ]
  },
  {
    question: "Which of the following is a JavaScript framework?",
    correctAnswer: "Angular",
    wrongAnswers: [
      "Django",
      "Laravel",
      "Ruby on Rails"
    ]
  },
  {
    question: "Which hook can be used to perform side effects?",
    correctAnswer: "useEffect",
    wrongAnswers: [
      "useState",
      "useReducer",
      "useCallback"
    ]
  },
  {
    question: "What is a prop in React?",
    correctAnswer: "A parameter passed to a component",
    wrongAnswers: [
      "A component's state",
      "A type of event",
      "A CSS property"
    ]
  },
  {
    question: "Which company developed React?",
    correctAnswer: "Facebook",
    wrongAnswers: [
      "Google",
      "Microsoft",
      "Twitter"
    ]
  },
  {
    question: "What is the purpose of useMemo?",
    correctAnswer: "To memoize expensive computations",
    wrongAnswers: [
      "To manage state",
      "To perform side effects",
      "To fetch data"
    ]
  },
  {
    question: "What is JSX?",
    correctAnswer: "A syntax extension for JavaScript",
    wrongAnswers: [
      "A CSS preprocessor",
      "A database query language",
      "A back-end framework"
    ]
  },
  {
    question: "What does npm stand for?",
    correctAnswer: "Node Package Manager",
    wrongAnswers: [
      "New Project Manager",
      "Network Package Manager",
      "Node Programming Module"
    ]
  },
  {
    question: "What is the primary purpose of Webpack?",
    correctAnswer: "Module bundling",
    wrongAnswers: [
      "Server-side rendering",
      "CSS preprocessing",
      "Database management"
    ]
  },
  {
    question: "Which hook is used for performance optimization by memoizing a callback function?",
    correctAnswer: "useCallback",
    wrongAnswers: [
      "useEffect",
      "useState",
      "useMemo"
    ]
  },
  {
    question: "What is the output of: typeof [] in JavaScript?",
    correctAnswer: "object",
    wrongAnswers: [
      "array",
      "undefined",
      "number"
    ]
  },
  {
    question: "Which operator is used to spread elements of an array in JavaScript?",
    correctAnswer: "Spread operator (...)",
    wrongAnswers: [
      "Rest operator",
      "Destructuring assignment",
      "Conditional operator"
    ]
  },
  {
    question: "What does CSS stand for?",
    correctAnswer: "Cascading Style Sheets",
    wrongAnswers: [
      "Computer Style Sheets",
      "Creative Style System",
      "Colorful Style Sheets"
    ]
  },
  {
    question: "What is the purpose of the Virtual DOM?",
    correctAnswer: "To optimize UI rendering",
    wrongAnswers: [
      "To store application state",
      "To compile JSX code",
      "To manage routes"
    ]
  },
  {
    question: "Which of these is a feature of ES6?",
    correctAnswer: "Arrow functions",
    wrongAnswers: [
      "Inline CSS",
      "HTTP methods",
      "SQL queries"
    ]
  },
  {
    question: "What is a higher-order component in React?",
    correctAnswer: "A component that takes another component as input and returns a new component",
    wrongAnswers: [
      "A component with state",
      "A component that renders lists",
      "A component that handles events"
    ]
  }
];

async function addQuestions() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    const inserted = await QuizQuestion.insertMany(questions);
    console.log(`Inserted ${inserted.length} questions.`);
    process.exit(0);
  } catch (error) {
    console.error("Error inserting questions:", error);
    process.exit(1);
  }
}

addQuestions();
