# Floral Artistry Academy

An interactive educational website for teaching flower arrangement techniques. Built with Flask, jQuery, and Bootstrap.

## Features

- Instructional, step-by-step learning experience
- Four comprehensive lessons on flower arrangement techniques
- Visual storytelling approach with detailed explanations
- Session-based user progress tracking
- Responsive design for all devices

## Topics Covered

1. **Triangle Insertion** - Creating the foundation of balanced arrangements
2. **Auxiliary Placement** - Adding depth and fullness with secondary blooms
3. **Linear Elements** - Creating height and movement with tall flowers
4. **Foliage Integration** - Unifying designs with strategic greenery placement

## Requirements

- Python 3.6 or higher
- Flask

## Installation

1. Clone this repository:
   ```
   git clone <repository-url>
   cd floral-artistry-academy
   ```

2. Create a virtual environment (optional but recommended):
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install the required packages:
   ```
   pip install -r requirements.txt
   ```

4. Run the application:
   ```
   python app.py
   ```

5. Open your browser and navigate to `http://127.0.0.1:5000/`

## Project Structure

- `app.py` - Main Flask application with routes
- `templates/` - HTML templates
  - `home.html` - Home page with course introduction
  - `learn.html` - Interactive learning page
- `static/` - Static files
  - `css/style.css` - Custom styling
  - `js/` - JavaScript files
    - `main.js` - Home page interactions
    - `learn.js` - Interactive lesson functionality
  - `images/` - Image files for lessons
  - `data/lessons.json` - Structured lesson content

## Lesson Structure

Each lesson follows a clear instructional pattern:
1. Introduction - Overview of the technique
2. Step-by-step instructions with detailed explanations
3. Expert tips for implementation
4. Explanation of why the technique works
5. Conclusion and connection to the next lesson

## Adding Images

For a complete experience, add the following images to the `static/images/` directory:

- `flowers-bg.jpg` - Background image for the home page
- `step1_triangle.jpg` - First triangle arrangement step
- `step2_triangle.jpg` - Second triangle arrangement step
- `step3_triangle.jpg` - Third triangle arrangement step
- `step1_auxiliary.jpg` - First auxiliary placement step
- `step2_auxiliary.jpg` - Second auxiliary placement step
- `step3_auxiliary.jpg` - Third auxiliary placement step
- `step4_auxiliary.jpg` - Fourth auxiliary placement step
- `step1_linear.jpg` - First linear elements step
- `step2_linear.jpg` - Second linear elements step
- `step3_linear.jpg` - Third linear elements step
- `step1_foliage.jpg` - First foliage integration step
- `step2_foliage.jpg` - Second foliage integration step
- `step3_foliage.jpg` - Third foliage integration step 