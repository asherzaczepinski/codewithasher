'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step6() {
  return (
    <div>
      <ExplanationBox title="Why Plain Gradient Boosting Is Not Enough">
        <p>
          Vanilla gradient boosting is powerful but slow and prone to overfitting on large
          datasets. Three libraries — XGBoost, LightGBM, and CatBoost — each solve this in
          different ways while adding regularisation that plain gradient boosting lacks. Together
          they dominate Kaggle tabular competitions and production ML pipelines.
        </p>
      </ExplanationBox>

      <ExplanationBox title="XGBoost: Second-Order Optimisation and Regularisation">
        <p>
          XGBoost (eXtreme Gradient Boosting, Chen &amp; Guestrin 2016) makes two key improvements:
        </p>
        <p>
          <strong>Second-order gradients.</strong> Plain gradient boosting uses the first
          derivative (gradient) of the loss to fit each tree. XGBoost also uses the second
          derivative (Hessian), giving a more accurate local approximation of the loss surface.
          This means each tree is placed more precisely, requiring fewer rounds to converge.
        </p>
        <p>
          <strong>Built-in L1 and L2 regularisation.</strong> XGBoost adds two penalty terms
          to the tree-building objective: lambda (L2 penalty on leaf weights) and alpha
          (L1 penalty on leaf weights). These shrink leaf values and prune unnecessary leaves,
          directly controlling overfitting.
        </p>
      </ExplanationBox>

      <MathFormula label="XGBoost Tree Objective (for one tree)">
        Obj = sum over i of L(y&#7522;, F(x&#7522;)) + gamma &times; T + (lambda/2) &times; sum over j of w&#11388;&#178;
      </MathFormula>

      <ExplanationBox title="XGBoost Objective Explained">
        <p>
          In the formula above: T is the number of leaves in the tree, w&#11388; is the weight
          (prediction) at leaf j, gamma is a minimum gain threshold for creating a new leaf
          (automatic pruning), and lambda is the L2 weight penalty. Increasing lambda forces
          leaf weights toward zero — a direct regularisation knob.
        </p>
        <p>
          XGBoost also introduced <strong>parallel split finding</strong> using pre-sorted
          columns and later histogram-based approximate splits, making it dramatically faster
          than earlier implementations. It handles missing values natively by learning a default
          direction at each split.
        </p>
      </ExplanationBox>

      <ExplanationBox title="LightGBM: Histograms and Leaf-Wise Growth">
        <p>
          LightGBM (Microsoft, 2017) targets speed and memory efficiency, especially on
          datasets with millions of rows or thousands of features.
        </p>
        <p>
          <strong>Histogram-based splitting.</strong> Instead of searching every possible split
          value for a continuous feature, LightGBM bins continuous values into discrete buckets
          (typically 255 bins). Split search operates on buckets, reducing computation from
          O(n) per feature per node to O(bins) — a large constant-factor speedup.
        </p>
        <p>
          <strong>Leaf-wise (best-first) tree growth.</strong> Most boosting frameworks grow
          trees level by level (depth-wise). LightGBM always grows the leaf with the highest
          loss reduction, regardless of depth. This produces asymmetric trees that reduce loss
          faster per tree — but can overfit if trees grow too deep. Control with
          max_depth or num_leaves (the primary hyperparameter in LightGBM).
        </p>
        <p>
          <strong>GOSS and EFB.</strong> Gradient-based One-Side Sampling (GOSS) keeps
          examples with large gradients (hard examples) and samples a fraction of easy ones,
          speeding up training without losing much accuracy. Exclusive Feature Bundling (EFB)
          bundles mutually exclusive sparse features, reducing effective feature count.
        </p>
      </ExplanationBox>

      <ExplanationBox title="CatBoost: Ordered Boosting and Native Categoricals">
        <p>
          CatBoost (Yandex, 2018) addresses two problems the others handle less elegantly:{' '}
          <strong>categorical features</strong> and a subtle overfitting problem called{' '}
          <strong>prediction shift</strong>.
        </p>
        <p>
          <strong>Native categorical handling.</strong> XGBoost and LightGBM require you to
          encode categoricals (one-hot or target encoding) before training. CatBoost encodes
          them internally using <em>ordered target statistics</em> — a form of target encoding
          that uses only preceding training rows to compute the statistic for each row, avoiding
          data leakage. For datasets with many categorical columns (like loan&apos;s
          &quot;loan purpose&quot; or &quot;employer name&quot;), this is a significant
          convenience and accuracy win.
        </p>
        <p>
          <strong>Ordered boosting.</strong> Standard gradient boosting computes residuals using
          the same model that was trained on those examples, introducing a subtle bias. CatBoost
          builds a separate model for each training example using only the data that came before
          it, eliminating this bias. This comes at a training speed cost but often improves
          generalisation.
        </p>
      </ExplanationBox>

      <WorkedExample title="When to Pick Each Library">
        <CalcStep number={1}>
          <strong>XGBoost</strong>: great default choice; well-documented; handles structured
          data well; native sparse matrix support (good for one-hot encoded categoricals).
        </CalcStep>
        <CalcStep number={2}>
          <strong>LightGBM</strong>: reach for it when training speed matters or your dataset
          has &gt;500k rows; often fastest; num_leaves is the key tuning knob.
        </CalcStep>
        <CalcStep number={3}>
          <strong>CatBoost</strong>: best when you have many categorical columns and want to
          skip manual encoding; also strong on smaller datasets where ordered boosting&apos;s
          bias reduction matters most.
        </CalcStep>
        <CalcStep number={4}>
          <strong>On our loan dataset</strong>: XGBoost reaches 88.1% AUC, LightGBM 88.3%
          (and trains 3x faster), CatBoost 88.0% with no categorical encoding needed.
          Differences are small — all three beat Random Forest (81%) comfortably.
        </CalcStep>
      </WorkedExample>

      <ExplanationBox title="Key Hyperparameters Shared Across All Three">
        <p>
          Regardless of which library you use, the hyperparameters that move the needle most are:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li><strong>learning_rate</strong> (eta): start at 0.1; lower is better with more trees.</li>
          <li><strong>n_estimators / num_boost_round</strong>: use early stopping to find the right value.</li>
          <li><strong>max_depth / num_leaves</strong>: controls model complexity; tune to prevent overfitting.</li>
          <li><strong>subsample / bagging_fraction</strong>: row subsampling ratio (e.g. 0.8).</li>
          <li><strong>colsample_bytree / feature_fraction</strong>: column subsampling per tree.</li>
          <li><strong>min_child_weight / min_data_in_leaf</strong>: minimum samples per leaf; prevents tiny, noisy leaves.</li>
        </ul>
      </ExplanationBox>

    </div>
  );
}
