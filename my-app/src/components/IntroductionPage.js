import React from 'react';

function IntroductionPage({ introData, onStartCourse }) {
  return (
    <div className="introduction-page">
      <div className="intro-header">
        <span className="intro-emoji">{introData.emoji}</span>
        <h3>{introData.title}</h3>
      </div>
      
      <div className="intro-content">
        <p className="intro-description">{introData.description}</p>
        
        <div className="key-points-container">
          <h4>Key Points:</h4>
          <ul className="key-points-list">
            {introData.keyPoints.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>
        
        <div className="intro-history">
          <h4>Historical Context:</h4>
          <p>{introData.history}</p>
        </div>
      </div>
      
      <div className="intro-footer">
        <div className="teacher-bubble introduction">
          <div className="teacher-icon">👩‍🏫</div>
          <div className="teacher-content">
            <p>I'll guide you through every step of this technique. Ready to get started?</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IntroductionPage; 