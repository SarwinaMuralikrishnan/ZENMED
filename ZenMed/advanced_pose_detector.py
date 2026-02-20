"""
Advanced Pose & Knee Detection for ZenMed
Integrates trained YOLO model for real-time keypoint detection
"""

import cv2
import numpy as np
from ultralytics import YOLO
import os

# Load trained model
MODEL_PATH = os.path.join(os.path.dirname(__file__), "poster-", "best.pt")

try:
    pose_model = YOLO(MODEL_PATH)
    print(f"✓ Pose model loaded: {MODEL_PATH}")
except Exception as e:
    print(f"✗ Error loading pose model: {e}")
    pose_model = None

# COCO Keypoint Indices (YOLOv8 Pose)
KEYPOINTS = {
    0: "Nose", 1: "Left Eye", 2: "Right Eye",
    3: "Left Ear", 4: "Right Ear",
    5: "Left Shoulder", 6: "Right Shoulder",
    7: "Left Elbow", 8: "Right Elbow",
    9: "Left Wrist", 10: "Right Wrist",
    11: "Left Hip", 12: "Right Hip",
    13: "Left Knee", 14: "Right Knee",  # KEY POINTS FOR LEG DETECTION
    15: "Left Ankle", 16: "Right Ankle"
}

SKELETON = [
    (0, 1), (0, 2), (1, 3), (2, 4),
    (5, 6), (5, 7), (7, 9), (6, 8), (8, 10),
    (5, 11), (6, 12),
    (11, 13), (13, 15),  # Left leg
    (12, 14), (14, 16)   # Right leg
]

def calculate_angle(point_a, point_b, point_c):
    """
    Calculate angle between three points
    Used for pose quality assessment
    """
    try:
        a = np.array(point_a[:2])
        b = np.array(point_b[:2])
        c = np.array(point_c[:2])
        
        ba = a - b
        bc = c - b
        
        cosine = np.dot(ba, bc) / (np.linalg.norm(ba) * np.linalg.norm(bc) + 1e-6)
        angle = np.degrees(np.arccos(np.clip(cosine, -1.0, 1.0)))
        return angle
    except:
        return 0

def detect_knees_and_pose(frame):
    """
    Detect knees and full pose from frame
    Returns: annotated frame, keypoints, pose quality score
    """
    if pose_model is None or frame is None:
        return frame, None, 0
    
    try:
        # Run YOLO inference
        results = pose_model(frame, conf=0.5, verbose=False)
        
        if not results or len(results) == 0:
            return frame, None, 0
        
        result = results[0]
        annotated_frame = result.plot()
        
        # Extract keypoints
        if result.keypoints is None or len(result.keypoints.xy) == 0:
            return annotated_frame, None, 0
        
        keypoints = result.keypoints.xy[0].cpu().numpy()
        keypoints_conf = result.keypoints.conf[0].cpu().numpy() if result.keypoints.conf is not None else None
        
        # Calculate pose quality
        pose_quality = calculate_pose_quality(keypoints, keypoints_conf)
        
        return annotated_frame, keypoints, pose_quality
        
    except Exception as e:
        print(f"Error in detection: {e}")
        return frame, None, 0

def calculate_pose_quality(keypoints, confidences=None):
    """
    Calculate overall pose quality (0-100)
    Based on keypoint confidence and anatomical plausibility
    """
    if keypoints is None or len(keypoints) == 0:
        return 0
    
    # Count valid keypoints (with confidence > 0.5)
    valid_count = 0
    if confidences is not None:
        valid_count = np.sum(confidences > 0.5)
    else:
        valid_count = np.sum(np.linalg.norm(keypoints, axis=1) > 0)
    
    # Base score on visible keypoints
    base_score = (valid_count / len(keypoints)) * 100
    
    # Bonus for having both knees visible (leg detection)
    left_knee = keypoints[13]
    right_knee = keypoints[14]
    
    if confidences is not None:
        left_knee_conf = confidences[13]
        right_knee_conf = confidences[14]
    else:
        left_knee_conf = np.linalg.norm(left_knee) > 0
        right_knee_conf = np.linalg.norm(right_knee) > 0
    
    if left_knee_conf > 0.5 and right_knee_conf > 0.5:
        base_score = min(100, base_score + 10)
    
    return int(base_score)

