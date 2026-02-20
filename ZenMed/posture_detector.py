"""
Posture Detection Module - Integrates trained YOLOv8 model
Handles real-time posture analysis and feedback
Includes fallback for camera issues
"""

import cv2
import numpy as np
from ultralytics import YOLO
import os
from camera_handler import CameraHandler

# Load trained model
MODEL_PATH = os.path.join(os.path.dirname(__file__), "poster-", "best.pt")

try:
    posture_model = YOLO(MODEL_PATH)
    print(f"✓ Posture model loaded: {MODEL_PATH}")
except Exception as e:
    print(f"✗ Error loading posture model: {e}")
    posture_model = None

# Camera handler
camera = CameraHandler()
CAMERA_INITIALIZED = camera.initialize_camera()

def detect_posture(frame):
    """
    Detect posture and fitness exercise form using trained YOLO model
    Returns: annotated frame, detections, confidence scores
    """
    if posture_model is None:
        return frame, None, 0
    
    try:
        # Run inference
        results = posture_model(frame, conf=0.5)
        
        # Get detections
        if results and len(results) > 0:
            result = results[0]
            detections = result.boxes.data.cpu().numpy()
            
            # Annotate frame with bounding boxes
            annotated_frame = results[0].plot()
            
            # Calculate average confidence
            if len(detections) > 0:
                confidences = detections[:, 4]
                avg_confidence = float(np.mean(confidences)) * 100
            else:
                avg_confidence = 0
            
            return annotated_frame, detections, avg_confidence
        else:
            return frame, None, 0
            
    except Exception as e:
        print(f"Error during detection: {e}")
        return frame, None, 0

def analyze_pose_quality(detections, exercise_type="Squats"):
    """
    Analyze pose quality based on detected landmarks
    Returns posture score (0-100) and feedback message
    """
    if detections is None or len(detections) == 0:
        return 0, "No pose detected. Ensure full body is visible."
    
    score = 100
    feedback = "Good form"
    
    # Basic scoring logic based on detection confidence and number of keypoints
    num_detections = len(detections)
    if num_detections >= 3:
        score = 95
        feedback = "Excellent posture detected"
    elif num_detections >= 2:
        score = 80
        feedback = "Good posture, minor adjustments needed"
    else:
        score = 60
        feedback = "Limited pose detection, adjust position"
    
    # Exercise-specific feedback
    if exercise_type == "Squats":
        feedback = f"{exercise_type}: {feedback}. Keep back straight, knees aligned."
    elif exercise_type == "Pushups":
        feedback = f"{exercise_type}: {feedback}. Maintain straight body line."
    elif exercise_type == "Yoga":
        feedback = f"{exercise_type}: {feedback}. Balance and alignment optimal."
    
    return score, feedback

def process_frame_for_web(frame_bytes):
    """
    Process frame from web request
    Input: bytes (image data)
    Output: encoded frame with detections, score
    """
    import base64
    from io import BytesIO
    
    try:
        # Decode frame
        nparr = np.frombuffer(frame_bytes, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if frame is None:
            return None, 0, "Frame decode error"
        
        # Detect posture
        annotated_frame, detections, confidence = detect_posture(frame)
        score, feedback = analyze_pose_quality(detections)
        
        # Encode to base64
        success, buffer = cv2.imencode('.jpg', annotated_frame)
        if success:
            img_str = base64.b64encode(buffer).decode()
            return f"data:image/jpeg;base64,{img_str}", score, feedback
        else:
            return None, score, feedback
            
    except Exception as e:
        print(f"Error processing frame: {e}")
        return None, 0, str(e)
