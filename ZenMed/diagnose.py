import sys
import platform
import subprocess

def print_header(text):
    print(f"\n{'='*60}")
    print(f"  {text}")
    print(f"{'='*60}\n")

def check_python():
    print_header("Python Environment")
    print(f"Python Version: {sys.version}")
    print(f"Platform: {platform.platform()}")
    print(f"Executable: {sys.executable}")

def check_packages():
    print_header("Required Packages")
    packages = ['cv2', 'torch', 'ultralytics', 'flask', 'numpy']
    
    for pkg in packages:
        try:
            mod = __import__(pkg)
            version = getattr(mod, '__version__', 'installed')
            print(f"✓ {pkg}: {version}")
        except ImportError:
            print(f"✗ {pkg}: NOT INSTALLED")

def check_camera():
    print_header("Camera Detection")
    try:
        import cv2
        
        print(f"OpenCV Version: {cv2.__version__}")
        print(f"Available backends: {cv2.getBuildInformation()[:200]}...\n")
        
        backends = [
            (cv2.CAP_DSHOW, "DirectShow (Recommended for Windows)"),
            (cv2.CAP_MSMF, "MSMF (Media Foundation)"),
            (cv2.CAP_VFW, "VFW (Video for Windows)"),
        ]
        
        print("Testing camera with different backends:\n")
        
        for backend_id, backend_name in backends:
            try:
                cap = cv2.VideoCapture(0, backend_id)
                if cap.isOpened():
                    ret, frame = cap.read()
                    if ret and frame is not None:
                        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
                        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
                        fps = cap.get(cv2.CAP_PROP_FPS)
                        print(f"✓ {backend_name}")
                        print(f"  Resolution: {width}x{height} @ {fps} FPS")
                        cap.release()
                        return True
                    else:
                        print(f"⚠ {backend_name}: Opened but no frame")
                        cap.release()
                else:
                    print(f"✗ {backend_name}: Cannot open")
            except Exception as e:
                print(f"✗ {backend_name}: {e}")
        
        print("\n✗ No working camera backend found")
        return False
        
    except ImportError:
        print("✗ opencv-python not installed")
        return False

def check_model():
    print_header("AI Model")
    import os
    model_path = os.path.join(os.path.dirname(__file__), "poster-", "best.pt")
    
    if os.path.exists(model_path):
        print(f"✓ Model file found: {model_path}")
        print(f"  Size: {os.path.getsize(model_path) / (1024*1024):.1f} MB")
        
        try:
            from ultralytics import YOLO
            model = YOLO(model_path)
            print(f"✓ Model loaded successfully")
            return True
        except Exception as e:
            print(f"✗ Error loading model: {e}")
            return False
    else:
        print(f"✗ Model not found at: {model_path}")
        return False

def check_permissions():
    print_header("Windows Permissions")
    print("Please check these settings manually:")
    print("\n1. Settings → Privacy & Security → Camera")
    print("   → Make sure 'Camera' is enabled")
    print("   → Add this app to 'Allow access to camera on this device'")
    print("\n2. Device Manager (devmgmt.msc)")
    print("   → Check Imaging Devices for camera")
    print("   → Right-click → Update driver if needed")
    print("\n3. Firewall/Antivirus")
    print("   → Check if they're blocking camera access")

def main():
    print("\n╔════════════════════════════════════════════════════════════╗")
    print("║        ZenMed Camera & System Diagnostics Tool            ║")
    print("╚════════════════════════════════════════════════════════════╝")
    
    check_python()
    check_packages()
    check_camera()
    check_model()
    check_permissions()
    
    print_header("Summary")
    print("If camera check failed, try these solutions:")
    print("\n1. Update camera drivers:")
    print("   → Device Manager → Imaging Devices")
    print("   → Right-click camera → Update driver")
    print("\n2. Fix Windows camera access:")
    print("   → Settings → Privacy → Camera")
    print("   → Toggle camera off→on")
    print("\n3. Restart application:")
    print("   → Close browser tab")
    print("   → Close Flask server (Ctrl+C)")
    print("   → Run 'python app.py' again")
    print("\n4. Test with external camera:")
    print("   → If using laptop camera, try USB webcam")
    print("\n5. Reinstall OpenCV:")
    print("   → pip uninstall opencv-python")
    print("   → pip install opencv-python")
    print("\n" + "="*60 + "\n")

if __name__ == "__main__":
    main()
