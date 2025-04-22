/*  quiz.js  – self‑contained quiz manager used by learn.js
    ------------------------------------------------------ */
		class QuizManager {
			constructor() {
					this.completed = false;
			}
	
			/* Render quiz step into #content-container */
			render(step) {
					this.completed = false;
	
					// Build questions
					let questionsHtml = '';
					step.questions.forEach((q, qi) => {
							let opts = '';
							q.options.forEach((opt, oi) => {
									opts += `
											<div class="form-check">
												<input class="form-check-input" type="radio"
															 name="q${qi}" id="q${qi}o${oi}" value="${oi}">
												<label class="form-check-label" for="q${qi}o${oi}">
													${opt}
												</label>
											</div>`;
							});
	
							questionsHtml += `
									<div class="quiz-question mb-4">
										<p><strong>Q${qi + 1}. ${q.text}</strong></p>
										${opts}
									</div>`;
					});
	
					// Main quiz block
					$('#content-container').html(`
							<div class="content-step quiz">
									<h3 class="mb-3">Quick&nbsp;Quiz</h3>
									${questionsHtml}
									<button id="submit-quiz-btn" class="btn btn-success mt-2">
											Submit Answers
									</button>
									<div id="quiz-result" class="fw-bold mt-3"></div>
							</div>
					`);
	
					// Hook submit handler
					$('#submit-quiz-btn').on('click', () => this.grade(step));
			}
	
			/* Evaluate answers, show score, unlock “Next” */
			grade(step) {
					const marked = step.questions.map((_, qi) =>
							parseInt($(`input[name="q${qi}"]:checked`).val(), 10)
					);
	
					if (marked.some(isNaN)) {
							alert('Please answer every question before submitting.');
							return;
					}
	
					let correct = 0;
					marked.forEach((ans, qi) => {
							if (ans === step.questions[qi].answer) correct++;
					});
	
					const score = Math.round(
							(correct / step.questions.length) * 100
					);
					$('#quiz-result').text(
							`Your score: ${correct}/${step.questions.length}  (${score}%)`
					);
	
					this.completed = true;
					// Let learn.js refresh navigation buttons
					$(document).trigger('quiz:completed');
			}
	
			isCompleted() {
					return this.completed;
			}
	}
	
	// Expose one shared instance
	const Quiz = new QuizManager();
	