def analyze_leg_form(keypoints, keypoints_conf=None, exercise="Squats"):
    """
    Analyze leg form for specific exercises
    Returns: form quality score, feedback message
    """
    if keypoints is None or len(keypoints) < 17:
        return 0, "Insufficient pose detection"
    
    feedback = []
    score = 100
    
    try:
        left_hip = keypoints[11]
        right_hip = keypoints[12]
        left_knee = keypoints[13]
        right_knee = keypoints[14]
        left_ankle = keypoints[15]
        right_ankle = keypoints[16]
        
        # Check if joints are valid
        if keypoints_conf is not None:
            if (keypoints_conf[13] < 0.5 or keypoints_conf[14] < 0.5):
                return 0, "Knees not visible - adjust camera"
        
        if exercise == "Squats":
            # Calculate knee angles
            left_knee_angle = calculate_angle(left_hip, left_knee, left_ankle)
            right_knee_angle = calculate_angle(right_hip, right_knee, right_ankle)
            
            # Ideal squat: 70-100 degrees at bottom, 170+ at top
            avg_knee_angle = (left_knee_angle + right_knee_angle) / 2
            
            if avg_knee_angle > 150:
                feedback.append("Stand straight")
                score = 95
            elif 70 <= avg_knee_angle <= 100:
                feedback.append("Perfect squat depth!")
                score = 100
            elif avg_knee_angle < 70:
                feedback.append("Too deep - reduce depth")
                score = 80
            else:
                feedback.append("Partial squat - good")
                score = 90
            
            # Check alignment
            left_hip_y = left_hip[1]
            right_hip_y = right_hip[1]
            
            if abs(left_hip_y - right_hip_y) > 30:  # Hip misalignment
                feedback.append("Keep hips level")
                score = max(60, score - 15)
            
        elif exercise == "Pushups":
            # Body should form straight line
            shoulder_hip_dist = np.linalg.norm(np.array(left_hip) - np.array([keypoints[5][0], keypoints[5][1]]))
            if shoulder_hip_dist > 50:  # Saggy body
                feedback.append("Keep body straight")
                score = 70
            else:
                feedback.append("Good body alignment")
                score = 95
        
        return score, " | ".join(feedback) if feedback else "Good form"
        
    except Exception as e:
        return 50, f"Analysis error: {str(e)[:30]}"

def detect_exercises(keypoints, keypoints_conf=None):
    """
    Detect which exercise the user is performing
    Returns: detected exercise name, confidence
    """
    if keypoints is None or len(keypoints) < 17:
        return "Unknown", 0
    
    try:
        left_knee = keypoints[13]
        right_knee = keypoints[14]
        left_ankle = keypoints[15]
        right_ankle = keypoints[16]
        left_hip = keypoints[11]
        right_hip = keypoints[12]
        
        # Calculate angles
        left_knee_angle = calculate_angle(left_hip, left_knee, left_ankle)
        right_knee_angle = calculate_angle(right_hip, right_knee, right_ankle)
        avg_knee_angle = (left_knee_angle + right_knee_angle) / 2
        
        # Squat detection: varying knee angle
        if 70 <= avg_knee_angle <= 150:
            return "Squat", 0.9
        
        # Standing: straight legs
        elif avg_knee_angle > 160:
            return "Standing", 0.8
        
        # Lunges: significant knee variation
        elif abs(left_knee_angle - right_knee_angle) > 40:
            return "Lunge", 0.85
        
        else:
            return "Exercise", 0.5
            
    except:
        return "Unknown", 0

def create_knee_overlay(frame, keypoints, keypoints_conf=None):
    """
    Draw enhanced knee and pose visualization
    """
    if keypoints is None or len(keypoints) < 17:
        return frame
    
    frame_h, frame_w = frame.shape[:2]
    overlay = frame.copy()
    
    try:
        # Draw keypoints
        for idx, (x, y) in enumerate(keypoints):
            if x > 0 and y > 0:
                conf = keypoints_conf[idx] if keypoints_conf is not None else 1.0
                
                if conf > 0.5:
                    color = (0, 255, 0) if idx in [13, 14, 15, 16] else (255, 100, 0)
                    cv2.circle(overlay, (int(x), int(y)), 6, color, -1)
                    
                    # Label knees
                    if idx == 13:
                        cv2.putText(overlay, "L-Knee", (int(x), int(y-10)), 
                                  cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
                    elif idx == 14:
                        cv2.putText(overlay, "R-Knee", (int(x), int(y-10)), 
                                  cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
        
        # Draw skeleton
        for connection in SKELETON:
            start_idx, end_idx = connection
            start = keypoints[start_idx]
            end = keypoints[end_idx]
            
            if start[0] > 0 and start[1] > 0 and end[0] > 0 and end[1] > 0:
                start_conf = keypoints_conf[start_idx] if keypoints_conf is not None else 1.0
                end_conf = keypoints_conf[end_idx] if keypoints_conf is not None else 1.0
                
                if start_conf > 0.5 and end_conf > 0.5:
                    color = (0, 255, 0) if start_idx in [13, 14, 15, 16] or end_idx in [13, 14, 15, 16] else (255, 100, 0)
                    cv2.line(overlay, (int(start[0]), int(start[1])), 
                           (int(end[0]), int(end[1])), color, 2)
        
        # Blend overlay
        result = cv2.addWeighted(frame, 0.5, overlay, 0.5, 0)
        return result
        
    except Exception as e:
        print(f"Overlay error: {e}")
        return frame

if __name__ == "__main__":
    """Test the pose detection in real-time"""
    from camera_handler import CameraHandler
    
    camera = CameraHandler()
    if not camera.initialize_camera():
        print("Camera not available")
        exit()
    
    print("Starting live pose detection... Press Q to exit")
    
    while camera.is_available():
        success, frame = camera.get_frame()
        if not success:
            break
        
        # Detect
        annotated, keypoints, quality = detect_knees_and_pose(frame)
        
        # Analyze
        if keypoints is not None:
            exercise, exercise_conf = detect_exercises(keypoints)
            form_score, form_feedback = analyze_leg_form(keypoints, exercise=exercise)
            
            cv2.putText(annotated, f"Exercise: {exercise} ({exercise_conf:.1f})", 
                       (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
            cv2.putText(annotated, f"Form: {form_score}% - {form_feedback}", 
                       (10, 70), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)
        
        cv2.imshow("Pose & Knee Detection", annotated)
        
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    
    camera.release()
    cv2.destroyAllWindows()
