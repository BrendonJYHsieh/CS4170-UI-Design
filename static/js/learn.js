/*  learn.js  – lesson navigation & (now) quiz support            */
/*  Requires quiz.js to be loaded BEFORE this script in learn.html */

$(document).ready(function () {
    // -----------------------------------------
    //  Variables
    // -----------------------------------------
    let currentStepIndex = 0;
    const lessonNumber   = $('#lesson-number').val();

    // -----------------------------------------
    //  Rendering
    // -----------------------------------------
    function renderCurrentStep() {
        const step = lessonContent[currentStepIndex];

        // Delegate quiz steps to Quiz manager
        if (step.type === 'quiz') {
            Quiz.render(step);
            afterRender();        // record progress, etc.
            return;
        }

        let html = '';

        if (step.type === 'introduction') {
            html = `
                <div class="content-step intro">
                  <h3>Introduction</h3>
                  <p>${step.text}</p>
                </div>`;
        } else if (step.type === 'instruction') {
            html = `
                <div class="content-step instruction">
                  <div class="instruction-container">
                    <h3 class="instruction-title">${step.title}</h3>
                    <p>${step.text}</p>
                    ${
                        step.image
                            ? `<img src="/static/images/${step.image}" 
                                    class="step-image" 
                                    alt="${step.title}">`
                            : ''
                    }
                    <div class="instruction-detail">
                      <strong>Expert Tip:</strong> ${step.detail}
                    </div>
                  </div>
                </div>`;
        } else if (step.type === 'explanation') {
            let points = '';
            step.points.forEach(p => {
                points += `
                   <div class="explanation-point">
                     <h5 class="explanation-title">${p.title}</h5>
                     <p>${p.text}</p>
                   </div>`;
            });
            html = `
                <div class="content-step explanation">
                  <h3>${step.title}</h3>
                  <div class="explanation-container">${points}</div>
                </div>`;
        } else if (step.type === 'tip') {
            html = `
                <div class="content-step tip">
                  <div class="tip-container">${step.text}</div>
                </div>`;
        } else if (step.type === 'conclusion') {
            html = `
                <div class="content-step conclusion">
                  <div class="conclusion-container">
                    <h3>Congratulations!</h3>
                    <p>${step.text}</p>
                  </div>
                </div>`;
        }

        $('#content-container').html(html);
        afterRender();            // record progress, etc.
    }

    // Shared post‑render duties
    function afterRender() {
        updateNavButtons();
        recordProgress(currentStepIndex);
    }

    // -----------------------------------------
    //  Progress tracking (server‑side)
    // -----------------------------------------
    function recordProgress(stepIdx) {
        $.ajax({
            url: '/record_progress',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ lesson_number: lessonNumber, step: stepIdx })
        });
    }

    // -----------------------------------------
    //  Navigation buttons state
    // -----------------------------------------
    function updateNavButtons() {
        // Previous
        $('#prev-btn').prop('disabled', currentStepIndex === 0);

        // Next / Finish
        if (currentStepIndex === lessonContent.length - 1) {
            $('#next-btn').hide();
            if ($('#next-lesson-btn').length) {
                $('#next-lesson-btn').show();
            } else {
                $('#finish-btn').show();
            }
        } else {
            $('#next-btn').show().prop(
                'disabled',
                (lessonContent[currentStepIndex].type === 'quiz' &&
                    !Quiz.isCompleted())
            );
            $('#next-lesson-btn, #finish-btn').hide();
        }
    }

    // -----------------------------------------
    //  Button / keyboard handlers
    // -----------------------------------------
    $('#prev-btn').on('click', () => {
        if (currentStepIndex > 0) {
            currentStepIndex--;
            renderCurrentStep();
        }
    });

    $('#next-btn').on('click', () => {
        if (currentStepIndex < lessonContent.length - 1) {
            currentStepIndex++;
            renderCurrentStep();
        }
    });

    // keyboard arrows
    $(document).on('keydown', e => {
        if (e.which === 39 && currentStepIndex < lessonContent.length - 1) {
            if (
                !(lessonContent[currentStepIndex].type === 'quiz') ||
                Quiz.isCompleted()
            ) {
                currentStepIndex++;
                renderCurrentStep();
            }
        } else if (e.which === 37 && currentStepIndex > 0) {
            currentStepIndex--;
            renderCurrentStep();
        }
    });

    // Listen for quiz completion to unlock “Next”
    $(document).on('quiz:completed', updateNavButtons);

    // -----------------------------------------
    //  Init
    // -----------------------------------------
    renderCurrentStep();
}); 