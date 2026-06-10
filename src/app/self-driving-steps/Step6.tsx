'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';

export default function Step6() {
  return (
    <div>
      <ExplanationBox title="The Centimetre Problem">
        <p>
          A standard road lane is 3.5 metres wide. To stay comfortably centred — especially while
          navigating a curve or passing a parked truck with 0.5 m to spare — the car needs to know
          its position to within <strong>10–20 centimetres</strong>. Consumer GPS delivers 3–5 metre
          accuracy on a good day, and as little as 15 metres in a city canyon between tall buildings.
          That gap is the localisation problem.
        </p>
      </ExplanationBox>

      <ExplanationBox title="HD Maps: The World Pre-Recorded">
        <p>
          The foundation of precise localisation is the <strong>HD (high-definition) map</strong>.
          Unlike a navigation map that shows roads as lines, an HD map is a centimetre-accurate
          3-D model of the physical world: exact lane boundaries, the positions of every lane
          marking, traffic sign, traffic light, kerb, and static landmark — captured by survey
          vehicles driving the routes repeatedly with top-tier LiDAR and GPS equipment.
        </p>
        <p>
          Waymo, Cruise, and every other Level 4 operator pre-maps their operational domain before
          a robotaxi drives a single passenger. The map is then downloaded to each vehicle and
          stored locally so the car can query it in real time without a network connection.
        </p>
        <p>
          On our city block the HD map encodes: the exact coordinates of the lane lines, the stop
          bar at the far intersection, the locations of the two street signs, and the height of the
          kerb on both sides. This pre-recorded geometry is the reference the car matches its live
          sensor data against.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Map Matching: Comparing Live Sensor Data to the Map">
        <p>
          At runtime the car takes its live LiDAR point cloud — captured right now — and asks:
          where in the HD map does this scan fit? It slides the scan over the map (trying small
          shifts in x, y, and heading) and measures how well the scan&apos;s points align with the
          map&apos;s recorded geometry. The position that produces the best alignment is the car&apos;s
          estimated location.
        </p>
        <p>
          The dominant algorithm for this is <strong>ICP (Iterative Closest Point)</strong>. ICP
          alternates between two steps: match each live point to its nearest map point, then compute
          the rigid transform (translation + rotation) that minimises the total distance between
          matched pairs. Repeating this converges to the best-fit position in a few milliseconds.
        </p>
        <MathFormula label="ICP Objective (minimise total point-to-map distance)">
          {'minimize Σ ||p_i  −  T(q_i)||²'}
          {'\n'}
          {'where p_i = map point,  q_i = scan point,  T = rigid transform'}
        </MathFormula>
        <p>
          By matching live LiDAR against the HD map at 10 Hz, the car achieves 5–10 cm positional
          accuracy — the centimetre-level precision the planner needs.
        </p>
      </ExplanationBox>

      <ExplanationBox title="SLAM: Mapping and Localising Simultaneously">
        <p>
          What happens in an area that has not been pre-mapped? This is where{' '}
          <strong>SLAM (Simultaneous Localisation and Mapping)</strong> comes in. SLAM lets the
          vehicle build a map of an unknown environment and localise itself within that map at the
          same time — using only its onboard sensors.
        </p>
        <p>
          The SLAM problem has a circular dependency: you need a map to localise, and you need your
          position to build the map. Modern solutions (graph-based SLAM, factor graphs) resolve
          this by maintaining a probabilistic graph of &quot;poses&quot; (positions at each
          timestep) and &quot;landmarks&quot; (observed features), then jointly optimising the whole
          graph as new observations come in.
        </p>
        <p>
          In practice, Level 4 systems rely on HD maps for their operational domain and use SLAM
          as a fallback or for continuous map-update — detecting and recording changes like a new
          construction barrier or a recently painted road marking.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Back to the City Block">
        <p>
          As our car navigates the block, the localisation module fuses three sources 200 times per
          second:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>IMU</strong> — provides high-rate acceleration and rotation updates; drifts
            slowly.
          </li>
          <li>
            <strong>GPS</strong> — provides an absolute position fix every 100 ms; noisy in the
            urban canyon between buildings.
          </li>
          <li>
            <strong>LiDAR-to-map matching (ICP)</strong> — provides a precise, drift-free
            correction every 100 ms by anchoring the estimate to the HD map.
          </li>
        </ul>
        <p>
          The Kalman filter (introduced in Module 5) fuses all three. The result: a continuously
          updated position and heading estimate accurate to roughly 10 cm, even when GPS briefly
          drops out passing between buildings. The planner gets a reliable, centimetre-precise
          &quot;where am I&quot; answer every 5 ms.
        </p>
      </ExplanationBox>
    </div>
  );
}
