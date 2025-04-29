/*  quiz.js — multipage version  ------------------------------------------- */
class QuizManager {
	constructor () {
			this.step        = null;   // current quiz block from template
			this.idx         = 0;      // current question index
			this.answers     = [];     // learner’s picks
			this.completed   = false;
	}

	/* Public API for quiz.html and learn.js */
	render (step) {
			this.step      = step;
			this.idx       = 0;
			this.answers   = new Array(step.questions.length).fill(null);
			this.completed = false;
			this.showQuestion();
	}
	isCompleted () { return this.completed; }

	/* ---------------- private helpers ---------------- */
	showQuestion () {
			const q        = this.step.questions[this.idx];
			const isLast   = this.idx === this.step.questions.length - 1;
			const optsHtml = q.options.map((opt, oi) => `
					<div class="form-check">
						<input class="form-check-input" type="radio"
									 name="q" id="opt${oi}" value="${oi}">
						<label class="form-check-label" for="opt${oi}">${opt}</label>
					</div>`).join('');

			$('#content-container').html(`
					<div class="content-step quiz">
						<h4 class="mb-3">Question ${this.idx + 1}/${this.step.questions.length}</h4>
						<p class="fw-bold mb-3">${q.text}</p>
						${optsHtml}
						<button id="next-btn" class="btn btn-primary mt-3" disabled>
							${isLast ? 'Show&nbsp;Result' : 'Next&nbsp;»'}
						</button>
					</div>`);

			/* enable Next once an answer is chosen */
			$('input[name="q"]').on('change', () => $('#next-btn').prop('disabled', false));
			$('#next-btn').on('click', () => this.recordAndAdvance());
	}

	recordAndAdvance () {
			const pick = parseInt($('input[name="q"]:checked').val(), 10);
			this.answers[this.idx] = pick;

			if (this.idx < this.step.questions.length - 1) {
					this.idx++;
					this.showQuestion();
			} else {
					this.showResult();
			}
	}

	showResult () {
			let correct = 0;
			this.answers.forEach((ans, i) => {
					if (ans === this.step.questions[i].answer) correct++;
			});
			const pct = Math.round((correct / this.step.questions.length) * 100);

			$('#content-container').html(`
					<div class="content-step quiz-result text-center">
						<h3 class="mb-3">Quiz Complete!</h3>
						<p class="lead">Your Score:</p>
						<h2>${correct} / ${this.step.questions.length} (${pct}%)</h2>
					</div>`);

			this.completed = true;
			$(document).trigger('quiz:completed');
	}
}

/* Expose a shared instance */
const Quiz = new QuizManager();
