import React, { useState } from 'react';

function QuizPage({ question, options, correctAnswer, explanation, allowRetry = false }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  
  const handleOptionSelect = (index) => {
    if (!isAnswered) {
      setSelectedOption(index);
      setIsAnswered(true);
    }
  };
  
  const handleRetry = () => {
    if (allowRetry) {
      setSelectedOption(null);
      setIsAnswered(false);
    }
  };
  
  const isCorrect = selectedOption === correctAnswer;
  
  return (
    <div className="quiz-page">
      <div className="teacher-bubble quiz">
        <div className="teacher-icon">👩‍🏫</div>
        <h3>Let's test your knowledge:</h3>
      </div>
      
      <div className="quiz-question">
        <p>{question}</p>
      </div>
      
      <div className="quiz-options">
        {options.map((option, index) => (
          <button
            key={index}
            className={`quiz-option ${selectedOption === index ? 
              (isCorrect ? 'selected correct' : 'selected incorrect') : ''}`}
            onClick={() => handleOptionSelect(index)}
            disabled={isAnswered && (selectedOption !== index && !allowRetry)}
          >
            {String.fromCharCode(65 + index)}. {option}
          </button>
        ))}
      </div>
      
      {isAnswered && (
        <div className={`quiz-feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
          <p>
            <strong>{isCorrect ? '✓ Correct!' : '✗ Not quite right.'}</strong>
            {' '}{explanation}
          </p>
          {!isCorrect && allowRetry && (
            <button onClick={handleRetry} className="retry-button">
              Try Again
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default QuizPage; 