'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step5() {
  return (
    <div>
      <ExplanationBox title="Why Pipelines Beat Notebooks for Production">
        <p>
          A Jupyter notebook is an excellent tool for exploration. It is a terrible tool for
          production. The problems are structural, not stylistic:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Hidden state</strong> — cells can be run out of order. A notebook that &quot;works&quot;
            may depend on variables set by cells that were run, then deleted, hours ago. Re-running
            from top to bottom produces a different result.
          </li>
          <li>
            <strong>No versioning of data or parameters</strong> — which data snapshot did this
            model train on? What hyperparameters produced the best validation score? Notebooks
            don&apos;t track this automatically.
          </li>
          <li>
            <strong>No error handling</strong> — if a data source fails halfway through a
            notebook run, you often don&apos;t know which step failed or what partial state was written.
          </li>
          <li>
            <strong>Not reproducible</strong> — a colleague with the same notebook and &quot;the same&quot;
            data cannot guarantee the same model unless every preprocessing step is identical and the
            random seeds are fixed.
          </li>
        </ul>
        <p>
          A pipeline is a directed acyclic graph (DAG) of steps where each step has explicit inputs,
          outputs, and dependencies. Steps can be re-run independently, cached, and monitored.
          Pipelines are code — they live in version control, are tested, and can be triggered
          automatically.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Data Pipelines">
        <p>
          A data pipeline ingests raw data from one or more sources and produces a clean,
          feature-engineered dataset ready for training or inference.
        </p>
        <p>
          <strong>Typical stages in a data pipeline:</strong>
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Ingestion</strong> — pull data from databases, event streams (Kafka), data lakes
            (S3, GCS), or external APIs. Each source has its own schema, update frequency, and
            reliability characteristics.
          </li>
          <li>
            <strong>Validation</strong> — check that the data matches the expected schema, that
            critical columns are not null, that numerical ranges are sensible. Tools like
            Great Expectations or dbt tests automate this. A silent data quality failure upstream
            produces a model that trains successfully but predicts garbage.
          </li>
          <li>
            <strong>Transformation and feature engineering</strong> — clean, join, aggregate,
            and derive features. All transformation logic must be versioned — if the feature
            definition changes, old and new models are not comparable.
          </li>
          <li>
            <strong>Feature storage</strong> — computed features are written to a feature store
            (Feast, Tecton, Vertex Feature Store). A feature store serves the same features
            to both training and real-time inference, eliminating training-serving skew:
            the single biggest source of production model degradation.
          </li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="Training Pipelines">
        <p>
          A training pipeline takes a versioned dataset and configuration and produces a versioned,
          evaluated model artifact. It typically includes:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Data splitting</strong> — deterministic train/validation/test splits.
            For time series, this is always a temporal cut. Random seeds must be fixed.
          </li>
          <li>
            <strong>Preprocessing and scaling</strong> — fit scalers and encoders on training data
            only, then apply to validation and test data. Fitting on the full dataset is a data
            leakage bug.
          </li>
          <li>
            <strong>Model training</strong> — the actual optimization loop. Hyperparameters are
            passed in via configuration, not hardcoded.
          </li>
          <li>
            <strong>Evaluation</strong> — compute metrics on the held-out test set and compare
            against the baseline or the currently deployed model. Promotion is only allowed if
            the new model passes a defined quality gate.
          </li>
          <li>
            <strong>Registration</strong> — if evaluation passes, push the model artifact, its
            metadata, and its performance metrics to a model registry.
          </li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="Experiment Tracking">
        <p>
          Experiment tracking records every training run: the code version, data version,
          hyperparameters, hardware, runtime, and all evaluation metrics. Without it, answering
          &quot;what was different about the run that got 91% AUC versus the one that got 87%?&quot;
          requires archaeology through email chains and notebook filenames.
        </p>
        <p>
          Tools like MLflow, Weights and Biases (W&amp;B), and Neptune automatically log metrics,
          parameters, and artifacts when called from training code. You can then compare runs
          in a UI, reproduce any past experiment exactly, and share results with teammates.
        </p>
        <p>
          <strong>The minimum you should log for every run:</strong> git commit hash, data
          snapshot identifier, all hyperparameters, training and validation loss curves, and
          final test metrics.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Model Registry and Versioning">
        <p>
          A model registry is a central catalog of trained model artifacts. Each entry records
          the model&apos;s version, the metrics it achieved, the dataset it was trained on, and its
          current lifecycle stage: Staging, Production, or Archived.
        </p>
        <p>
          Promotion through stages is explicit and tracked. When a new model version is promoted
          to Production, the previous version moves to Archived — not deleted, because you need
          to be able to roll back. MLflow Model Registry, Sagemaker Model Registry, and Vertex AI
          Model Registry all follow this pattern.
        </p>
      </ExplanationBox>

      <MathFormula label="Reproducibility invariant">
        Model(data_v, code_v, config_v) always produces the same artifact
      </MathFormula>

      <WorkedExample title="Tracing a Training-Serving Skew Bug">
        <p>
          Our fraud detection team trains a model and deploys it. Offline AUC is 0.93.
          Online precision drops to 0.61. Why?
        </p>
        <CalcStep number={1}>
          Training feature: transaction_amount is log-transformed during preprocessing.
        </CalcStep>
        <CalcStep number={2}>
          The log transform was applied inside the training notebook, not in the shared feature
          pipeline. The serving API reads the raw amount directly.
        </CalcStep>
        <CalcStep number={3}>
          At inference time, the model receives raw amounts (e.g., 250.00) where it expects
          log-transformed amounts (e.g., 5.52). The feature distributions are completely different.
        </CalcStep>
        <CalcStep number={4}>
          Fix: move the log transform into the feature store pipeline. Both training and inference
          now read from the same computed feature, guaranteed to be identical.
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          Training-serving skew is the most common silent failure mode in production ML.
          A feature store with a single transformation definition shared by training and
          serving pipelines eliminates it by construction.
        </p>
      </WorkedExample>

      <ExplanationBox title="In Python">
        <p>
          The snippet below builds a scikit-learn <strong>Pipeline</strong> that bundles
          preprocessing and a classifier into a single serialisable object, then saves it
          with <strong>joblib</strong>. Saving the whole pipeline — not just the model weights —
          guarantees the scaler fitted on training data travels with the model to serving.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="train_pipeline.py"
        caption="Build, evaluate, and persist a versioned sklearn Pipeline so the scaler and model stay in sync."
        code={`import joblib
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score
import pandas as pd

# ----- 1. Load a versioned data snapshot -----
# Using a fixed snapshot path makes the training run reproducible.
# The snapshot identifier (date or hash) becomes part of the artifact name below.
df = pd.read_parquet("data/features_v20240601.parquet")
X = df.drop(columns=["label"])
y = df["label"]

# ----- 2. Deterministic train / test split -----
# random_state pins the split so re-running this script gives the same sets.
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# ----- 3. Build the Pipeline -----
# Bundling StandardScaler + classifier means the same transformation
# that was fitted on X_train will be applied automatically at inference time.
# No risk of forgetting to scale new data — the pipeline enforces it.
pipe = Pipeline([
    ("scaler", StandardScaler()),          # fit on train only, applied to test/serving
    ("clf", GradientBoostingClassifier(    # hyperparams passed explicitly, not hardcoded
        n_estimators=300,
        max_depth=4,
        learning_rate=0.05,
        random_state=42,
    )),
])

# ----- 4. Train -----
pipe.fit(X_train, y_train)

# ----- 5. Evaluate on held-out test set -----
# Quality gate: only proceed to registration if AUC exceeds the baseline.
auc = roc_auc_score(y_test, pipe.predict_proba(X_test)[:, 1])
print(f"Test AUC: {auc:.4f}")

MINIMUM_AUC = 0.88          # set by the team; new model must beat this to ship
assert auc >= MINIMUM_AUC, f"Model failed quality gate: AUC {auc:.4f} < {MINIMUM_AUC}"

# ----- 6. Persist the pipeline as a versioned artifact -----
# Include the data snapshot ID in the filename so you can always trace
# which data produced which artifact.  The registry (MLflow, S3, etc.)
# stores this file alongside the run metadata.
artifact_path = "artifacts/pipeline_v20240601.joblib"
joblib.dump(pipe, artifact_path)
print(f"Artifact saved: {artifact_path}")

# ----- 7. In a real project: log to the experiment tracker -----
# import mlflow
# mlflow.log_metric("test_auc", auc)
# mlflow.log_artifact(artifact_path)
# The logged run ties code commit, data version, params, and metrics together.
`}
      />
    </div>
  );
}
