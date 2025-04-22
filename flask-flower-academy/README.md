# Flower Academy

An interactive learning platform for mastering flower arrangement techniques.

## Features

- Interactive lessons on different flower arrangement techniques
- Quizzes to test your knowledge
- Interactive activities to practice skills
- Progress tracking
- Completion certificates
- User activity logging

## Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/flower-academy.git
cd flower-academy
```

2. Create a virtual environment:
```
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```
pip install -r requirements.txt
```

## Usage

1. Start the Flask development server:
```
python app.py
```

2. Open your browser and navigate to `http://127.0.0.1:5000`

3. Select a flower arrangement technique to learn

4. Follow the interactive lessons, complete activities, and take quizzes

5. Receive a certificate upon completion

## Data Storage

The application stores user activity in a JSON format in the `logs` directory. This includes:
- Page visits
- Quiz answers
- Interactive activity selections
- Course completion data

Each user is assigned a unique ID based on their session.

## Development

### Project Structure

- `app.py` - Main Flask application
- `templates/` - HTML templates
- `static/` - Static assets
  - `css/` - Stylesheets
  - `js/` - JavaScript files
  - `data/` - Course content data
- `logs/` - User activity logs

### Course Content

Course content is stored in `static/data/course_data.json`. Each technique includes:
- Introduction with key points and historical context
- Lesson pages
- Interactive activities
- Quiz questions

### Adding New Techniques

To add a new technique:
1. Add the technique data to `course_data.json`
2. Add a card for the technique on the home page

## License

MIT 