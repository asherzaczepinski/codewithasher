'use client';

import ExplanationBox from '@/components/ExplanationBox';

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
