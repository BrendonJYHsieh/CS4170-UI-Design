import React from 'react';

function Navbar({ onSelectTechnique, onReturnHome, currentTechnique }) {
  const techniques = [
    { id: 'triangle', name: 'Triangle Technique' },
    { id: 'auxiliary', name: 'Auxiliary Technique' },
    { id: 'linear', name: 'Linear Technique' },
    { id: 'foliage', name: 'Foliage Technique' }
  ];

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={onReturnHome}>
        <span className="logo-emoji">🌸</span>
        <h1>Flower Academy</h1>
      </div>
      
      <div className="navbar-menu">
        {techniques.map(technique => (
          <button
            key={technique.id}
            className={`navbar-item ${currentTechnique === technique.id ? 'active' : ''}`}
            onClick={() => onSelectTechnique(technique.id)}
          >
            {technique.name}
          </button>
        ))}
      </div>
      
      <div className="navbar-profile">
        <span className="user-icon">👤</span>
        <span>My Account</span>
      </div>
    </nav>
  );
}

export default Navbar; 