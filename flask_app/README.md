# Flower Academy - Flask Application

A web application for learning flower arrangement techniques with interactive lessons and quizzes.

## Features

- Interactive learning experience for flower arranging techniques
- Step-by-step lessons with visual aids
- Knowledge testing with quizzes and feedback
- Score tracking and results
- User activity logging for analytics

## Setup Instructions

1. Make sure you have Python 3.8+ installed

2. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Create the data directory structure:
   ```
   mkdir -p data/user_logs
   ```

4. Run the application:
   ```
   python app.py
   ```

5. Open your browser and go to:
   ```
   http://localhost:5000
   ```

## Project Structure

```
flask_app/
├── app.py                  # Main Flask application
├── requirements.txt        # Python dependencies
├── README.md               # This file
├── data/                   # Data storage
│   ├── course_content.json # Course content data
│   └── user_logs/          # User activity logs
├── static/                 # Static assets
│   ├── css/                # Stylesheets
│   │   └── style.css       # Custom CSS
│   ├── js/                 # JavaScript files
│   └── images/             # Image assets
└── templates/              # HTML templates
    ├── base.html           # Base template
    ├── index.html          # Home page
    ├── learn.html          # Lesson page
    ├── quiz.html           # Quiz page
    └── results.html        # Results page
```

## Course Structure

Each learning technique includes:
1. Introduction with key points and history
2. Multiple lesson pages with instructional content
3. Quiz questions to test understanding
4. Results page showing performance

## Requirements

- Python 3.8+
- Flask 2.3+
- Modern web browser

## User Data Tracking

The application tracks:
- Page visits and navigation
- Time spent on lessons
- Quiz answers and scores
- Overall learning progress 