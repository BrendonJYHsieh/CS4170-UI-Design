/* eslint-env jquery */
$(document).ready(function () {
    let currentStepIndex = 0;
    const lessonNumber = $('#lesson-number').val();

    // Strip the quiz step out – it now lives at /quiz/<n>
    /* global lessonContent */
    lessonContent = lessonContent.filter(step => step.type !== 'quiz');

    // -------------------------------------------------
    //  Rendering
    // -------------------------------------------------
    function renderCurrentStep () {
        const currentStep = lessonContent[currentStepIndex];
        let contentHtml = '';

        // ---------- Introduction ----------
        if (currentStep.type === 'introduction') {
            contentHtml = `
                <div class="content-step intro">
                    <h3>Introduction</h3>
                    <p>${currentStep.text}</p>
                </div>
            `;
        }

        // ---------- Instruction ----------
        else if (currentStep.type === 'instruction') {
            if (lessonNumber === '2' &&
                currentStep.title.includes('Trim Stems Gradually')) {
                contentHtml = `
                    <div class="content-step instruction">
                        <div class="instruction-container">
                            <h3 class="instruction-title">${currentStep.title}</h3>
                            <p>${currentStep.text}</p>

                            <div class="arrangement-area"
                                 style="width:400px;height:300px;background:#e6f9e6;border:2px dashed #88cc88;display:flex;align-items:center;justify-content:center;margin:20px 0;">
                                <img id="step-image" src="/static/images/step2_auxiliary1.png"
                                     style="max-width:100%;max-height:100%;">
                            </div>

                            <input type="range" min="1" max="3" value="1"
                                   id="image-slider" style="width:45%;">

                            <div class="instruction-detail" style="margin-top:15px;">
                                <strong>Expert Tip:</strong> ${currentStep.detail}
                            </div>
                        </div>
                    </div>
                `;
            } else {
                contentHtml = `
                    <div class="content-step instruction">
                        <div class="instruction-container">
                            <h3 class="instruction-title">${currentStep.title}</h3>
                            <p>${currentStep.text}</p>

                            <div class="arrangement-area"
                                 style="width:400px;height:300px;background:#e6f9e6;border:2px dashed #88cc88;display:flex;align-items:center;justify-content:center;margin:20px 0;">
                                <img id="step-image" src="/static/images/${currentStep.image}"
                                     alt="${currentStep.title}"
                                     style="max-width:100%;max-height:100%;display:none;">
                            </div>

                            <button id="show-image-btn" class="btn btn-success">
                                Show Arrangement Step
                            </button>

                            <div class="instruction-detail" style="margin-top:15px;">
                                <strong>Expert Tip:</strong> ${currentStep.detail}
                            </div>
                        </div>
                    </div>
                `;
            }
        }

        // ---------- Explanation ----------
        else if (currentStep.type === 'explanation') {
            const pointsHtml = currentStep.points.map(point => `
                <div class="explanation-point">
                    <h5 class="explanation-title">${point.title}</h5>
                    <p>${point.text}</p>
                </div>`).join('');

            contentHtml = `
                <div class="content-step explanation">
                    <h3>${currentStep.title}</h3>
                    <div class="explanation-container">${pointsHtml}</div>
                </div>
            `;
        }

        // ---------- Tip ----------
        else if (currentStep.type === 'tip') {
            contentHtml = `
                <div class="content-step tip">
                    <div class="tip-container">${currentStep.text}</div>
                </div>
            `;
        }

        // ---------- Conclusion ----------
        else if (currentStep.type === 'conclusion') {
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

        // Hook up interactive bits
        if (lessonNumber === '2' &&
            currentStep.title &&
            currentStep.title.includes('Trim Stems Gradually')) {
            $('#image-slider').on('input', function () {
                const level = $(this).val();
                $('#step-image').attr(
                    'src',
                    `/static/images/step2_auxiliary${level}.png`
                );
            });
        } else {
            $('#show-image-btn').on('click', function () {
                $('#step-image').fadeIn();
                $(this).hide();
            });
        }

        afterRender();
    }

    // -------------------------------------------------
    //  Progress recording (server AJAX — unchanged)
    // -------------------------------------------------
    function recordProgress (stepIndex) {
        $.ajax({
            url: '/record_progress',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                lesson_number: lessonNumber,
                step: stepIndex
            })
        });
    }

    function afterRender () {
        updateNavigationButtons();
        recordProgress(currentStepIndex);
    }

    // -------------------------------------------------
    //  Navigation buttons
    // -------------------------------------------------
    function updateNavigationButtons () {
        // Reset state
        $('#quiz-btn').hide();

        if (currentStepIndex === 0) {
            $('#prev-btn').prop('disabled', true);
        } else {
            $('#prev-btn').prop('disabled', false);
        }

        if (currentStepIndex === lessonContent.length - 1) {
            // Last lesson step → offer the quiz
            $('#next-btn').hide();
            $('#quiz-btn').show();
            $('#next-lesson-btn, #finish-btn').hide();
        } else {
            $('#next-btn').show();
            $('#next-btn').prop('disabled', false);
            $('#next-lesson-btn, #finish-btn').hide();
        }
    }

    // -------------------------------------------------
    //  Button / key handlers
    // -------------------------------------------------
    $('#prev-btn').on('click', function () {
        if (currentStepIndex > 0) {
            currentStepIndex--;
            renderCurrentStep();
        }
    });

    $('#next-btn').on('click', function () {
        if (currentStepIndex < lessonContent.length - 1) {
            currentStepIndex++;
            renderCurrentStep();
        }
    });

    $(document).on('keydown', function (e) {
        if (e.which === 39 && currentStepIndex < lessonContent.length - 1) {
            currentStepIndex++;
            renderCurrentStep();
        } else if (e.which === 37 && currentStepIndex > 0) {
            currentStepIndex--;
            renderCurrentStep();
        }
    });

    // Initial render
    renderCurrentStep();
});
