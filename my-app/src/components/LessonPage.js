import React from 'react';

function LessonPage({ content, emoji }) {
  // Map technique-related emojis if not provided
  const getDefaultEmoji = () => {
    if (content.includes('Triangle')) return '📐';
    if (content.includes('Auxiliary')) return '🌺';
    if (content.includes('Linear')) return '➖';
    if (content.includes('Foliage')) return '🌿';
    return '💐';
  };

  const displayEmoji = emoji || getDefaultEmoji();
  
  return (
    <div className="lesson-page">
      <div className="lesson-placeholder">
        <div className="placeholder-container">
          <div className="placeholder-text">
            <span className="flower-emoji">{displayEmoji}</span>
            <p>Visualize a beautiful flower arrangement here</p>
          </div>
        </div>
      </div>
      <div className="lesson-text">
        <div className="teacher-bubble">
          <div className="teacher-icon">👩‍🏫</div>
          <div className="lesson-content">
            <p>{content}</p>
          </div>
        </div>
        <div className="lesson-instruction">
          <p>Click "Next" to continue</p>
        </div>
      </div>
    </div>
  );
}

export default LessonPage; 