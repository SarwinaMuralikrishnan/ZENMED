import cv2
from ultralytics import YOLO
model = YOLO(r"C:\Users\Lenovo\OneDrive\Desktop\ZenMed\poster-\best.pt")

cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("Error: Camera not accessible")
    exit()

cv2.namedWindow("YOLOv8 Pose", cv2.WINDOW_NORMAL)
cv2.setWindowProperty("YOLOv8 Pose", cv2.WND_PROP_FULLSCREEN, cv2.WINDOW_FULLSCREEN)

print("Press 'q' to exit")

while True:
    ret, frame = cap.read()
    if not ret:
        break

    results = model(frame)

    annotated_frame = results[0].plot()

    cv2.imshow("YOLOv8 Pose", annotated_frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()