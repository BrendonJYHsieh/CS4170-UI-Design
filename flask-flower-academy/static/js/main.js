$(document).ready(function() {
    // Handle technique card clicks on the homepage
    $('.technique-card').on('click', function() {
        const technique = $(this).data('technique');
        window.location.href = `/select_technique/${technique}`;
    });

    // Quiz functionality
    if ($('.quiz-page').length) {
        initializeQuiz();
    }

    // Interactive activities
    if ($('.interactive-activity').length) {
        initializeInteractiveActivity();
    }

    // Handle navigation
    $('.nav-btn').on('click', function() {
        if ($(this).hasClass('disabled')) {
            return false;
        }
    });
});

// Quiz functions
function initializeQuiz() {
    const $quizOptions = $('.quiz-option');
    const technique = $('#quiz-container').data('technique');
    const quizNum = $('#quiz-container').data('quiz-num');
    const allowRetry = $('#quiz-container').data('allow-retry') === 'true';

    $quizOptions.on('click', function() {
        if ($(this).hasClass('disabled')) {
            return;
        }

        const selectedOption = $(this).data('option-index');
        
        // Submit the answer
        $.ajax({
            url: `/submit_quiz/${technique}/${quizNum}`,
            type: 'POST',
            data: { selected_option: selectedOption },
            success: function(response) {
                if (response.success) {
                    // Mark the selected option
                    $quizOptions.addClass('disabled');
                    const $selectedOption = $(`.quiz-option[data-option-index="${selectedOption}"]`);
                    $selectedOption.addClass('selected');
                    
                    // Highlight correct/incorrect
                    if (response.is_correct) {
                        $selectedOption.addClass('correct');
                        showFeedback(true, response.explanation);
                    } else {
                        $selectedOption.addClass('incorrect');
                        showFeedback(false, response.explanation, allowRetry);
                    }
                } else {
                    alert('Error submitting quiz answer. Please try again.');
                }
            },
            error: function() {
                alert('An error occurred. Please try again.');
            }
        });
    });

    // Retry quiz
    $(document).on('click', '.retry-button', function() {
        $quizOptions.removeClass('disabled selected correct incorrect');
        $('.quiz-feedback').hide();
    });
}

function showFeedback(isCorrect, explanation, allowRetry = false) {
    let feedbackHTML = `<p><strong>${isCorrect ? '✓ Correct!' : '✗ Not quite right.'}</strong> ${explanation}</p>`;
    
    if (!isCorrect && allowRetry) {
        feedbackHTML += '<button class="retry-button">Try Again</button>';
    }
    
    const $feedback = $('.quiz-feedback');
    $feedback.html(feedbackHTML);
    $feedback.removeClass('correct incorrect').addClass(isCorrect ? 'correct' : 'incorrect');
    $feedback.show();
}

// Interactive activities
function initializeInteractiveActivity() {
    const activityType = $('.interactive-activity').data('activity-type');
    const technique = $('.interactive-activity').data('technique');
    const activityNum = $('.interactive-activity').data('activity-num');
    
    switch (activityType) {
        case 'drag-and-drop':
            initDragAndDrop(technique, activityNum);
            break;
        case 'hotspot':
            initHotspot(technique, activityNum);
            break;
        case 'color-picker':
            initColorPicker(technique, activityNum);
            break;
        case 'matching':
            initMatching(technique, activityNum);
            break;
        case 'sorting':
            initSorting(technique, activityNum);
            break;
        case 'slider':
            initSlider(technique, activityNum);
            break;
        case 'texture-palette':
            initTexturePalette(technique, activityNum);
            break;
        case 'before-after':
            initBeforeAfter(technique, activityNum);
            break;
        case 'spotlight':
            initSpotlight(technique, activityNum);
            break;
        case 'draw-line':
            initDrawLine(technique, activityNum);
            break;
    }
}

// Simplified placeholder implementations for interactive activities
function initDragAndDrop(technique, activityNum) {
    let selection = '';
    
    $('.drag-item').on('click', function() {
        const item = $(this).text();
        $(this).addClass('placed');
        
        // Record selection
        selection = item;
        
        // Show feedback
        $('.activity-feedback').text(`You selected: ${item}`).show();
        
        // Submit data
        submitInteractiveData(technique, activityNum, selection);
    });
}

function initHotspot(technique, activityNum) {
    let selections = [];
    
    $('.hotspot-spot').on('click', function() {
        const spotId = $(this).data('spot-id');
        const feedback = $(this).data('feedback');
        
        $(this).addClass('clicked');
        selections.push(spotId);
        
        // Show feedback
        $('.activity-feedback').text(feedback).show();
        
        // Submit data
        submitInteractiveData(technique, activityNum, JSON.stringify(selections));
    });
}

function initColorPicker(technique, activityNum) {
    let selectedColors = [];
    
    $('.color-option').on('click', function() {
        const color = $(this).data('color');
        
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            selectedColors = selectedColors.filter(c => c !== color);
        } else {
            $(this).addClass('selected');
            selectedColors.push(color);
        }
        
        // Show feedback
        if (selectedColors.length > 0) {
            $('.activity-feedback').text(`You selected ${selectedColors.length} colors`).show();
        } else {
            $('.activity-feedback').hide();
        }
        
        // Submit data
        submitInteractiveData(technique, activityNum, JSON.stringify(selectedColors));
    });
}

