'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step3() {
  return (
    <div>
      <ExplanationBox title="You Can&apos;t Think Without Sensing">
        <p>
          Before the car can perceive, plan, or act, it needs raw data about the physical world.
          Modern autonomous vehicles carry five distinct sensor types, each measuring a different
          property of reality. No single sensor is sufficient — each has blind spots that the
          others cover. Understanding what each sensor measures, and where it struggles, explains
          why fusion (Module 5) is non-negotiable.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Camera">
        <p>
          Cameras capture reflected light and produce a dense 2-D image — exactly what a human eye
          sees. They provide the richest semantic information: lane markings, traffic-sign text,
          traffic-light colours, and facial cues from pedestrians. A typical AV carries 8–12
          cameras covering 360 degrees, producing 30–60 frames per second.
        </p>
        <p>
          <strong>Strengths:</strong> extremely high resolution; cheap; the world is visually
          designed for human eyes, so signs and lights are camera-native information.
        </p>
        <p>
          <strong>Weaknesses:</strong> performance degrades in darkness, direct sun glare, heavy
          rain, snow, and fog. Cameras produce no direct depth measurement — the car must
          <em> infer</em> how far away an object is from visual cues like size and perspective,
          which introduces error.
        </p>
        <p>
          In our city-block scenario the front camera is the first sensor to see the pedestrian
          stepping off the curb. The image gets fed into a YOLO object-detection model — trained
          on millions of labelled images using the CNN techniques covered in the Computer Vision
          course — which draws a bounding box around the pedestrian within about 30 ms.
        </p>
      </ExplanationBox>

      <ExplanationBox title="LiDAR">
        <p>
          LiDAR (Light Detection and Ranging) fires rapid pulses of laser light and measures the
          time each pulse takes to bounce back. Because the speed of light is known precisely,
          distance = (round-trip time × speed of light) / 2. A rotating LiDAR head fires hundreds
          of thousands of pulses per second, building a dense 3-D point cloud of the environment.
        </p>
        <p>
          <strong>Strengths:</strong> direct, precise 3-D geometry — centimetre-level distance
          accuracy out to 100–200 m. Works in darkness (it generates its own light). Does not
          depend on ambient illumination.
        </p>
        <p>
          <strong>Weaknesses:</strong> expensive (historically $10 000–$75 000 per unit, though
          solid-state designs are dropping this). Rain, snow, and fog scatter laser pulses,
          degrading range and accuracy. Produces no colour or texture — it is just geometry, so
          reading a stop sign&apos;s text from a point cloud alone is impractical.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Radar">
        <p>
          Radar (Radio Detection and Ranging) emits radio waves and measures the reflected signal.
          Because radio wavelengths are far longer than laser wavelengths, radar penetrates rain,
          fog, and snow almost unaffected. A key advantage: by measuring the Doppler shift of the
          return signal, radar directly reports a target&apos;s <em>radial velocity</em> — how fast
          it is moving toward or away from the car.
        </p>
        <p>
          <strong>Strengths:</strong> reliable in all weather conditions; accurate velocity
          measurement without needing two frames; low cost; long range (up to 250 m for highway
          adaptive cruise control).
        </p>
        <p>
          <strong>Weaknesses:</strong> poor angular resolution — radar struggles to distinguish
          whether that return is a pedestrian, a cyclist, or a shopping trolley. Spatial detail is
          orders of magnitude coarser than LiDAR or camera.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Ultrasonic Sensors">
        <p>
          Ultrasonic sensors emit a sound pulse (above human hearing range) and listen for the
          echo, computing distance from the round-trip time. They are the parking sensors embedded
          in most car bumpers.
        </p>
        <p>
          <strong>Strengths:</strong> very cheap; reliable for short-range detection (0–5 m);
          unaffected by lighting or colour.
        </p>
        <p>
          <strong>Weaknesses:</strong> maximum effective range of roughly 5–8 m; no directional
          detail. Useful for low-speed manoeuvring (parallel parking, garage entry) but contribute
          little at driving speeds.
        </p>
      </ExplanationBox>

      <ExplanationBox title="GPS and IMU">
        <p>
          GPS (Global Positioning System) provides absolute position anywhere on Earth by
          triangulating signals from satellites. Standard GPS is accurate to roughly 3–5 metres —
          not nearly enough to keep a car centred in a 3.5-metre lane. Differential GPS and RTK
          (Real-Time Kinematic) corrections can push accuracy to 2–10 centimetres, but signal
          can be lost in urban canyons between tall buildings.
        </p>
        <p>
          An IMU (Inertial Measurement Unit) contains accelerometers (measure linear acceleration)
          and gyroscopes (measure rotation rate). It updates at 200–1 000 Hz — far faster than
          GPS — and fills the gaps. However, IMU measurements accumulate error (drift) over time,
          so they must be corrected by GPS or by matching the environment to a map.
        </p>
        <p>
          GPS + IMU together give the car a continuous, high-rate estimate of position and
          orientation that serves as the backbone for localisation (Module 6).
        </p>
      </ExplanationBox>

      <ExplanationBox title="Sensor Summary at a Glance">
        <p>
          <strong>Camera:</strong> rich visual detail; no depth; fails in darkness and bad weather.
          <br />
          <strong>LiDAR:</strong> precise 3-D geometry; works in dark; fails in heavy precipitation;
          expensive.
          <br />
          <strong>Radar:</strong> all-weather; direct velocity; coarse spatial resolution.
          <br />
          <strong>Ultrasonic:</strong> cheap short-range proximity; low detail.
          <br />
          <strong>GPS/IMU:</strong> global position + orientation; GPS degrades in urban canyons;
          IMU drifts without correction.
        </p>
        <p>
          Our city-block car uses all five simultaneously. Combining their outputs to form a single
          reliable world model is the job of sensor fusion — covered in Module 5.
        </p>
      </ExplanationBox>
    </div>
  );
}
