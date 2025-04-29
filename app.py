from flask import Flask, render_template, request, session, redirect, url_for, jsonify
import json, os, uuid

app = Flask(__name__)
app.secret_key = os.urandom(24)

# -------------------------------------------------
#  Load lessons
# -------------------------------------------------
with open('static/data/lessons.json', 'r') as f:
    lessons = json.load(f)

# -------------------------------------------------
#  Quiz data (4 questions)
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
        "options": ["Sunflowers", "White Lilies", "Gerbera Daisies", "Tulips"],
        "answer": 1
    },
    {
        "question": "What do sunflowers primarily symbolize?",
        "options": ["Grief", "Adoration and loyalty", "Purity", "Wealth"],
        "answer": 1
    }
]

# -------------------------------------------------
#  Home
# -------------------------------------------------
@app.route('/')
def home():
    return render_template('home.html')

# -------------------------------------------------
#  Know Your Blooms (landing page)
# -------------------------------------------------
@app.route('/know_your_blooms')
def know_your_blooms():
    if 'user_id' not in session:
        session['user_id'] = str(uuid.uuid4())
        session['progress'] = {}
    session['progress']['viewed_know_your_blooms'] = True
    session.modified = True
    return render_template('know_your_blooms.html')

# -------------------------------------------------
#  Popular Blooms page
# -------------------------------------------------
@app.route('/blooms')
def blooms():
    if 'user_id' not in session:
        session['user_id'] = str(uuid.uuid4())
        session['progress'] = {}
    session['progress'].setdefault('viewed_sections', []).append('blooms')
    session.modified = True
    return render_template('blooms.html')

# -------------------------------------------------
#  Special Occasions page
# -------------------------------------------------
@app.route('/occasions')
def occasions():
    if 'user_id' not in session:
        session['user_id'] = str(uuid.uuid4())
        session['progress'] = {}
    session['progress'].setdefault('viewed_sections', []).append('occasions')
    session.modified = True
    return render_template('occasions.html')

# -------------------------------------------------
#  Bloom Quiz (one question per page)
# -------------------------------------------------
@app.route('/bloom_quiz/<int:qid>', methods=['GET', 'POST'])
def bloom_quiz(qid):
    total = len(quiz_data)
    if qid < 1 or qid > total:
        return redirect(url_for('know_your_blooms'))

    if request.method == 'POST':
        choice = request.form.get('answer')
        if choice is None:
            return render_template(
                'bloom_quiz.html',
                question=quiz_data[qid-1],
                qid=qid,
                total=total,
                error="Please select an answer."
            )
        session.setdefault('quiz_answers', {})[str(qid)] = int(choice)
        session.modified = True
        if qid < total:
            return redirect(url_for('bloom_quiz', qid=qid + 1))
        # last question → compute score
        answers = session.get('quiz_answers', {})
        correct = sum(
            1 for i, q in enumerate(quiz_data, start=1)
            if answers.get(str(i)) == q['answer']
        )
        session['quiz_score'] = correct
        session.modified = True
        return redirect(url_for('bloom_quiz_result'))

    return render_template('bloom_quiz.html',
                           question=quiz_data[qid-1],
                           qid=qid,
                           total=total)

# -------------------------------------------------
#  Quiz Results
# -------------------------------------------------
@app.route('/bloom_quiz_result')
def bloom_quiz_result():
    score = session.get('quiz_score', 0)
    total = len(quiz_data)
    passed = (score / total) >= 0.75
    return render_template(
        'bloom_quiz_result.html',
        score=score,
        total=total,
        passed=passed
    )


# -------------------------------------------------
#  Lesson pages  /learn/<n> (unchanged)
# -------------------------------------------------
@app.route('/learn/<int:lesson_number>')
def learn(lesson_number):
    if 'user_id' not in session:
        session['user_id'] = str(uuid.uuid4())
        session['progress'] = {}
    if lesson_number < 1 or lesson_number > len(lessons):
        return redirect(url_for('home'))
    lesson_data = lessons[lesson_number - 1]
    session.setdefault('progress', {}) \
           .setdefault('viewed_lessons', []) \
           .append(lesson_number)
    session.modified = True
    next_lesson = lesson_number + 1 if lesson_number < len(lessons) else None
    return render_template('learn.html',
                           lesson=lesson_data,
                           lesson_number=lesson_number,
                           next_lesson=next_lesson)

# -------------------------------------------------
#  record_progress, get_progress, record_bloom_quiz (unchanged)
# -------------------------------------------------
# ... your existing AJAX routes here ...

if __name__ == '__main__':
    app.run(debug=True)
