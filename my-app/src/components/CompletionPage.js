import React from 'react';

function CompletionPage({ technique, onReturnHome }) {
  const getTechniqueMessage = () => {
    switch(technique) {
      case 'triangle':
        return "You've mastered the Triangle technique! This classic design will help you create balanced, harmonious arrangements.";
      case 'auxiliary':
        return "Congratulations on learning the Auxiliary technique! You now know how to enhance your focal flowers with supporting elements.";
      case 'linear':
        return "Great job on completing the Linear technique! You can now create modern, striking arrangements with strong lines.";
      case 'foliage':
        return "You've finished learning the Foliage technique! Now you can create beautiful arrangements focused on greenery and textures.";
      default:
        return "Congratulations on completing this technique!";
    }
  };

  return (
    <div className="completion-page">
      <h2>Course Completed!</h2>
      <div className="celebration">🎉</div>
      <p>{getTechniqueMessage()}</p>
      <p>Ready to learn another technique?</p>
      <button onClick={onReturnHome}>Return to Home</button>
    </div>
  );
}

export default CompletionPage; 