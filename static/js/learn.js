/*  learn.js  – displays lesson steps; now redirects to /quiz/<n> when needed  */
$(document).ready(function () {
    // -------------------------------------------------
    //  State
    // -------------------------------------------------
    let currentStepIndex = 0;
    const lessonNumber   = $('#lesson-number').val();

    // -------------------------------------------------
    //  Rendering
    // -------------------------------------------------
    function renderCurrentStep() {
        const step = lessonContent[currentStepIndex];

        /* --------  QUIZ now lives on its own page  -------- */
        if (step.type === 'quiz') {
            window.location.href = `/quiz/${lessonNumber}`;
            return;
        }
        /* -------------------------------------------------- */

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
            const pts = step.points
                .map(
                    p => `
                <div class="explanation-point">
                  <h5 class="explanation-title">${p.title}</h5>
                  <p>${p.text}</p>
                </div>`
                )
                .join('');
            html = `
              <div class="content-step explanation">
                  <h3>${step.title}</h3>
                  <div class="explanation-container">${pts}</div>
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
        afterRender();
    }

    // -------------------------------------------------
    //  Progress helpers
    // -------------------------------------------------
    function recordProgress(idx) {
        $.ajax({
            url: '/record_progress',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ lesson_number: lessonNumber, step: idx })
        });
    }

    function afterRender() {
        updateNavButtons();
        recordProgress(currentStepIndex);
    }

    // -------------------------------------------------
    //  Nav button logic
    // -------------------------------------------------
    function updateNavButtons() {
        $('#prev-btn').prop('disabled', currentStepIndex === 0);

        if (currentStepIndex === lessonContent.length - 1) {
            $('#next-btn').hide();
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

    // -------------------------------------------------
    //  UI events
    // -------------------------------------------------
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

    $(document).on('keydown', e => {
        if (e.which === 39 && currentStepIndex < lessonContent.length - 1) {
            currentStepIndex++;
            renderCurrentStep();
        } else if (e.which === 37 && currentStepIndex > 0) {
            currentStepIndex--;
            renderCurrentStep();
        }
    });

    // -------------------------------------------------
    //  Init
    // -------------------------------------------------
    renderCurrentStep();
});
