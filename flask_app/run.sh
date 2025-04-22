#!/bin/bash

# Create necessary directories
mkdir -p data/user_logs
mkdir -p static/images

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Run the Flask app
echo "Starting Flask application..."
python app.py 