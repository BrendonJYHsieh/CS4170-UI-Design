/*  quiz.js — multipage version with bar-style review badges -------------- */
class QuizManager {
	constructor () {
			this.step      = null;
			this.idx       = 0;
			this.answers   = [];
			this.completed = false;
	}

	/* ---------------- public API ---------------- */
	render (step) {
			this.step      = step;
			this.idx       = 0;
			this.answers   = new Array(step.questions.length).fill(null);
			this.completed = false;
			this.showQuestion();
	}
	isCompleted () { return this.completed; }

	/* ---------------- helpers ---------------- */
	showQuestion () {
			const q      = this.step.questions[this.idx];
			const isLast = this.idx === this.step.questions.length - 1;

			const optsHtml = q.options.map((opt, oi) => `
					<div class="form-check mb-1">
						<input class="form-check-input" type="radio"
									 name="q" id="opt${oi}" value="${oi}">
						<label class="form-check-label" for="opt${oi}">
							${opt}
						</label>
					</div>`).join('');

			$('#content-container').html(`
					<div class="content-step quiz">
						<h4 class="mb-4">Question ${this.idx + 1}/${this.step.questions.length}</h4>
						<p class="fw-bold mb-4">${q.text}</p>
						${optsHtml}
						<button id="next-btn" class="btn btn-primary mt-3" disabled>
							${isLast ? 'Show&nbsp;Result' : 'Next&nbsp;»'}
						</button>
					</div>`);

			$('input[name="q"]').on('change', () =>
					$('#next-btn').prop('disabled', false));
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

	/* ---------------- styled review ---------------- */
	showResult () {
			let correct = 0;
			this.answers.forEach((ans, i) => {
					if (ans === this.step.questions[i].answer) correct++;
			});
			const pct = Math.round(
					(correct / this.step.questions.length) * 100
			);

			const reviewHtml = this.step.questions.map((q, qi) => {
					const userPick = this.answers[qi];
					return `
						<div class="card mb-4 shadow-sm">
							<div class="card-body">
								<p class="fw-bold mb-3">Q${qi + 1}. ${q.text}</p>
								${q.options.map((opt, oi) => {
											let style = '';
											if (oi === q.answer) {
													style = 'background-color:#d1e7dd'; /* light green */
											} else if (oi === userPick) {
													style = 'background-color:#f8d7da'; /* light red */
											}
											return `<div class="rounded p-2 mb-1" style="${style}">${opt}</div>`;
								}).join('')}
							</div>
						</div>`;
			}).join('');

			$('#content-container').html(`
					<div class="content-step quiz-result">
						<h3 class="text-center mb-1">Quiz Complete!</h3>
						<p class="lead text-center">Your Score:</p>
						<h2 class="text-center mb-5">${correct} / ${this.step.questions.length} (${pct}%)</h2>
						<h4 class="mb-4">Review</h4>
						${reviewHtml}
					</div>`);

			this.completed = true;
			$(document).trigger('quiz:completed');
	}
}

/* shared instance */
const Quiz = new QuizManager();
