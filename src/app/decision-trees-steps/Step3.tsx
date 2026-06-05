'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step3() {
  return (
    <div>
      <ExplanationBox title="What Does &quot;Impure&quot; Mean, Exactly?">
        <p>
          Impurity answers the question: <em>if I randomly pick two examples from this node, how
          likely is it that they belong to different classes?</em> A perfectly pure node (all one
          class) has impurity 0 — every pair you pick matches. A maximally mixed node (50/50 split)
          has the highest impurity — half the time you pick a mismatched pair.
        </p>
        <p>
          Two formulas capture this idea. Both equal 0 for a pure node and reach their peak at a
          50/50 mix. They differ only in <em>how steeply</em> they penalize imbalance.
        </p>
      </ExplanationBox>

      <MathFormula label="Gini Impurity (for binary classification)">
        Gini = 1 − p² − (1 − p)²
      </MathFormula>

      <ExplanationBox title="Understanding Gini Impurity">
        <p>
          Here <strong>p</strong> is the fraction of examples belonging to the positive class
          (say, &quot;Yes&quot;). The term p² is the probability that two randomly drawn examples
          are both &quot;Yes,&quot; and (1−p)² is the probability that both are &quot;No.&quot;
          Subtracting from 1 gives the probability they <em>differ</em> — exactly our impurity
          intuition.
        </p>
        <ul style={{ lineHeight: '1.8' }}>
          <li>Pure node (p = 1 or p = 0): Gini = 1 − 1 − 0 = <strong>0</strong></li>
          <li>50/50 mix (p = 0.5): Gini = 1 − 0.25 − 0.25 = <strong>0.5</strong></li>
        </ul>
        <p>
          So Gini ranges from 0 (perfectly pure) to 0.5 (maximally mixed for two classes).
          Lower is always better when splitting.
        </p>
      </ExplanationBox>

      <MathFormula label="Entropy (information-theoretic impurity)">
        H = −p · log₂(p) − (1 − p) · log₂(1 − p)
      </MathFormula>

      <ExplanationBox title="Understanding Entropy">
        <p>
          Entropy comes from information theory. It measures how many bits you&apos;d need on
          average to encode the class label of a randomly drawn example. A pure node needs 0 bits
          (you already know the answer). A 50/50 mix needs 1 bit — one fair coin flip.
        </p>
        <ul style={{ lineHeight: '1.8' }}>
          <li>Pure node (p = 1): H = −1·log₂(1) − 0·log₂(0) = <strong>0 bits</strong></li>
          <li>50/50 mix (p = 0.5): H = −0.5·log₂(0.5) − 0.5·log₂(0.5) = −0.5·(−1) − 0.5·(−1) = <strong>1 bit</strong></li>
        </ul>
        <p>
          Entropy ranges from 0 to 1 (for binary problems). In practice, Gini and entropy almost
          always select the same best split — the choice rarely matters much. scikit-learn uses
          Gini by default; ID3 and C4.5 use entropy.
        </p>
      </ExplanationBox>

      <WorkedExample title="Computing Gini and Entropy for the Sunny Branch">
        <p>
          After splitting on <strong>Outlook = Sunny</strong>, the left branch holds D1 (No),
          D2 (No), D8 (Yes) — that is, 2 &quot;No&quot; and 1 &quot;Yes&quot; out of 3 examples.
          Let&apos;s compute both impurity measures for this group.
        </p>
        <CalcStep number={1}>
          Count classes: &nbsp;&nbsp;Yes = 1, &nbsp;&nbsp;No = 2, &nbsp;&nbsp;Total = 3
        </CalcStep>
        <CalcStep number={2}>
          Fraction positive (Yes): &nbsp;&nbsp;p = 1 / 3 ≈ 0.333
        </CalcStep>
        <CalcStep number={3}>
          Fraction negative (No): &nbsp;&nbsp;1 − p = 2 / 3 ≈ 0.667
        </CalcStep>
        <CalcStep number={4}>
          Gini = 1 − (0.333)² − (0.667)²
          &nbsp;= 1 − 0.111 − 0.444
          &nbsp;= <strong>0.444</strong>
        </CalcStep>
        <CalcStep number={5}>
          log₂(0.333) ≈ −1.585 &nbsp;&nbsp; log₂(0.667) ≈ −0.585
        </CalcStep>
        <CalcStep number={6}>
          H = −(0.333 × −1.585) − (0.667 × −0.585)
          &nbsp;= 0.528 + 0.390
          &nbsp;= <strong>0.918 bits</strong>
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          Both measures agree: this group is quite impure (close to the worst case of 0.5 for Gini
          and 1.0 for entropy). We&apos;ll need another question inside the Sunny branch to clean
          it up. For comparison, the right branch (4 Yes, 1 No out of 5) has Gini ≈ 0.32 and
          H ≈ 0.722 — meaningfully purer.
        </p>
      </WorkedExample>

      <ExplanationBox title="Key Takeaway">
        <p>
          A good split drives impurity <em>down</em> in both child nodes. But knowing one
          node&apos;s impurity isn&apos;t enough — a large, impure child is worse than a small,
          impure child, because it affects more examples. That&apos;s why we need a
          <strong> weighted</strong> measure across both children, which is exactly what
          Information Gain delivers in the next module.
        </p>
      </ExplanationBox>

      <ExplanationBox title="In Python">
        <p>
          Below we implement <code>gini()</code> and <code>entropy()</code> exactly as the formulas
          above, then run them on the Sunny branch from the worked example. Read every comment —
          the comments are the lesson.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="decision_tree.py"
        caption="gini() and entropy() — the two impurity functions that drive every split decision."
        code={`import math
from collections import Counter

# -------------------------------------------------------------------
# IMPURITY FUNCTIONS
# Both functions take a list of class labels, e.g. ["Yes","No","No"],
# and return a single float measuring how mixed the group is.
# Lower = purer = better.
# -------------------------------------------------------------------

def gini(labels):
    # Count how many times each class appears.
    counts = Counter(labels)
    n = len(labels)

    # Guard: an empty node has no impurity to measure.
    if n == 0:
        return 0.0

    # Gini = 1 - sum(p_i^2) over all classes i.
    # Intuition: p_i^2 is the probability that TWO randomly drawn
    # examples both belong to class i.  Summing over all classes gives
    # the probability that both draws agree.  Subtracting from 1 gives
    # the probability they DISAGREE — that is our impurity.
    return 1.0 - sum((c / n) ** 2 for c in counts.values())


def entropy(labels):
    # Entropy comes from information theory: how many bits do you need
    # to encode a randomly drawn label?  Pure node => 0 bits (you
    # already know the answer).  50/50 mix => 1 bit (one coin flip).
    counts = Counter(labels)
    n = len(labels)

    if n == 0:
        return 0.0

    result = 0.0
    for c in counts.values():
        p = c / n
        # -p * log2(p) is the contribution of class i to total entropy.
        # We skip p==0 because log2(0) is undefined (the limit is 0).
        if p > 0:
            result -= p * math.log2(p)
    return result


# -------------------------------------------------------------------
# DEMO: the Sunny branch from the worked example
# Labels: D1=No, D2=No, D8=Yes  =>  2 No, 1 Yes out of 3 examples
# -------------------------------------------------------------------
sunny_labels = ["No", "No", "Yes"]

g = gini(sunny_labels)
h = entropy(sunny_labels)

# Expected: gini ~ 0.444, entropy ~ 0.918 — matches the hand calculation.
print(f"Gini impurity (Sunny branch):    {g:.3f}")
print(f"Entropy impurity (Sunny branch): {h:.3f} bits")

# A pure node for reference — impurity should be 0 for both measures.
pure_labels = ["Yes", "Yes", "Yes"]
print(f"Gini (pure node):    {gini(pure_labels):.3f}")
print(f"Entropy (pure node): {entropy(pure_labels):.3f} bits")`}
      />
    </div>
  );
}
