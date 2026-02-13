import cv2
import socketio
from flask import Flask, Response, make_response
from ultralytics import YOLO
from flask_cors import CORS
from pyngrok import ngrok
import time

app = Flask(__name__)
CORS(app)

sio = socketio.Client()

try:
    sio.connect(
        "https://ai-proctoring-system-k2vt.onrender.com", transports=["websocket"]
    )
    print("✅ Connected to Node.js")
except:
    print("⚠️ Node.js server not found!")

ngrok.kill()
time.sleep(2)
conf = ngrok.connect(5001)
public_url = conf.public_url
print(f"\n🌍 TERA PUBLIC LINK: {public_url}\n")

model = YOLO("yolov8n.pt")
camera = cv2.VideoCapture(0)


def generate_frames():
    while True:
        success, frame = camera.read()
        if not success:
            break
        results = model(frame, conf=0.4)
        annotated_frame = results[0].plot()
        for box in results[0].boxes:
            cls = int(box.cls[0])
            if cls == 67 or cls == 73:
                try:
                    sio.emit(
                        "cheating_alert", {"seatIndex": 0, "msg": "Cheating Detected"}
                    )
                except:
                    pass
        ret, buffer = cv2.imencode(".jpg", annotated_frame)
        yield (
            b"--frame\r\n"
            b"Content-Type: image/jpeg\r\n\r\n" + buffer.tobytes() + b"\r\n"
        )


@app.route("/video_feed")
def video_feed():
    gen = generate_frames()
    response = Response(gen, mimetype="multipart/x-mixed-replace; boundary=frame")
    # Ye headers dalna zaroori hai ngrok ke liye
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["X-Frame-Options"] = "ALLOWALL"
    return response


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, threaded=True, debug=False)
