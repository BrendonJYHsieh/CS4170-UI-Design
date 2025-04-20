import React, { useState } from 'react';

// Component for hotspot activity
const HotspotActivity = ({ data, onActivityComplete }) => {
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [completed, setCompleted] = useState(false);
  
  const handleHotspotClick = (index) => {
    setActiveHotspot(index);
    const updated = [...selectedItems];
    if (!updated.includes(index)) updated.push(index);
    const allClicked = updated.length === data.hotspots.length;
    setSelectedItems(updated);
    
    if (allClicked && !completed) {
      setCompleted(true);
      onActivityComplete && onActivityComplete({ activity: 'hotspot', success: true });
    }
  };
  
  return (
    <div className="interactive-activity hotspot">
      <p className="activity-instructions">{data.instructions}</p>
      <div className="activity-image-container" style={{ position: 'relative' }}>
        <div className="placeholder-container">
          <div className="placeholder-text">
            <span className="flower-emoji">🌸</span>
            <p>Imagine a beautiful flower arrangement here</p>
          </div>
          {data.hotspots.map((spot, index) => (
            <div 
              key={index}
              className={`hotspot-spot ${selectedItems.includes(index) ? 'clicked' : ''} ${activeHotspot === index ? 'active' : ''}`}
              style={{ 
                left: `${spot.x}%`, 
                top: `${spot.y}%`,
                width: `${spot.radius * 2}px`,
                height: `${spot.radius * 2}px`
              }}
              onClick={() => handleHotspotClick(index)}
            />
          ))}
        </div>
      </div>
      {activeHotspot !== null && (
        <div className="hotspot-feedback">
          <p>{data.hotspots[activeHotspot].feedback}</p>
        </div>
      )}
      {completed && (
        <div className="feedback success">
          <p>Great job! You've found all the important spots in this arrangement.</p>
        </div>
      )}
    </div>
  );
};

// Component for matching activity
const MatchingActivity = ({ data, onActivityComplete }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [userResponses, setUserResponses] = useState({});
  const [completed, setCompleted] = useState(false);
  
  const checkCompleted = (responses) => {
    return Object.keys(responses).length === data.pairs.length;
  };
  
  const handleMatchClick = (index) => {
    if (selectedItem !== null) {
      const newResponses = { ...userResponses };
      newResponses[selectedItem] = index;
      const isCompleted = checkCompleted(newResponses);
      
      setUserResponses(newResponses);
      setSelectedItem(null);
      
      if (isCompleted && !completed) {
        setCompleted(true);
        onActivityComplete && onActivityComplete({ activity: 'matching', success: true });
      }
    }
  };
  
  return (
    <div className="interactive-activity matching">
      <p className="activity-instructions">{data.instructions}</p>
      <div className="matching-container">
        <div className="matching-items">
          {data.pairs.map((pair, index) => (
            <div 
              key={index}
              className={`matching-item ${selectedItem === index ? 'selected' : ''} ${userResponses[index] !== undefined ? 'matched' : ''}`}
              onClick={() => {
                if (userResponses[index] === undefined) {
                  setSelectedItem(index);
                }
              }}
            >
              {pair.item}
            </div>
          ))}
        </div>
        <div className="matching-matches">
          {data.pairs.map((pair, index) => (
            <div 
              key={index}
              className={`matching-match ${Object.values(userResponses).includes(index) ? 'matched' : ''}`}
              onClick={() => handleMatchClick(index)}
            >
              {pair.match}
            </div>
          ))}
        </div>
      </div>
      {completed && (
        <div className="feedback success">
          <p>{data.feedback}</p>
        </div>
      )}
    </div>
  );
};

// Component for color picker activity
const ColorPickerActivity = ({ data, onActivityComplete }) => {
  const [selectedColors, setSelectedColors] = useState([]);
  const [completed, setCompleted] = useState(false);
  
  const handleColorClick = (color) => {
    let updated;
    if (selectedColors.includes(color)) {
      updated = selectedColors.filter(c => c !== color);
    } else {
      updated = [...selectedColors, color];
    }
    setSelectedColors(updated);
    
    if (updated.length >= 3 && !completed) {
      setCompleted(true);
      onActivityComplete && onActivityComplete({ activity: 'color-picker', selection: updated });
    }
  };
  
  return (
    <div className="interactive-activity color-picker">
      <p className="activity-instructions">{data.instructions}</p>
      <div className="color-box-container">
        <div className="color-box">
          <span className="flower-emoji">🌷</span>
          <p>Choose colors for your arrangement</p>
        </div>
      </div>
      <div className="color-options">
        {data.colorOptions.map((color, index) => (
          <div 
            key={index}
            className={`color-option ${selectedColors.includes(color) ? 'selected' : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => handleColorClick(color)}
          />
        ))}
      </div>
      {completed && (
        <div className="feedback success">
          <p>{data.feedback.positive}</p>
        </div>
      )}
    </div>
  );
};

// Component for spotlight activity
const SpotlightActivity = ({ data }) => {
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50 });
  const [activePoint, setActivePoint] = useState(null);
  
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSpotlightPos({ x, y });
    
    // Check if we're over any info points
    const newActivePoint = data.infoPoints.findIndex(point => {
      const distance = Math.sqrt(
        Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2)
      );
      return distance < 10;
    });
    
    setActivePoint(newActivePoint !== -1 ? newActivePoint : null);
  };
  
  return (
    <div className="interactive-activity spotlight">
      <p className="activity-instructions">{data.instructions}</p>
      <div 
        className="spotlight-container"
        onMouseMove={handleMouseMove}
      >
        <div className="spotlight-placeholder">
          <span className="flower-emoji">🌿</span>
          <p>Foliage arrangement</p>
        </div>
        <div 
          className="spotlight"
          style={{
            left: `${spotlightPos.x}%`,
            top: `${spotlightPos.y}%`,
            width: `${data.spotlightRadius}px`,
            height: `${data.spotlightRadius}px`,
            marginLeft: `-${data.spotlightRadius / 2}px`,
            marginTop: `-${data.spotlightRadius / 2}px`
          }}
        />
        {data.infoPoints.map((point, index) => (
          <div
            key={index}
            className={`info-point ${activePoint === index ? 'active' : ''}`}
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`
            }}
          />
        ))}
      </div>
      {activePoint !== null && (
        <div className="info-tooltip">
          <p>{data.infoPoints[activePoint].text}</p>
        </div>
      )}
    </div>
  );
};

