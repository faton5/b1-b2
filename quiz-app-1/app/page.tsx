import React from 'react';
import { pickRandomQuestions, QUIZ_QUESTION_BANK } from './question-bank';

const QuizPage = () => {
  const questions = pickRandomQuestions(10); // Adjust the number of questions as needed

  return (
    <div className="quiz-container">
      <h1 className="quiz-title">Quiz Time!</h1>
      <form className="quiz-form">
        {questions.map((question) => (
          <div key={question.id} className="quiz-question">
            <h2>{question.question}</h2>
            <div className="quiz-options">
              {question.options.map((option) => (
                <label key={option.key}>
                  <input type="radio" name={`question-${question.id}`} value={option.key} />
                  {option.text}
                </label>
              ))}
            </div>
          </div>
        ))}
        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
};

export default QuizPage;