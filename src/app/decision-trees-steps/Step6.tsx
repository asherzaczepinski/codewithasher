'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step6() {
  return (
    <div>
      <ExplanationBox title="The Memorization Trap">
        <p>
          A decision tree grown until every leaf is pure fits the training data <em>perfectly</em>.
          That sounds ideal — but it isn&apos;t. Real datasets contain noise: mislabeled examples,
          flukes, one-off coincidences. A deep tree memorizes all of it.
        </p>
        <p>
          Imagine a training set where one sunny, humid, windy day happened to be a good tennis
          day purely by luck. An unconstrained tree will carve out a special branch for that exact
          combination — a rule that fires for one example and misleads on every future example with
          similar weather. This is <strong>overfitting</strong>: low training error, high test error.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Bias vs Variance: The Core Trade-off">
        <p>
          Machine learning models face a fundamental tension:
        </p>
        <ul style={{ lineHeight: '1.8' }}>
          <li>
            <strong>High bias (underfitting)</strong> — the model is too simple to capture real
            patterns. A tree of depth 1 (a &quot;decision stump&quot;) has high bias; it can only
            draw one straight boundary.
          </li>
          <li>
            <strong>High variance (overfitting)</strong> — the model is so complex that small
            changes in training data produce wildly different models. A fully grown tree has high
            variance; retrain it on a slightly different sample and you get a completely different
            tree.
          </li>
        </ul>
        <p>
          The goal is to find the sweet spot: complex enough to learn real patterns, simple enough
          to generalise. For trees, that means limiting their size.
        </p>
      </ExplanationBox>

      <MathFormula label="Test error decomposition (conceptual)">
        Expected test error ≈ Bias² + Variance + Irreducible noise
      </MathFormula>

      <ExplanationBox title="Pre-Pruning: Stop Early">
        <p>
          The simplest remedy is to stop splitting before the tree becomes too deep.
          Common <strong>pre-pruning</strong> hyperparameters:
        </p>
        <ul style={{ lineHeight: '1.8' }}>
          <li>
            <strong>max_depth</strong> — hard ceiling on tree depth. A depth-3 tree can express
            up to 8 distinct regions; usually sufficient for many problems.
          </li>
          <li>
            <strong>min_samples_split</strong> — minimum examples a node must contain before we
            even consider splitting it. Prevents very small, noisy nodes from generating rules.
          </li>
          <li>
            <strong>min_samples_leaf</strong> — minimum examples that must land in each child
            after a split. Stops the tree from creating leaves with a single outlier.
          </li>
          <li>
            <strong>min_impurity_decrease</strong> — only split if IG exceeds a threshold. If the
            best split only reduces entropy by 0.001 bits, it&apos;s probably capturing noise.
          </li>
        </ul>
      </ExplanationBox>

      <WorkedExample title="Effect of max_depth on Our Tennis Tree">
        <p>
          Let&apos;s see concretely what different depth limits produce on our 8-example dataset
          (5 Yes, 3 No).
        </p>
        <CalcStep number={1}>
          <strong>max_depth = 0</strong> (just a root leaf): predict the majority class — &quot;Yes&quot;
          (5 out of 8). Training accuracy = 5/8 = 62.5%. Zero questions asked.
        </CalcStep>
        <CalcStep number={2}>
          <strong>max_depth = 1</strong> (one split): split on Outlook=Sunny.
          Left leaf: 2 No, 1 Yes → predict No. Right leaf: 4 Yes, 1 No → predict Yes.
          Correct: D1✓, D2✓, D3✓, D4✓, D5✓, D6✗, D7✓, D8✗ → 6/8 = 75% accuracy.
        </CalcStep>
        <CalcStep number={3}>
          <strong>max_depth = 2</strong> (our full tree): all leaves pure — 8/8 = 100% training accuracy.
          But the Wind split on the &quot;not Sunny&quot; branch captures just one &quot;No&quot;
          example (D6); it risks overfitting that specific day.
        </CalcStep>
        <CalcStep number={4}>
          A held-out validation set or cross-validation would tell us whether depth 1 or depth 2
          generalises better to unseen examples. In practice on this tiny dataset they&apos;d likely
          be similar, but on large noisy datasets depth 1 often wins on test data despite lower
          training accuracy.
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          The lesson: <strong>training accuracy is not the goal</strong>. We care about performance
          on examples the tree has never seen. Pre-pruning hyperparameters are tuned by evaluating
          on validation data, not on training data.
        </p>
      </WorkedExample>

      <ExplanationBox title="Post-Pruning: Grow Then Trim">
        <p>
          An alternative strategy is to grow the full tree first and then <strong>prune</strong>
          branches that don&apos;t improve generalisation. The classic algorithm is
          <em> cost-complexity pruning</em> (also called weakest-link pruning), which scikit-learn
          exposes via the <code>ccp_alpha</code> parameter.
        </p>
        <p>
          The idea: for each internal node, compare the test error of keeping its subtree versus
          replacing it with a single leaf. If the leaf is close enough in accuracy, collapse the
          subtree. A regularisation term α penalises each additional node, so larger α produces
          smaller, simpler trees. You sweep α on a validation set and pick the value that minimises
          validation error.
        </p>
        <p>
          Both pre- and post-pruning target the same goal: a tree that generalises, not just
          memorises. In the next module we&apos;ll see the most powerful solution of all — instead
          of pruning one tree, build a whole <em>forest</em>.
        </p>
      </ExplanationBox>
    </div>
  );
}
