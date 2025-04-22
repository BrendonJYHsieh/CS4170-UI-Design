from flask import Flask, render_template, request, session, redirect, url_for, jsonify
import json
import os
import datetime
from uuid import uuid4

app = Flask(__name__)
app.secret_key = "flower_academy_secret_key"

# Ensure data directory exists
os.makedirs('data', exist_ok=True)

# Load course content
def load_course_data():
    with open('data/course_content.json', 'r') as f:
        return json.load(f)

# Helper function to log user activity
def log_user_activity(user_id, action, data=None):
    if not os.path.exists('data/user_logs'):
        os.makedirs('data/user_logs')
    
    timestamp = datetime.datetime.now().isoformat()
    log_entry = {
        'timestamp': timestamp,
        'action': action,
        'data': data
    }
    
    with open(f'data/user_logs/{user_id}.json', 'a+') as f:
        f.seek(0)
        try:
            logs = json.load(f)
        except json.JSONDecodeError:
            logs = []
        
        logs.append(log_entry)
        
        f.seek(0)
        f.truncate()
        json.dump(logs, f, indent=2)

# Routes
@app.route('/')
def home():
    if 'user_id' not in session:
        session['user_id'] = str(uuid4())
    
    log_user_activity(session['user_id'], 'visit_home')
    return render_template('index.html')

@app.route('/log', methods=['POST'])
def log():
    if 'user_id' not in session:
        return jsonify({'status': 'error', 'message': 'No user session'}), 401
    
    action = request.form.get('action')
    data = request.form.get('data')
    
    if data:
        try:
            data = json.loads(data)
        except json.JSONDecodeError:
            pass
    
    log_user_activity(session['user_id'], action, data)
    return jsonify({'status': 'success'})

@app.route('/start', methods=['POST'])
def start():
    technique = request.form.get('technique')
    if technique not in ['triangle', 'auxiliary', 'linear', 'foliage']:
        return redirect(url_for('home'))
    
    session['technique'] = technique
    log_user_activity(session['user_id'], 'select_technique', {'technique': technique})
    
    return redirect(url_for('learn', lesson_num=1))

@app.route('/learn/<int:lesson_num>')
def learn(lesson_num):
    if 'user_id' not in session:
        return redirect(url_for('home'))
    
    technique = session.get('technique')
    if not technique:
        return redirect(url_for('home'))
    
    course_data = load_course_data()
    technique_content = course_data.get(technique, {})
    
    total_lessons = len(technique_content.get('pages', []))
    
    if lesson_num < 1 or lesson_num > total_lessons:
        return redirect(url_for('learn', lesson_num=1))
    
    lesson = technique_content['pages'][lesson_num-1]
    introduction = technique_content.get('introduction', {}) if lesson_num == 1 else None
    
    log_user_activity(session['user_id'], 'view_lesson', {
        'technique': technique,
        'lesson_num': lesson_num,
        'lesson_type': lesson.get('type')
    })
    
    # Determine if this is the last lesson before quiz
    is_last_lesson = False
    for i in range(lesson_num, total_lessons):
        if technique_content['pages'][i]['type'] == 'quiz':
            is_last_lesson = (i == lesson_num)
            break
    
    return render_template(
        'learn.html',
        lesson=lesson,
        lesson_num=lesson_num,
        total_lessons=total_lessons,
        technique=technique,
        technique_title=technique_content.get('title', ''),
        introduction=introduction,
        is_last_lesson=is_last_lesson
    )

@app.route('/quiz/<int:question_num>')
def quiz(question_num):
    if 'user_id' not in session:
        return redirect(url_for('home'))
    
    technique = session.get('technique')
    if not technique:
        return redirect(url_for('home'))
    
    course_data = load_course_data()
    technique_content = course_data.get(technique, {})
    
    # Find all quiz questions for this technique
    quiz_questions = [page for page in technique_content.get('pages', []) if page.get('type') == 'quiz']
    
    total_questions = len(quiz_questions)
    
    if question_num < 1 or question_num > total_questions:
        return redirect(url_for('quiz', question_num=1))
    
    question = quiz_questions[question_num-1]
    
    log_user_activity(session['user_id'], 'view_quiz_question', {
        'technique': technique,
        'question_num': question_num
    })
    
    return render_template(
        'quiz.html',
        question=question,
        question_num=question_num,
        total_questions=total_questions,
        technique=technique
    )

@app.route('/submit_answer', methods=['POST'])
def submit_answer():
    if 'user_id' not in session:
        return jsonify({'error': 'No session found'}), 401
    
    question_num = request.form.get('question_num', type=int)
    selected_option = request.form.get('selected_option', type=int)
    
    technique = session.get('technique')
    if not technique:
        return jsonify({'error': 'No technique selected'}), 400
    
    course_data = load_course_data()
    technique_content = course_data.get(technique, {})
    
    # Find all quiz questions for this technique
    quiz_questions = [page for page in technique_content.get('pages', []) if page.get('type') == 'quiz']
    
    if question_num < 1 or question_num > len(quiz_questions):
        return jsonify({'error': 'Invalid question number'}), 400
    
    question = quiz_questions[question_num-1]
    correct_answer = question.get('correctAnswer')
    
    # Store the user's answer
    if 'quiz_answers' not in session:
        session['quiz_answers'] = {}
    
    session['quiz_answers'][str(question_num)] = {
        'selected': selected_option,
        'correct': selected_option == correct_answer
    }
    
    log_user_activity(session['user_id'], 'submit_answer', {
        'technique': technique,
        'question_num': question_num,
        'selected_option': selected_option,
        'is_correct': selected_option == correct_answer
    })
    
    return jsonify({
        'is_correct': selected_option == correct_answer,
        'explanation': question.get('explanation', '')
    })

@app.route('/results')
def results():
    if 'user_id' not in session or 'quiz_answers' not in session:
        return redirect(url_for('home'))
    
    technique = session.get('technique')
    if not technique:
        return redirect(url_for('home'))
    
    # Calculate results
    answers = session.get('quiz_answers', {})
    correct_count = sum(1 for a in answers.values() if a.get('correct', False))
    total_questions = len(answers)
    
    if total_questions == 0:
        return redirect(url_for('quiz', question_num=1))
    
    score = round((correct_count / total_questions) * 100)
    
    log_user_activity(session['user_id'], 'view_results', {
        'technique': technique,
        'score': score,
        'correct_count': correct_count,
        'total_questions': total_questions
    })
    
    return render_template(
        'results.html',
        technique=technique,
        score=score,
        correct_count=correct_count,
        total_questions=total_questions
    )

if __name__ == '__main__':
    app.run(debug=True, port=5001) 