function initMatching(technique, activityNum) {
    let selectedItem = null;
    let matches = {};
    
    $('.matching-item').on('click', function() {
        $('.matching-item').removeClass('selected');
        $(this).addClass('selected');
        selectedItem = $(this).data('item');
    });
    
    $('.matching-match').on('click', function() {
        if (selectedItem !== null) {
            const match = $(this).data('match');
            
            // Store the match
            matches[selectedItem] = match;
            
            // Mark as matched
            $(`.matching-item[data-item="${selectedItem}"]`).addClass('matched').removeClass('selected');
            $(this).addClass('matched');
            
            // Reset selection
            selectedItem = null;
            
            // Show feedback if all matched
            if ($('.matching-item:not(.matched)').length === 0) {
                $('.activity-feedback').text('Great job! You matched all items correctly.').show();
            }
            
            // Submit data
            submitInteractiveData(technique, activityNum, JSON.stringify(matches));
        }
    });
}

function initSorting(technique, activityNum) {
    let sortedItems = [];
    
    $('.sorting-item').on('click', function() {
        const item = $(this).text();
        
        // Add to sorted list
        sortedItems.push(item);
        $(this).hide();
        
        // Show in sorted list
        $('.sorted-items').append(`<div class="sorted-item">${item}</div>`);
        
        // Show feedback if all sorted
        if ($('.sorting-item:visible').length === 0) {
            $('.activity-feedback').text('You sorted all the items!').show();
        }
        
        // Submit data
        submitInteractiveData(technique, activityNum, JSON.stringify(sortedItems));
    });
}

function initSlider(technique, activityNum) {
    $('.slider-input').on('input change', function() {
        const value = $(this).val();
        
        // Update visual indication
        $('.slider-position').width(`${value}%`);
        
        // Submit data after sliding stops
        submitInteractiveData(technique, activityNum, value);
    });
}

function initTexturePalette(technique, activityNum) {
    let selectedTextures = [];
    const maxSelections = $('.foliage-options').data('max-selections') || 3;
    
    $('.foliage-option').on('click', function() {
        const texture = $(this).data('texture');
        
        if ($(this).hasClass('selected')) {
            // Deselect
            $(this).removeClass('selected');
            selectedTextures = selectedTextures.filter(t => t !== texture);
        } else if (selectedTextures.length < maxSelections) {
            // Select if under max
            $(this).addClass('selected');
            selectedTextures.push(texture);
        }
        
        // Update counter
        $('.selection-counter').text(`${selectedTextures.length}/${maxSelections} selected`);
        
        // Show feedback if max reached
        if (selectedTextures.length === maxSelections) {
            $('.activity-feedback').text('Great combination! You\'ve selected complementary textures.').show();
        } else {
            $('.activity-feedback').hide();
        }
        
        // Submit data
        submitInteractiveData(technique, activityNum, JSON.stringify(selectedTextures));
    });
}

// Simplified placeholder functions for remaining activity types
function initBeforeAfter(technique, activityNum) {
    $('.before-after-input').on('input', function() {
        const value = $(this).val();
        $('.before-after-slider').width(`${value}%`);
        
        // Submit data
        submitInteractiveData(technique, activityNum, value);
    });
}

function initSpotlight(technique, activityNum) {
    $('.spotlight-container').on('mousemove', function(e) {
        const containerOffset = $(this).offset();
        const x = e.pageX - containerOffset.left;
        const y = e.pageY - containerOffset.top;
        
        // Move spotlight
        $('.spotlight').css({
            left: x,
            top: y
        });
        
        // Submit data (throttled to reduce server load)
        if (!$(this).data('throttle')) {
            $(this).data('throttle', true);
            setTimeout(function() {
                submitInteractiveData(technique, activityNum, JSON.stringify({x, y}));
                $('.spotlight-container').data('throttle', false);
            }, 500);
        }
    });
}

function initDrawLine(technique, activityNum) {
    $('.line-option').on('click', function() {
        $('.line-option').removeClass('selected');
        $(this).addClass('selected');
        
        const lineType = $(this).data('line-type');
        
        // Remove existing lines
        $('.drawn-line').remove();
        
        // Add new line
        $('.drawing-area').append(`<div class="drawn-line ${lineType}"></div>`);
        
        // Submit data
        submitInteractiveData(technique, activityNum, lineType);
    });
}

// Submit interactive activity data to server
function submitInteractiveData(technique, activityNum, selectionData) {
    $.ajax({
        url: `/submit_interactive/${technique}/${activityNum}`,
        type: 'POST',
        data: { selection_data: selectionData },
        success: function(response) {
            if (!response.success) {
                console.log('Error submitting activity data');
            }
        },
        error: function() {
            console.log('Error submitting activity data');
        }
    });
} 