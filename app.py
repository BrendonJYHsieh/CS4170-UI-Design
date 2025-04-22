from flask import Flask, render_template, request, session, redirect, url_for, jsonify
import json
import os
import uuid

app = Flask(__name__)
app.secret_key = os.urandom(24)

# Load flower arrangement data
with open('static/data/lessons.json', 'r') as f:
    lessons = json.load(f)

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/learn/<int:lesson_number>')
def learn(lesson_number):
    # Check if user has a session ID
    if 'user_id' not in session:
        session['user_id'] = str(uuid.uuid4())
        session['progress'] = {}
    
    # Validate lesson number
    if lesson_number < 1 or lesson_number > len(lessons):
        return redirect(url_for('home'))
    
    # Get lesson data (index is 0-based, but routes are 1-based)
    lesson_data = lessons[lesson_number - 1]
    
    # Record that user has viewed this lesson
    if 'viewed_lessons' not in session['progress']:
        session['progress']['viewed_lessons'] = []
    
    if lesson_number not in session['progress']['viewed_lessons']:
        session['progress']['viewed_lessons'].append(lesson_number)
    
    # Determine next lesson
    next_lesson = lesson_number + 1 if lesson_number < len(lessons) else None
    
    return render_template('learn.html', 
                           lesson=lesson_data, 
                           lesson_number=lesson_number,
                           next_lesson=next_lesson)

@app.route('/record_progress', methods=['POST'])
def record_progress():
    if 'user_id' not in session:
        return jsonify({'error': 'No session found'}), 400
    
    data = request.json
    lesson_number = data.get('lesson_number')
    step = data.get('step')
    
    if not lesson_number or step is None:
        return jsonify({'error': 'Missing data'}), 400
    
    # Record user's progress
    if 'lesson_progress' not in session['progress']:
        session['progress']['lesson_progress'] = {}
    
    if str(lesson_number) not in session['progress']['lesson_progress']:
        session['progress']['lesson_progress'][str(lesson_number)] = []
    
    if step not in session['progress']['lesson_progress'][str(lesson_number)]:
        session['progress']['lesson_progress'][str(lesson_number)].append(step)
    
    session.modified = True
    return jsonify({'success': True})

@app.route('/get_progress')
def get_progress():
    if 'user_id' not in session:
        return jsonify({'error': 'No session found'}), 400
    
    return jsonify(session['progress'])

if __name__ == '__main__':
    app.run(debug=True) 