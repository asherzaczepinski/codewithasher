'use client';

import ExplanationBox from '@/components/ExplanationBox';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step8() {
  return (
    <div>
      <ExplanationBox title="The Python ML Stack">
        <p>
          Almost all practical ML work in Python uses the same four foundational libraries.
          They are designed to work together, and understanding what each one does — and does
          not do — prevents a lot of confusion.
        </p>
      </ExplanationBox>

      <ExplanationBox title="NumPy — The Numerical Foundation">
        <p>
          <strong>NumPy</strong> provides the array data structure that everything else is built
          on. Its core object is the <em>ndarray</em>: a multi-dimensional array of numbers stored
          in a contiguous block of memory. Operations on NumPy arrays are implemented in C and run
          orders of magnitude faster than equivalent Python loops.
        </p>
        <p>
          When you see X and y in ML code, they are almost always NumPy arrays. NumPy handles
          the linear algebra (matrix multiplication, dot products) that sits at the heart of
          nearly every ML algorithm. You will rarely interact with NumPy directly at the workflow
          level, but it is running underneath everything.
        </p>
      </ExplanationBox>

      <ExplanationBox title="pandas — Data Wrangling">
        <p>
          <strong>pandas</strong> is for reading, cleaning, exploring, and transforming tabular
          data. Its core object is the <em>DataFrame</em>: a table with named columns and an
          index. Think of it as a spreadsheet you can manipulate programmatically.
        </p>
        <p>
          Alex uses pandas for every EDA task in the previous module: loading the CSV, computing
          summary statistics, checking for missing values, filtering outliers, and engineering
          new features. pandas is the hands-on workhorse for the first 80% of the ML workflow.
        </p>
      </ExplanationBox>

      <ExplanationBox title="matplotlib — Visualization">
        <p>
          <strong>matplotlib</strong> is Python&apos;s foundational plotting library. It handles
          histograms, scatter plots, line charts, and heatmaps — all the visualizations Alex
          used during EDA. Its output can be rendered in Jupyter notebooks, saved as image files,
          or embedded in web apps.
        </p>
        <p>
          A companion library called <strong>seaborn</strong> provides higher-level statistical
          plots (correlation heatmaps, box plots, pair plots) with less code. Most practitioners
          use both: matplotlib for full control, seaborn for speed.
        </p>
      </ExplanationBox>

      <ExplanationBox title="scikit-learn — The ML Workhorse">
        <p>
          <strong>scikit-learn</strong> (imported as <em>sklearn</em>) provides a consistent
          interface to hundreds of ML algorithms — linear regression, decision trees, random
          forests, SVMs, k-nearest neighbors, and many more. It also provides preprocessing
          utilities (scalers, encoders), evaluation metrics (MAE, accuracy, precision, recall),
          and tools for cross-validation and hyperparameter search.
        </p>
        <p>
          The entire library follows one interface. Every model has the same three methods:
          <strong> .fit(X_train, y_train)</strong> — train the model;
          <strong> .predict(X)</strong> — make predictions;
          <strong> .score(X, y)</strong> — evaluate against true labels.
          This consistency means you can swap one algorithm for another with minimal code changes.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Reproducibility and Random Seeds">
        <p>
          Many steps in the ML workflow involve randomness: shuffling data before splitting,
          initializing model weights, subsampling during training. If you do not control
          randomness, two runs of the same code can produce different results — making debugging
          nearly impossible and making it hard to tell whether an improvement is real or just
          lucky noise.
        </p>
        <p>
          The solution is to set a <strong>random seed</strong>: a fixed starting value for the
          pseudorandom number generator. With the same seed, every call to a random function
          produces the same sequence of numbers. Different seeds produce different sequences,
          but any given seed is perfectly reproducible.
        </p>
        <p>
          The value 42 has no special significance — any integer works. What matters is
          consistency: use the same seed everywhere, and document it.
        </p>
      </ExplanationBox>

      <WorkedExample title="Alex&apos;s End-to-End Workflow Recap">
        <p>
          Here is every step Alex followed, from raw data to evaluated model. This is the
          canonical first-project workflow.
        </p>
        <CalcStep number={1}>
          <strong>Frame the problem.</strong> Decide: regression (predict house price) or classification (spam vs not spam). Define the target column. Define the success metric (MAE for price, F1-score for spam).
        </CalcStep>
        <CalcStep number={2}>
          <strong>Load and inspect the data.</strong> Use pandas to read the CSV. Print .describe(), check .isnull().sum(), plot histograms of all features.
        </CalcStep>
        <CalcStep number={3}>
          <strong>Split before doing anything else.</strong> Use train_test_split with a fixed random_state to create training, validation, and test sets. Lock the test set away.
        </CalcStep>
        <CalcStep number={4}>
          <strong>Perform EDA on the training set.</strong> Look for outliers, skew, correlations, and missing data. Document every finding.
        </CalcStep>
        <CalcStep number={5}>
          <strong>Preprocess.</strong> Fit the scaler and encoder on training data. Impute missing values using training statistics. Apply the same transformations to validation and test.
        </CalcStep>
        <CalcStep number={6}>
          <strong>Train and evaluate on validation.</strong> Fit a baseline model (e.g., LinearRegression). Measure validation performance. Iterate: try different models, features, or hyperparameters. Measure again.
        </CalcStep>
        <CalcStep number={7}>
          <strong>Final evaluation on the test set — once.</strong> Pick the best model from validation results. Evaluate it on the test set. Report this number as the honest performance estimate.
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          That&apos;s the complete loop. Every advanced technique in machine learning — deep
          learning, ensembles, hyperparameter search — is a refinement of one or more of
          these steps. The loop itself never changes.
        </p>
      </WorkedExample>

      <ExplanationBox title="You Now Have the Foundation">
        <p>
          You understand what machine learning is (learning patterns from data), the four
          learning paradigms, how to frame a problem and choose a target, how data is structured
          as X and y, why and how to split data correctly, what data leakage is and how to avoid
          it, how to explore and clean data, and how to preprocess features for modeling.
        </p>
        <p>
          You also know the tools every ML practitioner reaches for: NumPy for arrays, pandas for
          data wrangling, matplotlib for visualization, and scikit-learn for modeling and evaluation.
          And you know how to make your work reproducible with random seeds.
        </p>
        <p>
          From here, every course on a specific algorithm — linear regression, decision trees,
          neural networks, gradient boosting — builds directly on this foundation. You have the
          vocabulary, the mental model, and the workflow. The rest is practice and curiosity.
        </p>
      </ExplanationBox>
    </div>
  );
}
