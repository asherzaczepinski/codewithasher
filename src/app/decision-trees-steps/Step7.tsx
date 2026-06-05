'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step7() {
  return (
    <div>
      <ExplanationBox title="The Wisdom of Crowds">
        <p>
          A single decision tree has high variance — retrain it on a slightly different sample
          and you get a different tree. But consider this: if 500 people each independently
          guess the number of jellybeans in a jar, their <em>average</em> guess is almost always
          closer to the truth than any individual guess. Their errors cancel out.
        </p>
        <p>
          <strong>Random forests</strong> apply this exact insight to decision trees. Build
          hundreds of trees, each slightly different, and let them vote. Individual errors
          cancel; the consensus is much more stable and accurate than any single tree.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Two Sources of Randomness">
        <p>
          For the ensemble trick to work, the trees must be <em>different</em> — otherwise you just
          get the same answer 500 times. Random forests inject randomness in two places:
        </p>
        <ul style={{ lineHeight: '1.8' }}>
          <li>
            <strong>Bootstrap sampling (Bagging)</strong> — each tree is trained on a
            <em> bootstrap sample</em>: n examples drawn from the training set
            <em> with replacement</em>. With n = 8 examples, some rows appear twice or three
            times; others not at all (~37% of rows are left out on average). Different trees
            see different data, so they make different mistakes.
          </li>
          <li>
            <strong>Random feature subsets</strong> — at <em>each split</em>, only a random
            subset of features is considered as split candidates (typically √k features out of
            k total). This prevents all trees from always leading with the same dominant feature,
            forcing the forest to explore the full feature space.
          </li>
        </ul>
        <p>
          These two tricks together produce trees that are <em>decorrelated</em> — their errors
          are not all in the same direction, so averaging reduces the overall error.
        </p>
      </ExplanationBox>

      <MathFormula label="Random Forest prediction (classification)">
        ŷ = majority_vote( Tree₁(x), Tree₂(x), ..., TreeB(x) )
      </MathFormula>

      <MathFormula label="Random Forest prediction (regression)">
        ŷ = (1/B) · Σ Treeᵢ(x)
      </MathFormula>

      <ExplanationBox title="Why Does Averaging Reduce Variance?">
        <p>
          Suppose each tree makes an error with standard deviation σ, and the errors are
          independent. The variance of the average of B independent quantities is σ²/B — it
          shrinks as you add more trees. In practice the trees are not fully independent (they
          share training data and features), but they are <em>decorrelated enough</em> that
          variance falls substantially. Bias stays roughly the same as a single tree.
        </p>
        <p>
          In the bias-variance framework: a single deep tree has low bias but high variance.
          A random forest keeps the low bias while dramatically cutting variance. That&apos;s
          why forests almost always outperform single trees on real data.
        </p>
      </ExplanationBox>

      <WorkedExample title="A Mini Forest on the Tennis Dataset">
        <p>
          Let&apos;s sketch how three bootstrap trees might vote on a new example:
          Outlook = Sunny, Humidity = High, Wind = Weak.
        </p>
        <CalcStep number={1}>
          <strong>Tree 1</strong> — trained on bootstrap: D1, D1, D3, D4, D5, D6, D7, D8
          (D2 missing, D1 doubled). Primary split on Outlook=Sunny → Humidity=High → <strong>No</strong>.
        </CalcStep>
        <CalcStep number={2}>
          <strong>Tree 2</strong> — trained on bootstrap: D1, D2, D2, D4, D5, D5, D7, D8
          (D3, D6 missing; D2, D5 doubled). With D3 missing, Overcast examples are sparse.
          Feature subset at root excludes Outlook — splits on Humidity=High → <strong>No</strong>.
        </CalcStep>
        <CalcStep number={3}>
          <strong>Tree 3</strong> — trained on bootstrap: D1, D3, D4, D6, D6, D7, D8, D8
          (D2, D5 missing; D6, D8 doubled). Outlook=Sunny splits cleanly → Humidity=High → <strong>No</strong>.
        </CalcStep>
        <CalcStep number={4}>
          Majority vote: No (3), Yes (0). Forest predicts: <strong>No — do not play tennis</strong>.
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          All three trees agreed here. On harder examples, trees would disagree and the vote margin
          would be narrower — giving us a natural confidence measure. scikit-learn&apos;s
          <code> predict_proba</code> returns the fraction of trees voting for each class.
        </p>
      </WorkedExample>

      <ExplanationBox title="Key Hyperparameters for Random Forests">
        <ul style={{ lineHeight: '2' }}>
          <li><strong>n_estimators</strong> — number of trees. More trees = lower variance, higher
            compute. 100–500 is typical; gains plateau beyond ~500.</li>
          <li><strong>max_features</strong> — features considered per split. Default √k for
            classification, k/3 for regression. Smaller values decorrelate trees more but increase
            bias.</li>
          <li><strong>max_depth / min_samples_leaf</strong> — same as single trees; forests are
            less sensitive to these because averaging handles variance.</li>
          <li><strong>oob_score</strong> — out-of-bag error: each tree evaluates on the ~37% of
            examples it didn&apos;t see during training. A free validation estimate without a
            separate validation set.</li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="Beyond Forests: A Brief Look at Gradient Boosting">
        <p>
          Random forests build trees <em>in parallel</em>, each independently. <strong>Gradient
          boosting</strong> (XGBoost, LightGBM, scikit-learn&apos;s GradientBoostingClassifier)
          builds trees <em>sequentially</em>: each new tree is trained to correct the residual
          errors of all previous trees combined.
        </p>
        <p>
          Boosting typically achieves lower bias than random forests, at the cost of being more
          sensitive to hyperparameters and more prone to overfitting if not carefully tuned.
          Random forests are the safer default when you want strong out-of-the-box performance;
          gradient boosting is the go-to when you need to squeeze every last bit of accuracy on
          tabular data.
        </p>
        <p>
          Both are ensembles of decision trees at heart — which means everything you&apos;ve
          learned in this course is the foundation for understanding state-of-the-art models used
          in production systems worldwide. Well done.
        </p>
      </ExplanationBox>

      <ExplanationBox title="In Python">
        <p>
          We complete <code>decision_tree.py</code> with <code>bootstrap_sample()</code> and a
          minimal <code>RandomForest</code> class. It reuses <code>build_tree()</code> and
          <code> predict()</code> from Step 5 verbatim — the only additions are the sampling
          loop and majority-vote aggregation.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="decision_tree.py"
        caption="bootstrap_sample() and RandomForest wrap the single-tree code into an ensemble that votes."
        code={`# --- continuing decision_tree.py ---
# (dataset, build_tree, predict defined in earlier steps)

import random

# -------------------------------------------------------------------
# BOOTSTRAP SAMPLE — draw n rows WITH REPLACEMENT from the dataset.
# On average ~63% of original rows appear at least once; the rest
# are left out (the so-called "out-of-bag" examples, useful for
# free validation without a separate test set).
# -------------------------------------------------------------------
def bootstrap_sample(rows, seed=None):
    rng = random.Random(seed)   # seeded for reproducibility in demos
    n = len(rows)
    # Sample n times with replacement: each draw is independent, so
    # some rows appear multiple times and others not at all.
    return [rng.choice(rows) for _ in range(n)]


# -------------------------------------------------------------------
# RANDOM FOREST — trains n_trees independent decision trees, each on
# a different bootstrap sample.  Prediction is by majority vote.
# -------------------------------------------------------------------
class RandomForest:
    def __init__(self, n_trees=10, max_depth=10):
        # n_trees: more trees = lower variance, but more compute.
        # 100-500 is typical in practice; we use 10 here for clarity.
        self.n_trees = n_trees
        self.max_depth = max_depth
        self.trees = []   # will hold one trained tree per iteration

    def fit(self, rows):
        self.trees = []
        for i in range(self.n_trees):
            # Each tree sees a DIFFERENT bootstrap sample — this is
            # what makes the trees decorrelated and errors cancel out.
            sample = bootstrap_sample(rows, seed=i)

            # build_tree is the same greedy recursive builder from Step 5.
            tree = build_tree(sample, max_depth=self.max_depth)
            self.trees.append(tree)

    def predict(self, example):
        # Collect one vote from every tree in the forest.
        votes = [predict(tree, example) for tree in self.trees]

        # Majority vote: whichever class received the most votes wins.
        # In case of a tie, max() picks the first winner alphabetically.
        return max(set(votes), key=votes.count)

    def predict_proba(self, example):
        # The fraction of trees voting for each class is a natural
        # confidence estimate — no extra math required.
        votes = [predict(tree, example) for tree in self.trees]
        classes = set(votes)
        n = len(votes)
        return {cls: votes.count(cls) / n for cls in classes}


# -------------------------------------------------------------------
# DEMO — train a small forest on the tennis dataset and classify
# the same new day used in Step 5 (Sunny, Normal humidity, Weak wind)
# -------------------------------------------------------------------
forest = RandomForest(n_trees=10, max_depth=10)
forest.fit(dataset)

new_day = ["Sunny", "Normal", "Weak"]
print("Forest prediction:", forest.predict(new_day))
print("Vote breakdown:   ", forest.predict_proba(new_day))

# Training accuracy — individual trees may misfit their bootstrap
# sample but the ensemble often recovers all 8 correctly.
correct = sum(forest.predict(row[:3]) == row[3] for row in dataset)
print(f"Forest training accuracy: {correct}/{len(dataset)}")`}
      />
    </div>
  );
}
