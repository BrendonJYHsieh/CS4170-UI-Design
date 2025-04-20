import React, { useState } from 'react';
import './App.css';
import CourseContent from './components/CourseContent';
import CompletionPage from './components/CompletionPage';
import Navbar from './components/Navbar';

function App() {
  const [technique, setTechnique] = useState(null);
  const [completed, setCompleted] = useState(false);

  // Landing page to select a technique
  const renderLanding = () => (
    <div className="landing">
      <div className="landing-hero">
        <h1>Welcome to Flower Academy</h1>
        <p>Master the art of flower arrangement through our interactive courses</p>
      </div>
      
      <div className="course-selection">
        <h2>Select a Technique to Learn:</h2>
        <div className="technique-grid">
          <div className="technique-card" onClick={() => { setTechnique('triangle'); }}>
            <span className="technique-emoji">📐</span>
            <h3>Triangle</h3>
            <p>Create stable, balanced compositions using the classic triangle technique</p>
          </div>
          <div className="technique-card" onClick={() => { setTechnique('auxiliary'); }}>
            <span className="technique-emoji">✨</span>
            <h3>Auxiliary</h3>
            <p>Enhance focal flowers with complementary elements for depth and texture</p>
          </div>
          <div className="technique-card" onClick={() => { setTechnique('linear'); }}>
            <span className="technique-emoji">📏</span>
            <h3>Linear</h3>
            <p>Design modern, minimalist arrangements with strong directional lines</p>
          </div>
          <div className="technique-card" onClick={() => { setTechnique('foliage'); }}>
            <span className="technique-emoji">🌿</span>
            <h3>Foliage</h3>
            <p>Focus on leaves and greenery as primary design elements</p>
          </div>
        </div>
      </div>
    </div>
  );

  const handleCourseComplete = () => {
    setCompleted(true);
  };

  const handleReturnHome = () => {
    setTechnique(null);
    setCompleted(false);
  };

  // Determine what to render based on current state
  const renderContent = () => {
    if (technique === null) {
      return renderLanding();
    } else if (completed) {
      return <CompletionPage technique={technique} onReturnHome={handleReturnHome} />;
    } else {
      return <CourseContent technique={technique} onComplete={handleCourseComplete} />;
    }
  };

  return (
    <div className="App">
      <Navbar 
        onSelectTechnique={setTechnique} 
        onReturnHome={handleReturnHome} 
        currentTechnique={technique} 
      />
      <div className="app-content">
        {renderContent()}
      </div>
    </div>
  );
}

export default App;
