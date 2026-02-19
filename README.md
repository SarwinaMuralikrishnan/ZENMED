# ZenMed - AI-Powered Diabetes Assistant

## Overview
ZenMed is a comprehensive web application designed to help diabetic patients manage their condition through AI-driven insights, localized nutrition plans, and real-time posture correction.

## Features
- **AI Posture Correction**: Real-time webcam analysis using MediaPipe to ensure correct exercise form.
- **Localized Nutrition**: Generates diet plans tailored to Tamil Nadu/Indian cuisine based on preferences.
- **Glucose Tracking**: Log fasting and post-meal levels with visual charts.
- **Doctor Portal**: ALerts and patient management for healthcare providers.
- **Reminders**: Set alerts for medication, water, and exercise.

## Tech Stack
- **Frontend**: HTML5, CSS3, Bootstrap 5, JavaScript
- **Backend**: Python (Flask)
- **Database**: SQLite
- **AI/ML**: MediaPipe (JS), Chart.js (Visualization)

## Installation
1. Install dependencies:
   ```bash
   pip install flask werkzeug
   ```
2. Run the application:
   ```bash
   python app.py
   ```
3. Open browser at `http://127.0.0.1:5000`

## Project Structure
- `app.py`: Main application logic.
- `templates/`: HTML files.
- `static/`: CSS and assets.
- `database.db`: SQLite database (auto-created).

## Accounts (Demo)
- Register a new account as "Patient" or "Doctor" to see different views.
