from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import json
import os
import datetime

app = Flask(__name__)
app.secret_key = 'flower_academy_secret_key'

# Add Jinja filter for converting numbers to letters
@app.template_filter('alpha')
def alpha_filter(number):
    return chr(65 + number)  # A=65, B=66, etc. in ASCII

# Load course content from JSON file
def load_course_data():
    with open(os.path.join(os.path.dirname(__file__), 'static', 'data', 'course_data.json'), 'r') as f:
        return json.load(f)

# Initialize user data storage
def init_user_session():
    if 'user_id' not in session:
        session['user_id'] = datetime.datetime.now().strftime('%Y%m%d%H%M%S')
        session['progress'] = {
            'technique': None,
            'current_page': -1,
            'quiz_answers': {},
            'activity_selections': {},
            'started_at': datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'pages_visited': {}
        }

# Save user interaction data
def log_user_activity(activity_type, data):
    # Create logs directory if it doesn't exist
    logs_dir = os.path.join(os.path.dirname(__file__), 'logs')
    if not os.path.exists(logs_dir):
        os.makedirs(logs_dir)
    
    timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    log_entry = {
        'user_id': session.get('user_id', 'unknown'),
        'timestamp': timestamp,
        'activity_type': activity_type,
        'data': data
    }
    
    # Append to log file
    log_file = os.path.join(logs_dir, 'user_activity.json')
    with open(log_file, 'a+') as f:
        f.write(json.dumps(log_entry) + '\n')

@app.route('/')
def home():
    init_user_session()
    return render_template('home.html')

@app.route('/select_technique/<technique>')
def select_technique(technique):
    init_user_session()
    session['progress']['technique'] = technique
    session['progress']['current_page'] = -1  # Start with introduction
    session.modified = True
    
    log_user_activity('select_technique', {'technique': technique})
    return redirect(url_for('learn', page_num=-1))

@app.route('/learn/<int:page_num>')
def learn(page_num):
    init_user_session()
    course_data = load_course_data()
    technique = session['progress']['technique']
    
    if not technique:
        return redirect(url_for('home'))
    
    # Update current page in session
    session['progress']['current_page'] = page_num
    session['progress']['pages_visited'][str(page_num)] = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    session.modified = True
    
    # Log the page visit
    log_user_activity('page_visit', {'technique': technique, 'page_num': page_num})
    
    # Determine the type of page
    if page_num == -1:
        # Introduction page
        return render_template('introduction.html', 
                               technique=technique,
                               content=course_data[technique]['introduction'])
    else:
        # Regular content page
        try:
            page_data = course_data[technique]['pages'][page_num]
            total_pages = len(course_data[technique]['pages'])
            
            if page_data['type'] == 'lesson':
                return render_template('lesson.html', 
                                       technique=technique,
                                       page=page_data,
                                       page_num=page_num,
                                       total_pages=total_pages)
            elif page_data['type'] == 'quiz':
                return render_template('quiz.html', 
                                       technique=technique,
                                       page=page_data,
                                       page_num=page_num,
                                       total_pages=total_pages)
            elif page_data['type'] == 'interactive':
                return render_template('interactive.html', 
                                       technique=technique,
                                       page=page_data,
                                       page_num=page_num,
                                       total_pages=total_pages)
            else:
                return "Unknown page type", 400
        except (IndexError, KeyError):
            return "Page not found", 404

@app.route('/submit_quiz/<technique>/<int:quiz_num>', methods=['POST'])
def submit_quiz(technique, quiz_num):
    init_user_session()
    course_data = load_course_data()
    
    # Get quiz data and user's answer
    try:
        quiz_data = None
        page_index = -1
        
        # Find the quiz in the pages
        for i, page in enumerate(course_data[technique]['pages']):
            if page['type'] == 'quiz' and i == quiz_num:
                quiz_data = page
                page_index = i
                break
        
        if not quiz_data:
            return jsonify({'success': False, 'message': 'Quiz not found'}), 404
        
        selected_option = int(request.form.get('selected_option', -1))
        is_correct = selected_option == quiz_data['correctAnswer']
        
        # Store answer in session
        if 'quiz_answers' not in session['progress']:
            session['progress']['quiz_answers'] = {}
        
        session['progress']['quiz_answers'][str(quiz_num)] = {
            'selected_option': selected_option,
            'is_correct': is_correct,
            'timestamp': datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
        session.modified = True
        
        # Log quiz answer
        log_user_activity('quiz_answer', {
            'technique': technique,
            'quiz_num': quiz_num,
            'selected_option': selected_option,
            'is_correct': is_correct
        })
        
        return jsonify({
            'success': True,
            'is_correct': is_correct,
            'explanation': quiz_data['explanation']
        })
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/submit_interactive/<technique>/<int:activity_num>', methods=['POST'])
def submit_interactive(technique, activity_num):
    init_user_session()
    
    # Get user's selections
    selection_data = request.form.get('selection_data', '')
    
    # Store in session
    if 'activity_selections' not in session['progress']:
        session['progress']['activity_selections'] = {}
    
    session['progress']['activity_selections'][str(activity_num)] = {
        'data': selection_data,
        'timestamp': datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    }
    session.modified = True
    
    # Log activity selection
    log_user_activity('interactive_activity', {
        'technique': technique,
        'activity_num': activity_num,
        'selection_data': selection_data
    })
    
    return jsonify({'success': True})

@app.route('/quiz_results')
def quiz_results():
    init_user_session()
    
    if 'progress' not in session or 'quiz_answers' not in session['progress']:
        return redirect(url_for('home'))
    
    technique = session['progress']['technique']
    quiz_answers = session['progress'].get('quiz_answers', {})
    
    # Calculate score
    total_questions = len(quiz_answers)
    correct_answers = sum(1 for answer in quiz_answers.values() if answer.get('is_correct', False))
    
    if total_questions > 0:
        score_percentage = (correct_answers / total_questions) * 100
    else:
        score_percentage = 0
    
    log_user_activity('view_results', {
        'technique': technique,
        'correct_answers': correct_answers,
        'total_questions': total_questions,
        'score_percentage': score_percentage
    })
    
    return render_template('quiz_results.html',
                           technique=technique,
                           correct_answers=correct_answers,
                           total_questions=total_questions,
                           score_percentage=score_percentage)

@app.route('/complete_course')
def complete_course():
    init_user_session()
    
    technique = session['progress']['technique']
    log_user_activity('course_completion', {'technique': technique})
    
    # Mark course as completed
    session['progress']['completed_at'] = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    session.modified = True
    
    # Pass today's date for the certificate
    today = datetime.datetime.now()
    
    return render_template('completion.html', technique=technique, today=today)

if __name__ == '__main__':
    app.run(debug=True, port=5001) 