// Component for draw line activity
const DrawLineActivity = ({ data, onActivityComplete }) => {
  const [selectedLine, setSelectedLine] = useState(null);
  const [completed, setCompleted] = useState(false);
  
  const handleLineSelect = (option) => {
    setSelectedLine(option);
    if (!completed) {
      setCompleted(true);
      onActivityComplete && onActivityComplete({ activity: 'draw-line', lineType: option });
    }
  };
  
  return (
    <div className="interactive-activity draw-line">
      <p className="activity-instructions">{data.instructions}</p>
      <div className="activity-image-container">
        <div className="draw-line-placeholder">
          <span className="flower-emoji">🌻</span>
          <p>Flower arrangement canvas</p>
          {selectedLine && (
            <div className={`drawn-line ${selectedLine}`} />
          )}
        </div>
      </div>
      <div className="line-options">
        {data.lineOptions.map((option, index) => (
          <button 
            key={index}
            className={`line-option ${selectedLine === option ? 'selected' : ''}`}
            onClick={() => handleLineSelect(option)}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)} Line
          </button>
        ))}
      </div>
      {completed && (
        <div className="feedback success">
          <p>{data.feedback}</p>
        </div>
      )}
    </div>
  );
};

function InteractivePage({ data, onComplete }) {
  const [interactionState, setInteractionState] = useState({
    completed: false,
    result: null,
    selectedItems: [],
    userResponses: {},
    sliderValue: 50
  });

  const handleActivityComplete = (result) => {
    setInteractionState({
      ...interactionState,
      completed: true,
      result
    });
    onComplete && onComplete(result);
  };

  const renderInteraction = () => {
    switch(data.activityType) {
      case 'drag-and-drop':
        return renderDragAndDrop();
      case 'hotspot':
        return <HotspotActivity data={data} onActivityComplete={handleActivityComplete} />;
      case 'matching':
        return <MatchingActivity data={data} onActivityComplete={handleActivityComplete} />;
      case 'sorting':
        return renderSorting();
      case 'color-picker':
        return <ColorPickerActivity data={data} onActivityComplete={handleActivityComplete} />;
      case 'slider':
        return renderSlider();
      case 'before-after':
        return renderBeforeAfter();
      case 'spotlight':
        return <SpotlightActivity data={data} />;
      case 'texture-palette':
        return renderTexturePalette();
      case 'draw-line':
        return <DrawLineActivity data={data} onActivityComplete={handleActivityComplete} />;
      default:
        return <p>Activity type not recognized</p>;
    }
  };

  const renderDragAndDrop = () => (
    <div className="interactive-activity drag-drop">
      <p className="activity-instructions">{data.instructions}</p>
      <div className="drag-drop-container">
        <div className="placeholder-container">
          <span className="flower-emoji">💐</span>
          <p>Flower arrangement area</p>
        </div>
      </div>
      <div className="drag-items">
        {data.items.map((item, index) => (
          <div 
            key={index} 
            className={`drag-item ${interactionState.selectedItems.includes(index) ? 'placed' : ''}`}
            onClick={() => {
              const updated = [...interactionState.selectedItems];
              if (!updated.includes(index)) updated.push(index);
              setInteractionState({
                ...interactionState,
                selectedItems: updated,
                completed: updated.length === data.items.length
              });
              if (updated.length === data.items.length) {
                onComplete && onComplete({ activity: 'drag-and-drop', success: true });
              }
            }}
          >
            {item}
          </div>
        ))}
      </div>
      <div className="target-zones">
        {data.targetZones.map((zone, index) => (
          <div key={index} className="target-zone">
            <p>{zone}</p>
            {interactionState.selectedItems.includes(index) && (
              <div className="placed-item">{data.items[index]}</div>
            )}
          </div>
        ))}
      </div>
      {interactionState.completed && (
        <div className="feedback success">
          <p>{data.feedback}</p>
        </div>
      )}
    </div>
  );

  const renderSorting = () => {
    return (
      <div className="interactive-activity sorting">
        <p className="activity-instructions">{data.instructions}</p>
        <div className="sorting-container">
          {interactionState.selectedItems.length === 0 ? (
            <div className="sorting-items">
              {data.items.map((item, index) => (
                <div 
                  key={index}
                  className="sorting-item"
                  onClick={() => {
                    const updated = [...interactionState.selectedItems, index];
                    setInteractionState({
                      ...interactionState,
                      selectedItems: updated,
                      completed: updated.length === data.items.length
                    });
                    if (updated.length === data.items.length) {
                      onComplete && onComplete({ 
                        activity: 'sorting', 
                        success: updated.every((item, i) => data.correctOrder[i] === data.items[item])
                      });
                    }
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          ) : (
            <div className="sorted-items">
              {interactionState.selectedItems.map((itemIndex, index) => (
                <div key={index} className="sorted-item">
                  {index + 1}. {data.items[itemIndex]}
                </div>
              ))}
            </div>
          )}
        </div>
        {interactionState.completed && (
          <div className="feedback success">
            <p>{data.feedback}</p>
          </div>
        )}
      </div>
    );
  };

  const renderSlider = () => {
    return (
      <div className="interactive-activity slider">
        <p className="activity-instructions">{data.instructions}</p>
        <div className="slider-placeholder">
          <span className="flower-emoji">🌹</span>
          <p>Adjust elements in your arrangement</p>
        </div>
        <div className="slider-container">
          <span className="slider-label">{data.sliderLabel}</span>
          <div className="slider-labels">
            <span>{data.minLabel}</span>
            <span>{data.maxLabel}</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={interactionState.sliderValue}
            onChange={(e) => {
              setInteractionState({
                ...interactionState,
                sliderValue: e.target.value
              });
            }}
            onMouseUp={() => {
              setInteractionState({
                ...interactionState,
                completed: true
              });
              onComplete && onComplete({ activity: 'slider', value: interactionState.sliderValue });
            }}
            className="slider-input"
          />
        </div>
        {interactionState.completed && (
          <div className="feedback success">
            <p>{data.feedback}</p>
          </div>
        )}
      </div>
    );
  };

  const renderBeforeAfter = () => {
    return (
      <div className="interactive-activity before-after">
        <p className="activity-instructions">{data.instructions}</p>
        <div className="before-after-container">
          <div className="before-after-placeholder">
            <div className="before-side" style={{ width: `${interactionState.sliderValue}%` }}>
              <span className="flower-emoji">🌱</span>
              <p>Before</p>
            </div>
            <div className="after-side">
              <span className="flower-emoji">🌺</span>
              <p>After</p>
            </div>
          </div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={interactionState.sliderValue}
            onChange={(e) => {
              setInteractionState({
                ...interactionState,
                sliderValue: e.target.value
              });
            }}
            onMouseUp={() => {
              setInteractionState({
                ...interactionState,
                completed: true
              });
              onComplete && onComplete({ activity: 'before-after' });
            }}
            className="before-after-input"
          />
        </div>
        {interactionState.completed && (
          <div className="feedback success">
            <p>{data.feedback}</p>
          </div>
        )}
      </div>
    );
  };

  const renderTexturePalette = () => {
    return (
      <div className="interactive-activity texture-palette">
        <p className="activity-instructions">{data.instructions}</p>
        <div className="foliage-options">
          {data.foliageOptions.map((option, index) => (
            <div 
              key={index}
              className={`foliage-option ${interactionState.selectedItems.includes(index) ? 'selected' : ''}`}
              onClick={() => {
                let updated;
                if (interactionState.selectedItems.includes(index)) {
                  updated = interactionState.selectedItems.filter(i => i !== index);
                } else if (interactionState.selectedItems.length < data.maxSelections) {
                  updated = [...interactionState.selectedItems, index];
                } else {
                  updated = [...interactionState.selectedItems];
                }
                
                setInteractionState({
                  ...interactionState,
                  selectedItems: updated,
                  completed: updated.length === data.maxSelections
                });
                
                if (updated.length === data.maxSelections) {
                  onComplete && onComplete({ 
                    activity: 'texture-palette', 
                    selection: updated.map(i => data.foliageOptions[i].name) 
                  });
                }
              }}
            >
              <h4>{option.name}</h4>
              <p>{option.texture}</p>
            </div>
          ))}
        </div>
        <div className="selection-counter">
          Selected: {interactionState.selectedItems.length} / {data.maxSelections}
        </div>
        {interactionState.completed && (
          <div className="feedback success">
            <p>{data.feedback}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="interactive-page">
      <div className="teacher-bubble interactive">
        <div className="teacher-icon">👩‍🏫</div>
        <h3>Let's try an activity:</h3>
      </div>
      
      {renderInteraction()}
      
      {!interactionState.completed && (
        <div className="interactive-instruction">
          <p>Complete the activity to continue</p>
        </div>
      )}
    </div>
  );
}

export default InteractivePage; 