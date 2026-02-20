import cv2
import numpy as np
from ultralytics import YOLO

model = YOLO(r"C:\Users\ADMIN\zenmate\runs\pose\train\weights\best.pt")

def calculate_angle(a, b, c):
    a, b, c = np.array(a), np.array(b), np.array(c)
    ba = a - b
    bc = c - b
    norm_product = np.linalg.norm(ba) * np.linalg.norm(bc)
    if norm_product == 0:
        return 0
    cosine = np.clip(np.dot(ba, bc) / norm_product, -1.0, 1.0)
    return np.degrees(np.arccos(cosine))

angle_history = []

cap = cv2.VideoCapture(0)

cv2.namedWindow("Arm Rotation Correction", cv2.WINDOW_NORMAL)
cv2.setWindowProperty("Arm Rotation Correction",
                      cv2.WND_PROP_FULLSCREEN,
                      cv2.WINDOW_FULLSCREEN)

print("Press 'Q' to exit")

while True:
    ret, frame = cap.read()
    if not ret:
        break

    results = model(frame)
    annotated = results[0].plot()

    if results[0].keypoints is not None and len(results[0].keypoints.xy) > 0:
        kpts = results[0].keypoints.xy[0]

        shoulder = kpts[6]
        elbow = kpts[8]
        hip = kpts[12]

        angle = calculate_angle(hip, shoulder, elbow)

        angle_history.append(angle)
        if len(angle_history) > 5:
            angle_history.pop(0)
        smooth_angle = sum(angle_history) / len(angle_history)

        cv2.putText(annotated, f"Angle: {int(smooth_angle)}",
                    (50, 100),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    1.2,
                    (0,255,0),
                    3)

        if 80 <= smooth_angle <= 100:
            status = "CORRECT"
            color = (0,255,0)
        else:
            status = "INCORRECT"
            color = (0,0,255)

        cv2.putText(annotated, status,
                    (50, 160),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    1.5,
                    color,
                    4)

        cv2.line(annotated, tuple(shoulder.astype(int)), tuple(elbow.astype(int)), (255,0,0), 3)
        cv2.line(annotated, tuple(elbow.astype(int)), tuple(hip.astype(int)), (255,0,0), 3)
        cv2.circle(annotated, tuple(shoulder.astype(int)), 5, (0,255,255), -1)
        cv2.circle(annotated, tuple(elbow.astype(int)), 5, (0,255,255), -1)
        cv2.circle(annotated, tuple(hip.astype(int)), 5, (0,255,255), -1)

    cv2.imshow("Arm Rotation Correction", annotated)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()