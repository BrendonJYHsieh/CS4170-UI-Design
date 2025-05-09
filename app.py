from flask import Flask, render_template, request, session, redirect, url_for, jsonify
import json, os, uuid

app = Flask(__name__)
app.secret_key = os.urandom(24)
user_progress = {}

# -------------------------------------------------
#  Load lessons
# -------------------------------------------------
with open('static/data/lessons.json', 'r') as f:
    lessons = json.load(f)

# -------------------------------------------------
#  (Existing bloom-quiz data & routes unchanged …)
# -------------------------------------------------
quiz_data = [
    {
        "question": "Which flower symbolizes purity and rebirth?",
        "options": ["Rose", "Lily", "Daisy", "Tulip"],
        "answer": 1
    },
    {
        "question": "What flowers are traditionally associated with 50th wedding anniversaries?",
        "options": ["Red Roses", "Daisies", "Yellow Roses", "Orchids"],
        "answer": 2
    },
    {
        "question": "Which flower is most appropriate for sympathy arrangements?",
        "options": ["Sunflowers", "White Lilies", "Peonies", "Gerberas"],
        "answer": 1
    },
    {
        "question": "Which part of a flower produces pollen?",
        "options": ["Stamen", "Pistil", "Petal", "Sepal"],
        "answer": 0
    }
]

# -------------------------------------------------
#  Home & static pages (UNCHANGED)
# -------------------------------------------------
@app.route('/')
def home():
    return render_template('home.html')

@app.route('/know_your_blooms')
def know_your_blooms():
    if 'user_id' not in session:
        session['user_id'] = str(uuid.uuid4())
        session['progress'] = {}
    session['progress']['viewed_know_your_blooms'] = True
    session.modified = True
    return render_template('know_your_blooms.html')

@app.route('/blooms')
def blooms():
    if 'user_id' not in session:
        session['user_id'] = str(uuid.uuid4())
        session['progress'] = {}
    session['progress'].setdefault('viewed_sections', []).append('blooms')
    session.modified = True
    return render_template('blooms.html')

@app.route('/occasions')
def occasions():
    if 'user_id' not in session:
        session['user_id'] = str(uuid.uuid4())
        session['progress'] = {}
    session['progress'].setdefault('viewed_sections', []).append('occasions')
    session.modified = True
    return render_template('occasions.html')

# -------------------------------------------------
#  Bloom-quiz routes (UNCHANGED)
# -------------------------------------------------
@app.route('/bloom_quiz/<int:qid>', methods=['GET', 'POST'])
def bloom_quiz(qid):
    total = len(quiz_data)
    if qid < 1 or qid > total:
        return redirect(url_for('home'))

    if request.method == 'POST':
        answer = int(request.form.get('answer', -1))
        session.setdefault('quiz_answers', {})[str(qid)] = answer
        session.modified = True
        if qid < total:
            return redirect(url_for('bloom_quiz', qid=qid + 1))

        answers = session.get('quiz_answers', {})
        correct = sum(
            1 for i, q in enumerate(quiz_data, start=1)
            if answers.get(str(i)) == q['answer']
        )
        session['quiz_score'] = correct
        session.modified = True
        return redirect(url_for('bloom_quiz_result'))

    return render_template(
        'bloom_quiz.html',
        question=quiz_data[qid - 1],
        qid=qid,
        total=total
    )

@app.route("/bloom_quiz_result")
def bloom_quiz_result():
    score  = session.get("quiz_score", 0)
    total  = len(quiz_data)
    passed = (score / total) >= 0.75

    # get the learner’s picks that were stored while they took the quiz
    answers = session.get("quiz_answers", {})     # e.g. {"1":"2","2":"0", ...}

    return render_template(
        "bloom_quiz_result.html",
        score=score,
        total=total,
        passed=passed,
        answers=answers,        #  ← new
        quiz_data=quiz_data     #  ← new
    )


# -------------------------------------------------
#  NEW  —  Lesson Quiz  /quiz/<lesson_number>
# -------------------------------------------------
@app.route('/quiz/<int:lesson_number>')
def quiz(lesson_number):
    """Render the quiz page for the requested lesson."""
    if lesson_number < 1 or lesson_number > len(lessons):
        return redirect(url_for('home'))

    lesson_data = lessons[lesson_number - 1]

    # Extract the quiz block from the lesson’s content
    quiz_step = next(
        (step for step in lesson_data['content'] if step.get('type') == 'quiz'),
        None
    )
    if quiz_step is None:
        # No quiz defined → fall back to lesson view
        return redirect(url_for('learn', lesson_number=lesson_number))

    next_lesson = lesson_number + 1 if lesson_number < len(lessons) else None
    return render_template(
        'quiz.html',
        lesson_title=lesson_data['title'],
        lesson_number=lesson_number,
        quiz=quiz_step,
        next_lesson=next_lesson
    )

# -------------------------------------------------
#  Lesson pages  /learn/<lesson_number>
# -------------------------------------------------
@app.route('/learn/<int:lesson_number>')
def learn(lesson_number):
    if 'user_id' not in session:
        session['user_id'] = str(uuid.uuid4())
        session['progress'] = {}
    if lesson_number < 1 or lesson_number > len(lessons):
        return redirect(url_for('home'))

    lesson_data = lessons[lesson_number - 1]
    session['progress'].setdefault('lessons', {})\
        .setdefault(str(lesson_number), {})['visited'] = True
    session.modified = True

    next_lesson = lesson_number + 1 if lesson_number < len(lessons) else None
    return render_template(
        'learn.html',
        lesson=lesson_data,
        lesson_number=lesson_number,
        next_lesson=next_lesson
    )

@app.route('/record_progress', methods=['POST'])
def record_progress():
    data = request.get_json()
    user_id = request.remote_addr

    if user_id not in user_progress:
        user_progress[user_id] = []

    user_progress[user_id].append(data)

    print(f"[{user_id}] Progress:", user_progress[user_id])
    return jsonify({'status': 'ok'})


# -------------------------------------------------
#  AJAX endpoints: record_progress, get_progress … (UNCHANGED)
# -------------------------------------------------
#  … your existing helper routes …

if __name__ == '__main__':
    app.run(debug=True)
