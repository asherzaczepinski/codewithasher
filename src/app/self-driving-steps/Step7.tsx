'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';

export default function Step7() {
  return (
    <div>
      <ExplanationBox title="The Car Knows Where It Is — Now Where Should It Go?">
        <p>
          The planner receives a rich world model from perception and a precise position from
          localisation. Its job is to compute a <em>trajectory</em>: a sequence of positions,
          speeds, and headings, timed to the millisecond, that gets the car safely to its
          destination while obeying traffic laws and avoiding every obstacle.
        </p>
        <p>
          Planning is split into two levels — global and local — because the problems operate at
          very different timescales and resolutions.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Global Route Planning">
        <p>
          The global planner answers: <em>which roads do I take from origin to destination?</em> It
          operates over the road network graph — intersections are nodes, road segments are edges
          weighted by distance, speed limit, travel time, and current traffic. Classic graph-search
          algorithms solve this efficiently.
        </p>
        <p>
          <strong>A* (A-star)</strong> is the standard choice. Like Dijkstra&apos;s algorithm it
          finds the shortest path in a weighted graph, but it uses a heuristic (straight-line
          distance to the goal) to guide the search toward the destination, dramatically reducing
          the number of nodes explored. For a city-scale road network, A* returns a route in
          milliseconds.
        </p>
        <p>
          The result of global planning is a coarse route: &quot;turn left on Oak Street, continue
          400 m, stop.&quot; This is the instruction passed to the local planner.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Local Trajectory Planning">
        <p>
          The local planner operates over the next 3–10 seconds of driving, at centimetre
          resolution, updating every 100 ms. It must:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>Stay within the lane (or choose a lane change if blocked).</li>
          <li>Avoid all tracked obstacles, with a safety margin.</li>
          <li>
            Obey speed limits, traffic lights, and right-of-way rules from the HD map and
            perception layer.
          </li>
          <li>
            Produce comfortable motion — no jerky accelerations that would alarm passengers.
          </li>
          <li>
            Predict what other agents (pedestrians, cyclists, vehicles) will do over the planning
            horizon.
          </li>
        </ul>
        <p>
          The local planner generates a <em>set of candidate trajectories</em> — perhaps 100–1 000
          variants that differ in speed, lateral position, and lane-change timing — and evaluates
          each with a cost function to select the best one.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Cost Functions: Formalising &quot;Good&quot; Driving">
        <p>
          A cost function assigns a scalar number to each candidate trajectory. Lower cost is
          better. A typical cost function sums weighted terms:
        </p>
        <MathFormula label="Trajectory Cost Function">
          {'J(τ) = w_obs · C_obstacle(τ)'}
          {'     + w_lane · C_lane_deviation(τ)'}
          {'     + w_speed · C_speed(τ)'}
          {'     + w_comfort · C_jerk(τ)'}
          {'     + w_progress · C_progress(τ)'}
        </MathFormula>
        <p>
          <strong>C_obstacle</strong> — penalises proximity to detected obstacles. A trajectory
          passing within 0.3 m of the pedestrian gets a massive penalty; one with 2 m clearance
          gets a small one.
        </p>
        <p>
          <strong>C_lane_deviation</strong> — penalises drifting from lane centre, except during
          intentional lane changes.
        </p>
        <p>
          <strong>C_speed</strong> — penalises exceeding the speed limit and also penalises being
          unnecessarily slow (impeding traffic).
        </p>
        <p>
          <strong>C_jerk</strong> — penalises high jerk (rapid change in acceleration), keeping
          the ride smooth and controllable.
        </p>
        <p>
          <strong>C_progress</strong> — rewards trajectories that make progress toward the
          destination. Without this term the safest trajectory (score) might be to stop and never
          move.
        </p>
        <p>
          The weights (w_obs, w_lane, …) encode engineering priorities. In our city-block scenario,
          w_obs is enormous — the pedestrian&apos;s safety is non-negotiable — while w_progress is
          modest. The planner selects the trajectory with the lowest total J(τ).
        </p>
      </ExplanationBox>

      <ExplanationBox title="Predicting Other Agents">
        <p>
          A crucial input to the cost function is where each tracked agent will be in the future.
          A pedestrian stepping off the curb at 1.2 m/s will be ~3.6 m into the road in 3 seconds
          — right in the car&apos;s planned path. The planner must account for predicted futures,
          not just current positions.
        </p>
        <p>
          Simple prediction: assume constant velocity (project each agent forward linearly). Better
          prediction: use a learned model (e.g., a recurrent neural network or transformer trained
          on real traffic data) that incorporates the agent&apos;s past trajectory, the road
          geometry, and social context (pedestrians tend to cross at crosswalks; cyclists tend to
          follow bike lanes). Production AV planners use learned prediction models alongside
          physics-based priors.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The City-Block Decision">
        <p>
          When the pedestrian steps off the curb 8 m ahead, the local planner evaluates its
          candidate trajectories. The straightforward &quot;maintain speed&quot; trajectory scores
          very high cost on C_obstacle — the pedestrian will be in the car&apos;s path in ~2
          seconds. The &quot;decelerate at 0.3 g to stop 2 m before the pedestrian&apos;s predicted
          path&quot; trajectory scores lowest overall. The planner selects it and hands it to the
          controller.
        </p>
      </ExplanationBox>
    </div>
  );
}
