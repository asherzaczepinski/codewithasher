'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step4() {
  return (
    <div>
      <ExplanationBox title="From Node Impurity to Split Quality">
        <p>
          We can measure how impure a single node is. But a split produces <em>two</em> children,
          and a small, impure child hurts less than a large, impure child. We need to account for
          size. The answer is the <strong>weighted impurity</strong> of the children: each
          child&apos;s impurity is multiplied by the fraction of training examples it received.
        </p>
      </ExplanationBox>

      <MathFormula label="Information Gain (using entropy)">
        IG(split) = H(parent) − [ (n_L / n) · H(left) + (n_R / n) · H(right) ]
      </MathFormula>

      <ExplanationBox title="Breaking Down the Formula">
        <p>
          <strong>H(parent)</strong> — entropy of the node <em>before</em> the split. This is the
          baseline confusion we start with.
        </p>
        <p>
          <strong>n_L / n</strong> and <strong>n_R / n</strong> — the fraction of examples going
          left and right respectively. These are the weights; they ensure a child that receives
          more examples has more influence on the weighted average.
        </p>
        <p>
          <strong>H(left)</strong> and <strong>H(right)</strong> — the entropy of each child after
          the split. Low entropy = pure = good.
        </p>
        <p>
          The bracket is the <strong>weighted child entropy</strong>. Subtracting it from the
          parent&apos;s entropy gives the <em>information gain</em> — how much confusion the split
          eliminates. <strong>Higher IG = better split.</strong> We pick the candidate split with
          the highest IG at every node.
        </p>
        <p>
          The same formula works with Gini — just replace H with Gini everywhere. The result is
          sometimes called <em>Gini gain</em> or simply the reduction in Gini impurity.
        </p>
      </ExplanationBox>

      <WorkedExample title="Comparing Two Candidate Splits">
        <p>
          We&apos;re at the root of our tennis tree. All 8 examples are present, with 5 &quot;Yes&quot;
          and 3 &quot;No.&quot; We compare two candidate first splits:
          <strong> Outlook = Sunny</strong> vs <strong> Wind = Strong</strong>.
        </p>

        <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>Step A — Parent entropy (shared by both candidates)</p>
        <CalcStep number={1}>
          p(Yes) = 5/8 = 0.625 &nbsp;&nbsp; p(No) = 3/8 = 0.375
        </CalcStep>
        <CalcStep number={2}>
          H(parent) = −0.625·log₂(0.625) − 0.375·log₂(0.375)
          &nbsp;= −0.625·(−0.678) − 0.375·(−1.415)
          &nbsp;= 0.424 + 0.531
          &nbsp;= <strong>0.954 bits</strong>
        </CalcStep>

        <p style={{ marginTop: '1.5rem', fontWeight: 'bold' }}>Step B — Split on Outlook = Sunny</p>
        <CalcStep number={3}>
          Left (Sunny): D1 No, D2 No, D8 Yes → 1 Yes, 2 No, n_L = 3
        </CalcStep>
        <CalcStep number={4}>
          H(left) = 0.918 bits &nbsp;(computed in previous module)
        </CalcStep>
        <CalcStep number={5}>
          Right (not Sunny): D3 Yes, D4 Yes, D5 Yes, D6 No, D7 Yes → 4 Yes, 1 No, n_R = 5
        </CalcStep>
        <CalcStep number={6}>
          p = 4/5 = 0.8 &nbsp;&nbsp;
          H(right) = −0.8·log₂(0.8) − 0.2·log₂(0.2)
          &nbsp;= −0.8·(−0.322) − 0.2·(−2.322)
          &nbsp;= 0.258 + 0.464
          &nbsp;= <strong>0.722 bits</strong>
        </CalcStep>
        <CalcStep number={7}>
          Weighted child entropy = (3/8)·0.918 + (5/8)·0.722 = 0.344 + 0.451 = 0.795 bits
        </CalcStep>
        <CalcStep number={8}>
          IG(Outlook=Sunny) = 0.954 − 0.795 = <strong>0.159 bits</strong>
        </CalcStep>

        <p style={{ marginTop: '1.5rem', fontWeight: 'bold' }}>Step C — Split on Wind = Strong</p>
        <CalcStep number={9}>
          Left (Strong wind): D2 No, D6 No, D7 Yes → 1 Yes, 2 No, n_L = 3
        </CalcStep>
        <CalcStep number={10}>
          H(left) = 0.918 bits &nbsp;(same composition as Sunny branch — coincidence!)
        </CalcStep>
        <CalcStep number={11}>
          Right (Weak wind): D1 No, D3 Yes, D4 Yes, D5 Yes, D8 Yes → 4 Yes, 1 No, n_R = 5
        </CalcStep>
        <CalcStep number={12}>
          H(right) = 0.722 bits &nbsp;(same composition as not-Sunny branch)
        </CalcStep>
        <CalcStep number={13}>
          Weighted child entropy = (3/8)·0.918 + (5/8)·0.722 = 0.795 bits
        </CalcStep>
        <CalcStep number={14}>
          IG(Wind=Strong) = 0.954 − 0.795 = <strong>0.159 bits</strong>
        </CalcStep>

        <p style={{ marginTop: '1rem' }}>
          In this toy dataset both splits happen to yield identical information gain. A real
          tree implementation would break the tie by index or prefer the first feature encountered.
          Typically one split will clearly dominate — Outlook produces dramatically purer subtrees
          than Wind does in the full 14-example tennis dataset. The algorithm always picks whichever
          candidate maximises IG, then recurses on each child.
        </p>
      </WorkedExample>

      <ExplanationBox title="Why Not Just Minimize Leaf Impurity Directly?">
        <p>
          You might wonder: why not just find the split that produces the purest single leaf?
          Because it could send 99% of the data to a mixed child and 1% to a pure leaf — a
          terrible trade. Information gain&apos;s weighted average naturally penalizes lopsided
          splits that hide mess in a large impure child.
        </p>
      </ExplanationBox>

      <ExplanationBox title="In Python">
        <p>
          We now add <code>information_gain()</code> on top of the impurity functions from the
          previous step. It weights each child&apos;s entropy by its share of the parent&apos;s
          examples, then measures how much the split reduced total confusion.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="decision_tree.py"
        caption="information_gain() extends the impurity functions — higher gain means a better split."
        code={`# --- continuing decision_tree.py ---
# (gini, entropy defined in the previous step — they live in the same file)

def information_gain(parent_labels, left_labels, right_labels):
    # How much did this split reduce entropy compared to the unsplit node?
    # A gain of 0 means the split taught us nothing.
    # A gain close to H(parent) means the children are nearly pure.

    n = len(parent_labels)
    n_left = len(left_labels)
    n_right = len(right_labels)

    # Baseline: entropy of the parent node BEFORE the split.
    h_parent = entropy(parent_labels)

    # Weighted child entropy: each child is scaled by the fraction of
    # examples it received.  A large impure child hurts more than a
    # small impure child — the weights capture this automatically.
    w_left = n_left / n
    w_right = n_right / n
    weighted_child_entropy = w_left * entropy(left_labels) + w_right * entropy(right_labels)

    # Information gain = how many bits of confusion the split removed.
    return h_parent - weighted_child_entropy


# -------------------------------------------------------------------
# DEMO: comparing Outlook=Sunny vs Wind=Strong at the root
# Full node: 5 Yes, 3 No (matches the worked example)
# -------------------------------------------------------------------
all_labels = ["Yes", "Yes", "Yes", "Yes", "Yes", "No", "No", "No"]

# Split A: Outlook = Sunny
# Left  (Sunny):     D1 No, D2 No, D8 Yes
# Right (not Sunny): D3 Yes, D4 Yes, D5 Yes, D6 No, D7 Yes
sunny_left  = ["No", "No", "Yes"]
sunny_right = ["Yes", "Yes", "Yes", "No", "Yes"]

ig_outlook = information_gain(all_labels, sunny_left, sunny_right)

# Split B: Wind = Strong
# Left  (Strong): D2 No, D6 No, D7 Yes
# Right (Weak):   D1 No, D3 Yes, D4 Yes, D5 Yes, D8 Yes
wind_left  = ["No", "No", "Yes"]
wind_right = ["No", "Yes", "Yes", "Yes", "Yes"]

ig_wind = information_gain(all_labels, wind_left, wind_right)

# In this toy dataset both ties at ~0.159 bits.  In the full 14-row
# dataset Outlook wins convincingly — the algorithm would pick it first.
print(f"IG(Outlook=Sunny): {ig_outlook:.3f} bits")
print(f"IG(Wind=Strong):   {ig_wind:.3f} bits")
print("Best split:", "Outlook" if ig_outlook >= ig_wind else "Wind")`}
      />
    </div>
  );
}
