import cv2
import numpy as np
from ultralytics import YOLO
import math

model = YOLO(r"C:\Users\Lenovo\OneDrive\Desktop\ZenMed\poster-\best.pt")

def calculate_angle(a, b, c):
    a = np.array(a)
    b = np.array(b)
    c = np.array(c)

    ba = a - b
    bc = c - b

    cosine = np.dot(ba, bc) / (np.linalg.norm(ba) * np.linalg.norm(bc) + 1e-6)
    angle = np.degrees(np.arccos(np.clip(cosine, -1.0, 1.0)))
    return angle

cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)

cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)


cv2.namedWindow("Quad Stretch Correction", cv2.WINDOW_NORMAL)
cv2.setWindowProperty("Quad Stretch Correction",
                      cv2.WND_PROP_FULLSCREEN,
                      cv2.WINDOW_FULLSCREEN)

print("Press Q to exit")

while True:
    ret, frame = cap.read()
    if not ret:
        print("Camera not working")
        break

    results = model(frame)
    annotated = results[0].plot()

    if results[0].keypoints is not None and len(results[0].keypoints.xy) > 0:

        kpts = results[0].keypoints.xy[0]

        left_knee = kpts[13]
        right_knee = kpts[14]

        left_hip = kpts[11]
        left_ankle = kpts[15]

        knee_distance = np.linalg.norm(left_knee - right_knee)

        knee_angle = calculate_angle(left_hip, left_knee, left_ankle)

        cv2.putText(annotated,
                    f"Knee Distance: {int(knee_distance)}",
                    (50, 80),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    1,
                    (255,255,0),
                    3)

        cv2.putText(annotated,
                    f"Knee Angle: {int(knee_angle)}",
                    (50, 140),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    1,
                    (255,255,0),
                    3)

        if knee_distance < 50 and knee_angle < 80:
            status = "CORRECT QUAD STRETCH"
            color = (0,255,0)
        else:
            status = "KEEP KNEES TOGETHER"
            color = (0,0,255)

        cv2.putText(annotated,
                    status,
                    (50, 220),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    1.5,
                    color,
                    4)

    cv2.imshow("Quad Stretch Correction", annotated)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break


cap.release()
cv2.destroyAllWindows()