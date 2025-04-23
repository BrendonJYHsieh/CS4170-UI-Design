
$(document).ready(function() {
    let currentStepIndex = 0;
    const lessonNumber = $('#lesson-number').val();

    function renderCurrentStep() {
        const currentStep = lessonContent[currentStepIndex];
        let contentHtml = '';
        if (currentStep.type === 'quiz') {
            Quiz.render(currentStep);
            afterRender();
            return;
        }

      

        if (currentStep.type === 'introduction') {
            contentHtml = `
                <div class="content-step intro">
                    <h3>Introduction</h3>
                    <p>${currentStep.text}</p>
                </div>
            `;
        } else if (currentStep.type === 'instruction') {

            if (lessonNumber == 2 && currentStep.title.includes("Trim Stems Gradually")) {
                contentHtml = `
                    <div class="content-step instruction">
                        <div class="instruction-container">
                            <h3 class="instruction-title">${currentStep.title}</h3>
                            <p>${currentStep.text}</p>

                            <!-- Green Area + Slider -->
                            <div class="arrangement-area" style="width:400px; height:300px; background:#e6f9e6; border:2px dashed #88cc88; display:flex; align-items:center; justify-content:center; margin: 20px 0;">
                                <img id="step-image" src="/static/images/step2_auxiliary1.png" style="max-width:100%; max-height:100%;">
                            </div>

                            <!-- Slider -->
                            <input type="range" min="1" max="3" value="1" id="image-slider" style="width: 45%;">

                            <div class="instruction-detail" style="margin-top:15px;">
                                <strong>Expert Tip:</strong> ${currentStep.detail}
                            </div>
                        </div>
                    </div>
                `;
            } else {
                // 其他普通 instruction
                contentHtml = `
                    <div class="content-step instruction">
                        <div class="instruction-container">
                            <h3 class="instruction-title">${currentStep.title}</h3>
                            <p>${currentStep.text}</p>

                            <div class="arrangement-area" style="width:400px; height:300px; background:#e6f9e6; border:2px dashed #88cc88; display:flex; align-items:center; justify-content:center; margin: 20px 0;">
                                <img id="step-image" src="/static/images/${currentStep.image}" alt="${currentStep.title}" style="max-width:100%; max-height:100%; display:none;">
                            </div>

                            <button id="show-image-btn" class="btn btn-success">Show Arrangement Step</button>

                            <div class="instruction-detail" style="margin-top:15px;">
                                <strong>Expert Tip:</strong> ${currentStep.detail}
                            </div>
                        </div>
                    </div>
                `;
            }
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


        if (lessonNumber == 2 && currentStep.title.includes("Trim Stems Gradually")) {
            $('#image-slider').on('input', function() {
                const level = $(this).val();
                $('#step-image').attr('src', `/static/images/step2_auxiliary${level}.png`);
            });
        } else {
            $('#show-image-btn').on('click', function() {
                $('#step-image').fadeIn();
                $(this).hide();
            });
        }
        afterRender();
    }

    function recordProgress(stepIndex) {

        $.ajax({
            url: '/record_progress',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ lesson_number: lessonNumber, step: stepIndex })
        });
    }
    function afterRender() {
        updateNavigationButtons();
        recordProgress(currentStepIndex);
    }


    function updateNavigationButtons() {
        if (currentStepIndex === 0) {
            $('#prev-btn').prop('disabled', true);
        } else {
            $('#prev-btn').prop('disabled', false);
        }

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


    $(document).on('keydown', function(e) {
        if (e.which === 39 && currentStepIndex < lessonContent.length - 1) {
            currentStepIndex++;
            renderCurrentStep();

        } else if (e.which === 37 && currentStepIndex > 0) {
            currentStepIndex--;
            renderCurrentStep();
        }
    });
   
    $(document).on('quiz:completed', updateNavigationButtons);
    renderCurrentStep();
});
