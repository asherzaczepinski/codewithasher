'use client';

import ExplanationBox from '@/components/ExplanationBox';
import CodeBlock from '@/components/CodeBlock';

export default function Step4() {
  return (
    <div>
      <ExplanationBox title="Raw Data Is Not Understanding">
        <p>
          A LiDAR scan is just millions of 3-D points floating in space. A camera frame is just a
          grid of pixel intensities. Perception is the process of turning those raw numbers into a
          structured, semantically meaningful world model: <em>there is a pedestrian 8 m ahead,
          moving left at 1.2 m/s; the lane boundary curves right in 15 m; the traffic light
          is red.</em>
        </p>
        <p>
          Every downstream decision — what path to take, how hard to brake — depends on the
          accuracy of the perception layer. Getting it wrong is the most dangerous failure mode
          in the system.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Object Detection with CNNs and YOLO">
        <p>
          The workhorse of visual perception is the Convolutional Neural Network (CNN). As covered
          in the Computer Vision course, CNNs learn hierarchical spatial features: early layers
          detect edges and textures, middle layers detect parts, and deep layers recognise whole
          objects.
        </p>
        <p>
          For real-time driving, the detector must be both accurate <em>and</em> fast — ideally
          running at 30 frames per second or faster. The YOLO (You Only Look Once) family of
          detectors achieves this by treating detection as a single regression problem: one forward
          pass of the network simultaneously predicts bounding boxes, confidence scores, and class
          labels for every object in the image, in as little as 5–10 ms on modern GPU hardware.
        </p>
        <p>
          In our city-block example: the front camera feeds each frame into a YOLO model. On the
          frame where the pedestrian steps off the curb, the model outputs a bounding box at pixel
          coordinates (320, 180) to (410, 490), class = &quot;pedestrian&quot;, confidence = 0.94.
          That box, along with boxes for the parked truck and the lane lines, forms the raw
          detection output.
        </p>
      </ExplanationBox>

      <ExplanationBox title="In Python">
        <p>
          The snippet below shows how a single YOLO inference call turns a raw camera frame into a
          list of labelled bounding boxes — the exact output that feeds the tracking and planning layers.
        </p>
      </ExplanationBox>
      <CodeBlock
        filename="detect_objects.py"
        caption="One YOLO forward pass produces every detected object in the frame, ready for the tracker."
        code={`from ultralytics import YOLO
import cv2

# Load a YOLO model that was fine-tuned on driving data.
# The weights file encodes everything the network learned about
# cars, pedestrians, cyclists, traffic signs, etc.
model = YOLO("yolov8n.pt")

# Read one camera frame from the front-facing sensor.
# In production this arrives over a ROS topic at 30 fps.
frame = cv2.imread("front_camera_frame.jpg")

# Run a single forward pass through the neural network.
# conf=0.5 means "only report detections where the network
# is at least 50% confident" — filters out noise.
results = model(frame, conf=0.5)[0]

# results.boxes is a list of detected objects in this frame.
# Each box carries four numbers: pixel coordinates of the
# top-left and bottom-right corners of the bounding rectangle.
for box in results.boxes:
    x1, y1, x2, y2 = box.xyxy[0].tolist()   # pixel corners
    confidence = float(box.conf[0])           # how sure is the model?
    class_id   = int(box.cls[0])             # which category?
    label      = model.names[class_id]       # e.g. "pedestrian", "car"

    # Anything crossing the lane boundary in the next 2 seconds
    # is immediately flagged for the planner as a priority obstacle.
    print(f"Detected {label} at ({x1:.0f},{y1:.0f})-({x2:.0f},{y2:.0f}), conf={confidence:.2f}")`}
      />

      <ExplanationBox title="Semantic Segmentation">
        <p>
          Object detection draws boxes. Semantic segmentation goes further: it labels every pixel
          in the image with a class. Each pixel is assigned a category — road, sidewalk, vehicle,
          pedestrian, vegetation, sky — producing a colour-coded map of the scene.
        </p>
        <p>
          Segmentation models (such as architectures in the DeepLab or SegFormer families) use
          encoder-decoder CNN structures. The encoder compresses the image into abstract feature
          maps; the decoder upsamples those features back to full resolution, predicting a class
          for every pixel.
        </p>
        <p>
          For the autonomous car, segmentation is especially valuable for understanding driveable
          surface (where can the car physically go?) and free space around obstacles, without
          needing to bound every object with a rectangle.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Lane Detection">
        <p>
          Staying in the correct lane requires detecting lane markings — typically dashed or solid
          white/yellow lines painted on the road. Lane detection is a specialised perception task
          because lane markings are thin, partially occluded by vehicles, and often faded.
        </p>
        <p>
          A common approach applies a CNN to extract features and then fits a polynomial curve
          (typically a third-degree polynomial) through detected points on each lane boundary.
          Given left and right lane curves, the car can compute its lateral offset from the lane
          centre — the key signal for the steering controller in Module 8.
        </p>
        <p>
          On our city block, lane detection confirms the car is 0.15 m left of centre as it
          approaches the double-parked truck, prompting the planner (Module 7) to consider a
          slight right-of-centre path within the lane.
        </p>
      </ExplanationBox>

      <ExplanationBox title="In Python">
        <p>
          Lane pixels are identified by thresholding brightness and colour, then a polynomial is
          fitted so the car knows how far it sits from the lane centre.
        </p>
      </ExplanationBox>
      <CodeBlock
        filename="lane_detection.py"
        caption="Thresholding isolates lane-marking pixels; a fitted polynomial gives the car its lateral offset."
        code={`import cv2
import numpy as np

# Convert the front-camera frame to the HSV colour space.
# HSV separates brightness (V channel) from colour (H, S),
# which makes white and yellow lane markings easier to isolate.
frame_bgr = cv2.imread("front_camera_frame.jpg")
hsv = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2HSV)

# --- White lane marking threshold ---
# White pixels have high Value (brightness) and low Saturation.
lower_white = np.array([0,   0,   200])   # HSV lower bound
upper_white = np.array([180, 30,  255])   # HSV upper bound
mask_white = cv2.inRange(hsv, lower_white, upper_white)

# --- Yellow lane marking threshold ---
lower_yellow = np.array([15,  80, 80])
upper_yellow = np.array([35, 255, 255])
mask_yellow = cv2.inRange(hsv, lower_yellow, upper_yellow)

# Combine: any pixel that is white OR yellow is a lane-marking candidate.
lane_mask = cv2.bitwise_or(mask_white, mask_yellow)

# Focus on the lower half of the image — the road in front.
# The sky and buildings in the upper half are irrelevant.
h, w = lane_mask.shape
roi = lane_mask[h // 2 :, :]   # region of interest: bottom half

# Find the (col, row) coordinates of every lane-pixel candidate.
lane_pixel_rows, lane_pixel_cols = np.where(roi > 0)

# Fit a 2nd-degree polynomial: col = a*row^2 + b*row + c.
# This curve describes the lane boundary in pixel space.
if len(lane_pixel_cols) > 50:   # need enough points for a stable fit
    coeffs = np.polyfit(lane_pixel_rows, lane_pixel_cols, deg=2)

    # Evaluate the polynomial at the car's bonnet row (bottom of ROI)
    # to find where the lane marking is directly ahead.
    bonnet_row = roi.shape[0] - 1
    lane_col_at_bonnet = np.polyval(coeffs, bonnet_row)

    # Lane centre is the midpoint between the left and right fitted curves.
    # Here we use a single fitted line as a simplified example.
    lane_centre_col = w / 2   # image centre = road centre assumption
    lateral_offset_pixels = lane_col_at_bonnet - lane_centre_col

    # Convert pixels to metres using known camera calibration.
    metres_per_pixel = 0.0035   # typical for a 1080p front camera
    lateral_offset_m = lateral_offset_pixels * metres_per_pixel
    print(f"Lateral offset from lane centre: {lateral_offset_m:.3f} m")`}
      />

      <ExplanationBox title="Tracking Objects Over Time">
        <p>
          Detection gives the car a snapshot: objects present in this frame. But the planner needs
          to know where an object is going. A pedestrian stepping off a curb at 1.2 m/s will be in
          the car&apos;s path in roughly 3 seconds — that timeline drives the urgency of braking.
        </p>
        <p>
          Object tracking links detections across consecutive frames to build a trajectory for each
          agent. The standard approach assigns each detected object a unique ID and, for every new
          frame, matches new detections to existing tracks using a combination of bounding-box
          overlap (IoU matching) and predicted position (via a Kalman filter, which we discuss in
          Module 5). From the track, the system estimates velocity, heading, and acceleration.
        </p>
        <p>
          The output of the full perception stack is a structured scene: a list of tracked objects,
          each with position, velocity, class label, and confidence. This is the world model the
          planner operates on.
        </p>
      </ExplanationBox>
    </div>
  );
}
