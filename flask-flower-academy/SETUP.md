# Flower Academy Setup Guide

This guide will help you install and run the Flower Academy learning platform on your local machine.

## Prerequisites

Make sure you have the following installed:
- Python 3.7 or higher
- pip (Python package installer)

## Installation

### 1. Install Flask

Open a terminal/command prompt and install Flask:

```bash
pip install flask
# OR
pip3 install flask
```

If you want to install all dependencies from the requirements file:

```bash
pip install -r requirements.txt
# OR
pip3 install -r requirements.txt
```

### 2. Running the Application

Navigate to the project directory and run the application:

```bash
# Navigate to the project directory
cd path/to/flask-flower-academy

# Run the application
python app.py
# OR
python3 app.py
```

You should see output similar to:
```
 * Serving Flask app 'app'
 * Debug mode: on
 * Running on http://127.0.0.1:5000
```

### 3. Access the Application

Open your web browser and go to:
```
http://127.0.0.1:5000
```

You should see the Flower Academy home page with four technique cards to choose from.

## Troubleshooting

### "ModuleNotFoundError: No module named 'flask'"

This means Flask is not installed. Run:
```bash
pip install flask
# OR
pip3 install flask
```

### "FileNotFoundError" related to course_data.json

Make sure you're running the application from the correct directory. You should be in the `flask-flower-academy` directory when you run `python app.py`.

### "Address already in use" error

If port 5000 is already in use, you can modify app.py to use a different port:

```python
if __name__ == '__main__':
    app.run(debug=True, port=5001)  # Change 5001 to any available port
```

## Project Structure

- `app.py` - Main Flask application
- `static/` - Static assets
  - `css/style.css` - Styles for the application
  - `js/main.js` - JavaScript functionality
  - `data/course_data.json` - Course content
- `templates/` - HTML templates
- `logs/` - User activity logs (created automatically)

## Next Steps

After installation, you can:
1. Explore the different techniques
2. Complete lessons, activities, and quizzes
3. View your progress and earn certificates
4. Check the logs directory to see stored user data 