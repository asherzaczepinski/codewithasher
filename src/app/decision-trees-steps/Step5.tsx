'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step5() {
  return (
    <div>
      <ExplanationBox title="The Greedy Algorithm">
        <p>
          Building a decision tree is a <strong>greedy, recursive</strong> process. At each node
          we ask: &quot;Which single question reduces impurity the most right now?&quot; We pick
          that question, split the data, and then repeat the same process independently on each
          child node — we never revisit a decision already made higher in the tree.
        </p>
        <p>
          &quot;Greedy&quot; means we optimize one step at a time without looking ahead. This
          won&apos;t always produce the globally optimal tree, but it&apos;s computationally
          tractable and works surprisingly well in practice.
        </p>
      </ExplanationBox>

      <MathFormula label="Recursive tree-building algorithm">
        BuildTree(data, features):
        &nbsp;&nbsp;if data is pure → return Leaf(majority class)
        &nbsp;&nbsp;if no features left → return Leaf(majority class)
        &nbsp;&nbsp;best = argmax_f IG(data, f)
        &nbsp;&nbsp;left_data, right_data = split(data, best)
        &nbsp;&nbsp;return Node(best, BuildTree(left_data, ...), BuildTree(right_data, ...))
      </MathFormula>

      <ExplanationBox title="Stopping Conditions">
        <p>
          The recursion stops when any of these conditions is met:
        </p>
        <ul style={{ lineHeight: '1.8' }}>
          <li><strong>Pure node</strong> — all remaining examples have the same label. No split
            can improve things; we declare a leaf with that label.</li>
          <li><strong>No features left</strong> — we&apos;ve already asked about every feature.
            We predict the majority class.</li>
          <li><strong>Max depth reached</strong> — a hyperparameter that caps tree size to
            prevent overfitting (covered in the next module).</li>
          <li><strong>Too few examples</strong> — if a node has fewer than, say, 5 examples,
            splitting it further risks fitting noise.</li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="Making a Prediction">
        <p>
          Once the tree is built, classifying a new example is just traversing it from root to
          leaf: at each internal node, read the feature the node tests, follow the branch that
          matches the example&apos;s value, and continue until you hit a leaf. The leaf&apos;s
          label is the prediction.
        </p>
        <p>
          This is O(depth) — extremely fast at inference time regardless of how many training
          examples the tree was built from.
        </p>
      </ExplanationBox>

      <WorkedExample title="Building Our Tennis Tree Step by Step">
        <p>
          Starting with all 8 examples (5 Yes, 3 No) at the root, we walk through each split
          decision.
        </p>
        <CalcStep number={1}>
          Root: compute IG for Outlook=Sunny, Humidity=High, Wind=Strong.
          Suppose Outlook=Sunny gives IG = 0.159, which ties Wind but Outlook is tried first.
          We split on <strong>Outlook = Sunny</strong>.
        </CalcStep>
        <CalcStep number={2}>
          Left child (Sunny): D1 No, D2 No, D8 Yes — still mixed.
          Remaining features: Humidity, Wind.
          Compute IG for Humidity=High in this subgroup: High → [D1 No, D2 No] = pure No.
          Normal → [D8 Yes] = pure Yes. IG is high — split on <strong>Humidity = High</strong>.
        </CalcStep>
        <CalcStep number={3}>
          Sunny + High: D1 No, D2 No → <strong>pure &quot;No&quot; leaf</strong>.
        </CalcStep>
        <CalcStep number={4}>
          Sunny + Normal: D8 Yes → <strong>pure &quot;Yes&quot; leaf</strong>.
        </CalcStep>
        <CalcStep number={5}>
          Right child (not Sunny): D3 Yes, D4 Yes, D5 Yes, D6 No, D7 Yes — 4 Yes, 1 No.
          Only Wind is untested. Split on <strong>Wind = Strong</strong>.
        </CalcStep>
        <CalcStep number={6}>
          Not-Sunny + Strong: D6 No, D7 Yes — mixed, but only 1 example of each and no
          features left. Majority is Yes (tie-break). <strong>Leaf: &quot;Yes&quot;</strong>.
          (In the full 14-example dataset, this would be a pure No leaf.)
        </CalcStep>
        <CalcStep number={7}>
          Not-Sunny + Weak: D3 Yes, D4 Yes, D5 Yes → <strong>pure &quot;Yes&quot; leaf</strong>.
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          The completed tree has depth 2 and classifies all training examples correctly. To predict
          for a new day — say Sunny, Normal humidity, Weak wind — follow root (Sunny? Yes) →
          left child (Humidity=High? No, it&apos;s Normal) → right leaf: <strong>Play = Yes</strong>.
        </p>
      </WorkedExample>

      <ExplanationBox title="Why Depth Matters">
        <p>
          Our 8-example tree reached depth 2 before all leaves were pure. A dataset with 1000
          examples and 20 features might grow to depth 30 — memorizing every quirk in the
          training data. That&apos;s overfitting, and it&apos;s the critical weakness of
          unconstrained trees. The next module tackles it head-on.
        </p>
      </ExplanationBox>

    </div>
  );
}
