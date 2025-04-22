# Flower Academy Project Summary

## Overview

Flower Academy is an interactive learning platform that teaches users different flower arrangement techniques. The application was originally built in React and has been migrated to a Flask backend with HTML/JS/jQuery/Bootstrap frontend to meet specific requirements.

## Key Features

1. **Home Screen with Start Buttons**
   - The home page displays four different flower arrangement techniques
   - Each technique has a "Start Learning" button to initiate the learning process
   - User selections are tracked from the first interaction

2. **Backend Data Storage**
   - User choices are stored on every page in Flask session storage
   - Quiz answers are recorded with timestamp and correctness
   - Interactive activity selections are stored with timestamps
   - Page navigation tracking records when users enter each page
   - All data is logged to JSON files for persistence

3. **Modular Data Structure**
   - Course content is stored in a JSON object (`course_data.json`)
   - Pages are rendered dynamically based on the content type
   - New techniques can be added by simply extending the JSON data

4. **Multiple Routes**
   - Home page route (`/`)
   - Learning route with page variables (`/learn/<page_num>`)
   - Quiz submission route (`/submit_quiz/<technique>/<quiz_num>`)
   - Interactive activity submission (`/submit_interactive/<technique>/<activity_num>`)
   - Quiz results page (`/quiz_results`)
   - Course completion page (`/complete_course`)

5. **User Flow**
   - Each page displays content with clear instructions
   - User interactions are recorded
   - Navigation buttons allow moving forward and backward
   - Progress tracking shows completion percentage

## How It Fulfills Requirements

1. **Flask Backend and HTML/JS/jQuery/Bootstrap Frontend**
   - The application uses Flask for server-side processing
   - Frontend uses HTML templates with Jinja2
   - JavaScript with jQuery handles client-side interactions
   - Bootstrap provides responsive layout and styling

2. **Home Screen with Start Button**
   - The home page features technique cards with start buttons
   - Each button initiates a new learning session
   - Session data is created upon first visit

3. **Backend Storage of User Choices**
   - Quiz answers are stored with the `submit_quiz` route
   - Interactive activity selections are stored with the `submit_interactive` route
   - Page visits are timestamped in session data
   - All user activity is logged to JSON files

4. **Modular JSON Data Structure**
   - Course content is separated from the code in `course_data.json`
   - Templates render different page types (lesson, quiz, interactive) based on JSON data
   - Easy to extend with new techniques or content

5. **Required Routes**
   - Home page route for initial landing
   - Learning route that handles different lesson numbers
   - Quiz route for answering questions
   - Results page for showing quiz performance

6. **User Progress**
   - Each page shows data relevant to the current step
   - Instructions guide the user through the process
   - User data is recorded at each step
   - Navigation allows moving through the lessons
   - Quiz results show correct/incorrect answers with feedback

## Technical Implementation

- **Flask Session**: Stores user progress and selections
- **AJAX**: Handles quiz answers and interactive activity submissions
- **JSON Logging**: Records all user activity for later analysis
- **Responsive Design**: Works on both desktop and mobile devices
- **Modular Templates**: Different templates for different content types

## Future Enhancements

- User authentication for persistent progress across sessions
- More interactive activity types
- Media uploads for flower arrangements
- Community features to share creations
- Instructor feedback on quiz results 