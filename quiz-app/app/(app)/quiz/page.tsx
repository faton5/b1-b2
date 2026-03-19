import React, { useState } from 'react';
import { pickRandomQuestions, QuizQuestion } from './question-bank';

const QuizPage: React.FC = () => {
  const [questions] = useState<QuizQuestion[]>(pickRandomQuestions(10));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    if (selectedOption === questions[currentQuestionIndex].answer) {
      setScore(score + 1);
    }
    setSelectedOption(null);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizCompleted(false);
  };

  return (
    <div className="quiz-container">
      {quizCompleted ? (
        <div className="quiz-results">
          <h2>Quiz Completed!</h2>
          <p>Your score: {score} out of {questions.length}</p>
          <button onClick={handleRestartQuiz}>Restart Quiz</button>
        </div>
      ) : (
        <div className="quiz-question">
          <h2>{questions[currentQuestionIndex].question}</h2>
          <div className="quiz-options">
            {questions[currentQuestionIndex].options.map(option => (
              <button
                key={option.key}
                onClick={() => handleOptionSelect(option.key)}
                className={selectedOption === option.key ? 'selected' : ''}
              >
                {option.text}
              </button>
            ))}
          </div>
          <button onClick={handleNextQuestion} disabled={!selectedOption}>
            Next Question
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizPage;