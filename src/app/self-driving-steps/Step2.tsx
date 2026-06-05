'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step2() {
  return (
    <div>
      <ExplanationBox title="SAE Defines the Language">
        <p>
          In 2014 the Society of Automotive Engineers published a six-level taxonomy — SAE J3016 —
          that has become the industry standard for describing how much a vehicle can drive itself.
          The levels run from 0 (no automation) to 5 (full autonomy). Understanding them prevents
          the constant media confusion between &quot;driver assist&quot; and &quot;self-driving.&quot;
        </p>
      </ExplanationBox>

      <ExplanationBox title="Levels 0 – 2: The Human Is Always Responsible">
        <p>
          <strong>Level 0 — No Automation.</strong> Every driving task falls on the human. The car
          may have warnings (a beep when you drift) but it never takes control. Most cars on the
          road today are still Level 0.
        </p>
        <p>
          <strong>Level 1 — Driver Assistance.</strong> The system handles <em>one</em> of either
          steering or speed — not both simultaneously. Adaptive cruise control (maintains a set
          following distance) is a textbook Level 1 feature. The human monitors everything and can
          take over at any moment.
        </p>
        <p>
          <strong>Level 2 — Partial Automation.</strong> The system controls <em>both</em> steering
          and speed at the same time, but the driver must keep hands on the wheel and eyes on the
          road. Tesla Autopilot and GM Super Cruise operate at Level 2. The driver is still legally
          and physically responsible for every moment — the system just reduces physical workload on
          highways.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Levels 3 – 5: The System Takes Over">
        <p>
          <strong>Level 3 — Conditional Automation.</strong> The car handles all driving tasks
          within a defined operational design domain (ODD) — for example, a divided highway at
          speeds below 130 km/h in daylight. The human can look away but must be ready to take
          control when the system requests it, typically within several seconds. Mercedes-Benz
          received the first approved Level 3 certification in several US states in 2023.
        </p>
        <p>
          <strong>Level 4 — High Automation.</strong> The system completes the entire trip within
          its ODD without any human intervention — even if the human ignores a takeover request.
          The car will simply pull over safely. Waymo&apos;s commercial robotaxi service in San
          Francisco and Phoenix operates at Level 4. The ODD is still restricted: known mapped
          areas, certain weather conditions, speed limits.
        </p>
        <p>
          <strong>Level 5 — Full Automation.</strong> The car can drive anywhere, in any condition,
          that a human driver could. No ODD restrictions. No steering wheel or pedals required.
          Level 5 does not commercially exist today, and most experts do not expect it within this
          decade — the long tail of edge cases is immense.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Where Today&apos;s Cars Actually Sit">
        <p>
          The vast majority of vehicles sold today are <strong>Level 1 or Level 2</strong>. Features
          like lane-keep assist, automatic emergency braking, and adaptive cruise control are now
          standard on mid-range cars — but they are assistants, not drivers. The human remains
          legally responsible.
        </p>
        <p>
          Commercial <strong>Level 4</strong> robotaxis (Waymo, Cruise, Baidu Apollo) operate in
          limited geofenced areas in a handful of cities. They represent the current frontier of
          deployed autonomy.
        </p>
        <p>
          The gap between Level 4 and Level 5 is not about raw intelligence — it is about
          <em> coverage</em>: mapping every road on earth, handling every weather condition, and
          proving safety across billions of edge cases. The engineering stack we study in this
          course is what powers Level 4 today and will need to scale to achieve Level 5 tomorrow.
        </p>
      </ExplanationBox>
    </div>
  );
}
