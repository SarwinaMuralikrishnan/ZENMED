"""
Robust Camera Handler for Windows
Handles camera initialization issues and provides fallbacks
"""

import cv2
import os
from pathlib import Path

class CameraHandler:
    def __init__(self):
        self.cap = None
        self.camera_available = False
    
    def initialize_camera(self, camera_index=0, width=640, height=480):
        """
        Initialize camera with proper Windows settings
        Tries multiple backends and configurations
        """
        backends = [
            (cv2.CAP_DSHOW, "DirectShow"),
            (cv2.CAP_MSMF, "MSMF"),
            (cv2.CAP_VFW, "VFW"),
            (cv2.CAP_V4L2, "V4L2"),
        ]
        
        for backend_id, backend_name in backends:
            try:
                print(f"Attempting camera with {backend_name}...")
                cap = cv2.VideoCapture(camera_index, backend_id)
                
                if cap.isOpened():
                    cap.set(cv2.CAP_PROP_FRAME_WIDTH, width)
                    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, height)
                    cap.set(cv2.CAP_PROP_FPS, 30)
                    cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
                    
                    ret, frame = cap.read()
                    if ret and frame is not None and frame.size > 0:
                        print(f"✓ Camera initialized with {backend_name}")
                        self.cap = cap
                        self.camera_available = True
                        return True
                    else:
                        cap.release()
                else:
                    print(f"✗ {backend_name}: Cannot open camera")
            except Exception as e:
                print(f"✗ {backend_name} failed: {e}")
                continue
        
        print("✗ No camera backend available")
        return False
    
    def is_available(self):
        """Check if camera is ready"""
        return self.camera_available and self.cap is not None and self.cap.isOpened()
    
    def get_frame(self):
        """
        Get camera frame with error handling
        Returns: (success: bool, frame: numpy.ndarray or None)
        """
        if not self.is_available():
            return False, None
        
        try:
            ret, frame = self.cap.read()
            if ret and frame is not None and frame.size > 0:
                return True, frame
            else:
                return False, None
        except Exception as e:
            print(f"Error capturing frame: {e}")
            return False, None
    
    def release(self):
        """Release camera resources"""
        if self.cap is not None:
            self.cap.release()
            self.camera_available = False
    
    def __del__(self):
        self.release()

def get_camera_info():
    """Print detailed camera and system info"""
    print("\n=== Camera Diagnostics ===")
    print(f"OpenCV version: {cv2.__version__}")
    
    for i in range(5):
        cap = cv2.VideoCapture(i)
        if cap.isOpened():
            print(f"Camera {i}: Available")
            print(f"  - Resolution: {int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))}x{int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))}")
            print(f"  - FPS: {cap.get(cv2.CAP_PROP_FPS)}")
            cap.release()

if __name__ == "__main__":
    get_camera_info()
    
    print("\nInitializing camera...")
    cam = CameraHandler()
    
    if cam.initialize_camera():
        print("✓ Camera ready!")
        
        for i in range(5):
            success, frame = cam.get_frame()
            if success:
                print(f"Frame {i+1}: {frame.shape}")
            else:
                print(f"Frame {i+1}: Failed to capture")
        
        cam.release()
    else:
        print("✗ Camera initialization failed")
        print("\nTroubleshooting:")
        print("1. Check if camera is connected")
        print("2. Verify camera drivers are up to date")
        print("3. Check camera permissions in Windows Settings")
        print("4. Try: Settings > Privacy & Security > Camera")
        print("5. Restart the application")
