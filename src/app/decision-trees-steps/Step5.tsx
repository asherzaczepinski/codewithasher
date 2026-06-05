'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

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

      <ExplanationBox title="In Python">
        <p>
          We now complete <code>decision_tree.py</code>: <code>best_split()</code> scans every
          feature and every unique threshold to find the highest information gain;
          <code> build_tree()</code> calls it recursively; <code>predict()</code> walks a built
          tree for one new example. The play-tennis dataset is encoded as plain Python lists so
          you can trace each step by hand.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="decision_tree.py"
        caption="best_split, build_tree, and predict — the complete from-scratch decision tree."
        code={`# --- continuing decision_tree.py ---
# (gini, entropy, information_gain defined in earlier steps)

# -------------------------------------------------------------------
# DATA — play-tennis dataset (8 examples, 3 categorical features)
# Each row is [Outlook, Humidity, Wind, Label].
# We represent categories as strings; the tree handles them natively.
# -------------------------------------------------------------------
dataset = [
    ["Sunny",    "High",   "Weak",   "No"],
    ["Sunny",    "High",   "Strong", "No"],
    ["Overcast", "High",   "Weak",   "Yes"],
    ["Overcast", "Normal", "Weak",   "Yes"],
    ["Overcast", "High",   "Strong", "Yes"],
    ["Rain",     "Normal", "Strong", "No"],
    ["Rain",     "Normal", "Weak",   "Yes"],
    ["Sunny",    "Normal", "Weak",   "Yes"],
]

# Column indices for readability — avoids magic numbers below.
FEATURE_NAMES = ["Outlook", "Humidity", "Wind"]
N_FEATURES = 3   # columns 0-2 are features; column 3 is the label


# -------------------------------------------------------------------
# BEST SPLIT — scan every feature and every unique value it takes,
# returning the (feature_index, threshold_value) pair that maximises
# information gain on the given subset of rows.
# -------------------------------------------------------------------
def best_split(rows):
    labels = [row[3] for row in rows]   # extract label column
    best_gain = -1
    best_feat = None
    best_val  = None

    for feat_idx in range(N_FEATURES):
        # Collect all distinct values this feature takes in this subset.
        unique_vals = set(row[feat_idx] for row in rows)

        for val in unique_vals:
            # Split: rows WHERE feature==val go left, everything else right.
            left  = [r for r in rows if r[feat_idx] == val]
            right = [r for r in rows if r[feat_idx] != val]

            # Skip degenerate splits that leave one side empty — they
            # don't actually divide the data.
            if not left or not right:
                continue

            left_labels  = [r[3] for r in left]
            right_labels = [r[3] for r in right]

            gain = information_gain(labels, left_labels, right_labels)

            # Keep track of the best candidate seen so far.
            if gain > best_gain:
                best_gain = gain
                best_feat = feat_idx
                best_val  = val

    return best_feat, best_val, best_gain


# -------------------------------------------------------------------
# BUILD TREE — greedy recursive construction.
# Returns either a leaf dict {"leaf": True, "label": "Yes"/"No"}
# or an internal node dict {"leaf": False, "feat": i, "val": v,
#                            "left": subtree, "right": subtree}.
# -------------------------------------------------------------------
def build_tree(rows, depth=0, max_depth=10):
    labels = [r[3] for r in rows]

    # STOPPING CONDITION 1: all examples share the same label — pure leaf.
    if len(set(labels)) == 1:
        return {"leaf": True, "label": labels[0]}

    # STOPPING CONDITION 2: depth cap to prevent overfitting.
    if depth >= max_depth:
        # Predict the majority class at this node.
        majority = max(set(labels), key=labels.count)
        return {"leaf": True, "label": majority}

    # Find the best question to ask at this node.
    feat_idx, val, gain = best_split(rows)

    # STOPPING CONDITION 3: no split improves things (gain == 0).
    # This happens when every remaining feature is constant in this subset.
    if gain <= 0 or feat_idx is None:
        majority = max(set(labels), key=labels.count)
        return {"leaf": True, "label": majority}

    # Partition the rows and recurse on each child.
    left_rows  = [r for r in rows if r[feat_idx] == val]
    right_rows = [r for r in rows if r[feat_idx] != val]

    return {
        "leaf":  False,
        "feat":  feat_idx,          # which feature to test
        "val":   val,               # the value that sends a row LEFT
        "left":  build_tree(left_rows,  depth + 1, max_depth),
        "right": build_tree(right_rows, depth + 1, max_depth),
    }


# -------------------------------------------------------------------
# PREDICT — traverse the built tree for ONE new example.
# example is a list of feature values [Outlook, Humidity, Wind].
# -------------------------------------------------------------------
def predict(tree, example):
    # A leaf node holds the final prediction — we are done.
    if tree["leaf"]:
        return tree["label"]

    # Internal node: test the feature and follow the matching branch.
    if example[tree["feat"]] == tree["val"]:
        return predict(tree["left"],  example)   # value matches -> left
    else:
        return predict(tree["right"], example)   # anything else -> right


# -------------------------------------------------------------------
# DEMO — build the tree and classify a new day
# -------------------------------------------------------------------
tree = build_tree(dataset, max_depth=10)

# New example: Sunny sky, Normal humidity, Weak wind.
# Hand-tracing: root splits on Outlook==Sunny (left), then Humidity==High
# (right — it is Normal), leaf says "Yes".
new_day = ["Sunny", "Normal", "Weak"]
print("Prediction for Sunny/Normal/Weak:", predict(tree, new_day))

# Check training accuracy — a fully grown tree should fit all 8 rows.
correct = sum(
    predict(tree, row[:3]) == row[3]
    for row in dataset
)
print(f"Training accuracy: {correct}/{len(dataset)}")`}
      />
    </div>
  );
}
