from flask import Flask, render_template, request, session, redirect, url_for, jsonify
import json
import os
import uuid

app = Flask(__name__)
app.secret_key = os.urandom(24)

# -------------------------------------------------
#  Load lessons
# -------------------------------------------------
with open('static/data/lessons.json', 'r') as f:
    lessons = json.load(f)

# -------------------------------------------------
#  Home
# -------------------------------------------------
@app.route('/')
def home():
    return render_template('home.html')

# -------------------------------------------------
#  Lesson pages  /learn/<n>
# -------------------------------------------------
@app.route('/learn/<int:lesson_number>')
def learn(lesson_number):
    # Create a session if needed
    if 'user_id' not in session:
        session['user_id'] = str(uuid.uuid4())
        session['progress'] = {}

    # Validate lesson number
    if lesson_number < 1 or lesson_number > len(lessons):
        return redirect(url_for('home'))

    lesson_data = lessons[lesson_number - 1]

    # Record that user has opened this lesson
    session['progress'].setdefault('viewed_lessons', [])
    if lesson_number not in session['progress']['viewed_lessons']:
        session['progress']['viewed_lessons'].append(lesson_number)

    next_lesson = lesson_number + 1 if lesson_number < len(lessons) else None

    return render_template(
        'learn.html',
        lesson=lesson_data,
        lesson_number=lesson_number,
        next_lesson=next_lesson
    )

# -------------------------------------------------
#  NEW – Quiz pages  /quiz/<n>
# -------------------------------------------------
@app.route('/quiz/<int:lesson_number>')
def quiz(lesson_number):
    # Validate lesson #
    if lesson_number < 1 or lesson_number > len(lessons):
        return redirect(url_for('home'))

    lesson_data = lessons[lesson_number - 1]

    # Take the first quiz step (assume 1 per lesson)
    quiz_steps = [s for s in lesson_data['content'] if s['type'] == 'quiz']
    if not quiz_steps:
        return redirect(url_for('learn', lesson_number=lesson_number))

    quiz_data = quiz_steps[0]
    next_lesson = lesson_number + 1 if lesson_number < len(lessons) else None

    return render_template(
        'quiz.html',
        lesson_number=lesson_number,
        lesson_title=lesson_data['title'],
        quiz=quiz_data,
        next_lesson=next_lesson
    )

# -------------------------------------------------
#  Record user progress (AJAX)
# -------------------------------------------------
@app.route('/record_progress', methods=['POST'])
def record_progress():
    if 'user_id' not in session:
        return jsonify({'error': 'No session found'}), 400

    data = request.json
    lesson_number = data.get('lesson_number')
    step = data.get('step')

    if not lesson_number or step is None:
        return jsonify({'error': 'Missing data'}), 400

    lp = session['progress'].setdefault('lesson_progress', {})
    lp.setdefault(str(lesson_number), [])
    if step not in lp[str(lesson_number)]:
        lp[str(lesson_number)].append(step)

    session.modified = True
    return jsonify({'success': True})

# -------------------------------------------------
#  Get progress (AJAX)
# -------------------------------------------------
@app.route('/get_progress')
def get_progress():
    if 'user_id' not in session:
        return jsonify({'error': 'No session found'}), 400
    return jsonify(session['progress'])

# -------------------------------------------------
#  Run
# -------------------------------------------------
if __name__ == '__main__':
    app.run(debug=True)
