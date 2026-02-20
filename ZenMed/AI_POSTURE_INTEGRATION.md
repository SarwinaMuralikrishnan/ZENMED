# AI Posture Integration Guide

## Overview
This guide explains how to integrate your trained YOLOv8 posture model with the ZenMed fitness tracking application.

## What's Integrated

Your trained posture model from the `poster-/` folder is now integrated with the web application to provide:

✅ **Real-time posture detection** - Using your trained YOLOv8 model  
✅ **Live feedback** - AI-powered guidance during exercises  
✅ **Posture scoring** - Automated form quality assessment  
✅ **Exercise logging** - Saves reps and posture scores to database  

## Setup Instructions

### 1. Install Dependencies

```bash
# Activate your virtual environment
.venv\Scripts\Activate.ps1

# Install required packages
pip install -r requirements.txt
```

**Key packages:**
- `ultralytics` - YOLOv8 model framework
- `opencv-python` - Video frame processing
- `torch` - Deep learning framework
- `flask` - Web framework

### 2. Model Location

Your trained model should be at:
```
ZenMed/
├── poster-/
│   └── best.pt  ← Your trained YOLO model
└── app.py
```

The `posture_detector.py` module automatically loads the model from this location.

### 3. Start the Application

```bash
python app.py
```

Access at: `http://127.0.0.1:5000`

## Features

### On the Posture Page

1. **Computer Vision Analysis**
   - Camera feed with skeleton pose detection (MediaPipe)
   - Real-time joint angle calculations

2. **AI Model Verification**
   - Every 2 seconds, your trained YOLO model verifies form
   - Provides additional confidence scores
   - Blends AI feedback with rep counting

3. **Exercise Selection**
   - Squats
   - Pushups
   - Yoga/Stretches

4. **Live Analysis Panel**
   - Detected exercise type
   - Camera status
   - Real-time feedback

5. **Session Tracking**
   - Reps counted
   - Posture score calculated
   - Data saved to database

## How the AI Integration Works

### Frame Processing Pipeline

```
Video Frame → MediaPipe Pose Detection
           ↓
        Draw Skeleton
           ↓
        Rep Counting
           ↓
   Every 10 frames →
           ↓
    Send to YOLO Model (/detect_posture)
           ↓
    Get Form Verification + Confidence
           ↓
    Blend Scores & Provide Feedback
           ↓
    Update Posture Score
           ↓
    Repeat...
```

### Posture Scoring

- **Base Score**: 100% (starts perfect)
- **MediaPipe Rep Logic**: Tracks joint angles for counting
- **YOLO Verification**: Adds accuracy with trained model (every 2 sec)
- **Final Score**: Average of all detections saved to database

### Feedback Messages

The AI provides exercise-specific feedback:
- **Squats**: "Keep back straight, knees aligned"
- **Pushups**: "Maintain straight body line"
- **Yoga**: "Balance and alignment optimal"

## Database Schema

Posture sessions are stored in `exercise_logs` table:

```
id              | User's unique exercise session ID
user_id         | Who performed the exercise
exercise_name   | "Squats", "Pushups", etc.
duration        | Number of reps performed
date            | Session date
posture_score   | AI-calculated score (0-100)
```

## Endpoints

### Backend Endpoints

1. **`POST /detect_posture`**
   - Processes a single frame
   - Returns: annotated frame, score, feedback
   - Called automatically every 10 frames

2. **`POST /analyze_posture_batch`**
   - Aggregates all scores from session
   - Saves final results to database
   - Called when "End Session" is clicked

3. **`GET /posture`**
   - Loads the main posture page

## Customization

### Add Custom Exercises

Edit `posture.html` to add new exercises:

```html
<select class="form-select" id="exercise-select">
    <option value="Squats">Squats</option>
    <option value="Pushups">Pushups</option>
    <option value="Yoga">Yoga</option>
    <option value="YOUR_EXERCISE">Your Exercise</option>  ← Add here
</select>
```

Then update instructions in the `resetSession()` function.

### Adjust Detection Frequency

In `posture.html`, change the frame interval:

```javascript
// Current: Every 10 frames
if (frameCount % 10 === 0) {
    analyzeWithAIModel(canvasElement);
}

// More frequent (every 5 frames):
if (frameCount % 5 === 0) {
    analyzeWithAIModel(canvasElement);
}
```

### Modify Scoring Logic

Edit `posture_detector.py` `analyze_pose_quality()` function to customize how scores are calculated based on your training data.

## Troubleshooting

### Model loading fails
- Ensure `best.pt` exists in `poster-/` folder
- Check that ultralytics is installed: `pip list | grep ultralytics`

### No pose detected
- Ensure good lighting
- Full body visible in camera
- Check camera permissions

### Slow performance
- Reduce frame processing frequency (currently every 10 frames)
- Check GPU availability for YOLO
- Lower video resolution

### API responses slow
- YOLO inference takes time on CPU
- Consider running on GPU if available
- Increase the time interval between frames

## Advanced Usage

### Using GPU Acceleration

If you have NVIDIA GPU:

```python
# Edit posture_detector.py
posture_model = YOLO(MODEL_PATH)
posture_model.to('cuda')  # Use GPU
```

### Training Your Own Model

Use the scripts in `poster-/` folder:
- `leg.py` - Leg form detection
- `left hand.py` - Hand/arm detection
- Combine with your dataset

## API Response Examples

### Successful Detection
```json
{
    "status": "success",
    "frame": "data:image/jpeg;base64,...",
    "score": 92,
    "feedback": "Excellent posture detected. Squats: excellent posture, minor adjustments needed. Keep back straight, knees aligned."
}
```

### Session Saved
```json
{
    "status": "success",
    "avg_score": 88.5,
    "total_reps": 15
}
```

## Performance Notes

- **Frame processing**: ~100-200ms per frame (depends on model size)
- **Database writes**: Minimal overhead
- **Recommended FPS**: 30 FPS camera input, processed every 10 frames (~3 FPS to AI model)

## Support

For issues or enhancements:
1. Check model path is correct
2. Verify dependencies with `pip list`
3. Check browser console for JavaScript errors (F12)
4. Review server logs for Python errors
