$(document).ready(function() {
    // Initialize variables
    let currentStepIndex = 0;
    const lessonNumber = $('#lesson-number').val();
    
    // Function to render current step
    function renderCurrentStep() {
        const currentStep = lessonContent[currentStepIndex];
        let contentHtml = '';
        
        if (currentStep.type === 'introduction') {
            contentHtml = `
                <div class="content-step intro">
                    <h3>Introduction</h3>
                    <p>${currentStep.text}</p>
                </div>
            `;
        } else if (currentStep.type === 'instruction') {
            contentHtml = `
                <div class="content-step instruction">
                    <div class="instruction-container">
                        <h3 class="instruction-title">${currentStep.title}</h3>
                        <p>${currentStep.text}</p>
                        ${currentStep.image ? `<img src="/static/images/${currentStep.image}" class="step-image" alt="${currentStep.title}">` : ''}
                        <div class="instruction-detail">
                            <strong>Expert Tip:</strong> ${currentStep.detail}
                        </div>
                    </div>
                </div>
            `;
        } else if (currentStep.type === 'explanation') {
            let pointsHtml = '';
            
            currentStep.points.forEach(point => {
                pointsHtml += `
                    <div class="explanation-point">
                        <h5 class="explanation-title">${point.title}</h5>
                        <p>${point.text}</p>
                    </div>
                `;
            });
            
            contentHtml = `
                <div class="content-step explanation">
                    <h3>${currentStep.title}</h3>
                    <div class="explanation-container">
                        ${pointsHtml}
                    </div>
                </div>
            `;
        } else if (currentStep.type === 'tip') {
            contentHtml = `
                <div class="content-step tip">
                    <div class="tip-container">
                        ${currentStep.text}
                    </div>
                </div>
            `;
        } else if (currentStep.type === 'conclusion') {
            contentHtml = `
                <div class="content-step conclusion">
                    <div class="conclusion-container">
                        <h3>Congratulations!</h3>
                        <p>${currentStep.text}</p>
                    </div>
                </div>
            `;
        }
        
        $('#content-container').html(contentHtml);
        
        // Update navigation buttons
        updateNavigationButtons();
        
        // Record progress
        recordProgress(currentStepIndex);
    }
    
    // Function to record user's progress
    function recordProgress(stepIndex) {
        $.ajax({
            url: '/record_progress',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                lesson_number: lessonNumber,
                step: stepIndex
            }),
            success: function(response) {
                console.log('Progress recorded successfully');
            },
            error: function(error) {
                console.error('Error recording progress:', error);
            }
        });
    }
    
    // Function to update navigation buttons
    function updateNavigationButtons() {
        // Previous button
        if (currentStepIndex === 0) {
            $('#prev-btn').prop('disabled', true);
        } else {
            $('#prev-btn').prop('disabled', false);
        }
        
        // Next button
        if (currentStepIndex === lessonContent.length - 1) {
            $('#next-btn').hide();
            
            // Show the appropriate button for last step
            if ($('#next-lesson-btn').length) {
                $('#next-lesson-btn').show();
            } else {
                $('#finish-btn').show();
            }
        } else {
            $('#next-btn').show();
            $('#next-lesson-btn, #finish-btn').hide();
        }
    }
    
    // Event listeners for navigation buttons
    $('#prev-btn').on('click', function() {
        if (currentStepIndex > 0) {
            currentStepIndex--;
            renderCurrentStep();
        }
    });
    
    $('#next-btn').on('click', function() {
        if (currentStepIndex < lessonContent.length - 1) {
            currentStepIndex++;
            renderCurrentStep();
        }
    });
    
    // Keyboard navigation
    $(document).on('keydown', function(e) {
        // Right arrow key
        if (e.which === 39 && currentStepIndex < lessonContent.length - 1) {
            currentStepIndex++;
            renderCurrentStep();
        }
        // Left arrow key
        else if (e.which === 37 && currentStepIndex > 0) {
            currentStepIndex--;
            renderCurrentStep();
        }
    });
    
    // Initialize the page
    renderCurrentStep();
}); 