'use client';

import ExplanationBox from '@/components/ExplanationBox';
import CodeBlock from '@/components/CodeBlock';

export default function Step8() {
  return (
    <div>
      <ExplanationBox title="Why Governance Is an Engineering Problem">
        <p>
          ML governance is often treated as a compliance checkbox — something the legal team worries
          about after the model is built. That is exactly backwards. Decisions made during data
          collection, feature selection, training, and deployment determine whether a model is
          governable at all. By the time a regulator or an audit asks &quot;how does this model make
          decisions?&quot; it is too late to reconstruct the answer if the infrastructure was not
          designed to capture it.
        </p>
        <p>
          Governance in ML means being able to answer, at any point in time: What data was this
          model trained on? Who approved it? What population does it perform well on — and poorly
          on? What are its failure modes? Where is it deployed and who can access it?
        </p>
      </ExplanationBox>

      <ExplanationBox title="Model Governance in Practice">
        <p>
          <strong>Model cards</strong> are structured documentation artifacts that accompany a
          model into production. Originally proposed by Google, a model card captures: intended use
          cases, training data description, evaluation results disaggregated by subgroup (the model
          achieves 94% accuracy overall but 78% on a specific demographic — that needs to be
          visible), known limitations, and recommended mitigations. They are living documents that
          update with each new model version.
        </p>
        <p>
          <strong>Audit trails</strong> — every promotion, rollback, and configuration change to
          a production model should be logged with a timestamp, the person or system that triggered
          it, and the reason. If a model causes a bad outcome next month, you need to trace exactly
          what version was live and when.
        </p>
        <p>
          <strong>Access control</strong> — not everyone should be able to retrain or deploy a
          production model. Role-based access control (RBAC) on the model registry ensures that
          only authorized engineers can promote a model from Staging to Production, and that the
          action requires an explicit approval step.
        </p>
        <p>
          <strong>Fairness evaluation</strong> — evaluate performance metrics disaggregated across
          protected attributes (age, gender, race, geography) before deploying any model that makes
          decisions about people. A model that is accurate on average but substantially worse for
          a specific demographic may be discriminatory, regardless of intent. Fairness is not a
          post-hoc audit — it must be part of the evaluation pipeline.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Security: Adversarial Attacks and Data Poisoning">
        <p>
          ML models are not just software with bugs — they have unique attack surfaces that
          traditional software does not:
        </p>
        <p>
          <strong>Adversarial examples</strong> — small, carefully crafted perturbations to an
          input that cause a model to misclassify with high confidence. A stop sign with a few
          stickers placed strategically can fool an autonomous vehicle&apos;s perception model while
          looking perfectly normal to a human. Adversarial robustness is an active research area;
          adversarial training (including adversarial examples in the training set) is the most
          practical defense.
        </p>
        <p>
          <strong>Data poisoning</strong> — an attacker corrupts the training data before or
          during the training process, causing the trained model to have a backdoor: it behaves
          normally on clean inputs but produces attacker-controlled outputs when a specific trigger
          pattern appears. Defenses include data provenance tracking, outlier detection in training
          data, and limiting who can contribute to the training dataset.
        </p>
        <p>
          <strong>Model extraction</strong> — an attacker queries your deployed model with many
          inputs and uses the predictions to train a surrogate model that approximates your model&apos;s
          behavior, effectively stealing it. Rate limiting, prediction watermarking, and query
          logging help detect and deter extraction attempts.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Privacy: PII, Differential Privacy, and Federated Learning">
        <p>
          ML models trained on personal data inherit privacy risks. The model may inadvertently
          memorize sensitive training examples, which can be extracted through membership inference
          attacks (querying whether a specific record was in the training set).
        </p>
        <p>
          <strong>PII handling</strong> — Personally Identifiable Information must be identified
          and handled appropriately throughout the data pipeline. Fields like name, email, SSN,
          IP address, and device ID should be pseudonymized or removed before entering training
          data. Even seemingly innocuous combinations of fields can re-identify individuals
          (zip code + birthdate + sex uniquely identifies 87% of the US population, per research
          by Latanya Sweeney).
        </p>
        <p>
          <strong>Differential privacy (DP)</strong> provides a mathematical guarantee: any single
          training record contributes so little to the model that its inclusion or exclusion cannot
          be reliably detected by querying the model. In practice, DP is achieved by adding
          calibrated noise to gradients during training (DP-SGD). The cost is a reduction in model
          accuracy — the privacy-utility tradeoff — controlled by the privacy budget parameter
          epsilon. Smaller epsilon means stronger privacy and more accuracy loss.
        </p>
        <p>
          <strong>Federated learning</strong> trains a global model without centralizing data.
          Each device (or data silo) computes gradients locally using its own data and sends only
          the gradient update — not the raw data — to a central aggregator. The aggregator
          combines updates and sends back the improved global model. Google uses federated learning
          to train the next-word prediction model on Android keyboards without any user&apos;s typing
          data ever leaving their phone.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Compliance and Regulation">
        <p>
          Regulatory requirements for ML systems are jurisdiction- and domain-specific but are
          expanding globally:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>GDPR (EU)</strong> — individuals have a right to explanation for automated
            decisions that significantly affect them. Models making credit, hiring, or insurance
            decisions must be explainable on request. Users can request deletion of their data,
            which requires you to track which training data contains their records.
          </li>
          <li>
            <strong>EU AI Act</strong> — classifies AI systems by risk level. High-risk systems
            (credit scoring, employment, biometric identification, critical infrastructure) face
            mandatory conformity assessments, data governance requirements, and human oversight
            obligations before market entry.
          </li>
          <li>
            <strong>HIPAA (US)</strong> — any ML system processing Protected Health Information
            must implement administrative, physical, and technical safeguards. De-identification
            must meet either the Expert Determination or Safe Harbor standard.
          </li>
          <li>
            <strong>ECOA / Fair Credit Reporting Act (US)</strong> — credit decisions must be
            explainable; adverse actions require specific written reasons. ML models used for
            credit decisions face scrutiny for disparate impact across protected classes.
          </li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="In Python">
        <p>
          The first snippet shows how to log every prediction with a timestamp so the full
          prediction history is queryable for audits and drift analysis. The second shows a
          lightweight data-validation check you can run on every incoming batch to catch schema
          or range violations before they silently corrupt downstream metrics.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="prediction_logger.py"
        caption="Log every prediction with a timestamp and model version so the full inference history is auditable."
        code={`import csv
import json
import logging
import time
from pathlib import Path

# Structured logging to a rotating file gives you a queryable audit trail.
# In production, ship these logs to a data warehouse (BigQuery, Snowflake)
# so you can join predictions against ground-truth labels when they arrive
# and compute actual precision / recall — not just offline estimates.

LOG_PATH = Path("logs/predictions.jsonl")   # one JSON object per line (JSON Lines format)
LOG_PATH.parent.mkdir(parents=True, exist_ok=True)

def log_prediction(
    request_id: str,
    features: dict,
    fraud_probability: float,
    model_version: str,
) -> None:
    record = {
        "ts": time.time(),                  # Unix timestamp — convert to UTC in the warehouse
        "request_id": request_id,           # trace ID: links prediction to the original HTTP request
        "model_version": model_version,     # which artifact scored this request
        "features": features,               # raw inputs — necessary for retrospective drift analysis
        "fraud_probability": fraud_probability,
        # ground_truth_label is NOT available at inference time; it arrives later
        # (e.g., when a chargeback is filed).  The warehouse join uses request_id.
    }
    with LOG_PATH.open("a") as fh:
        fh.write(json.dumps(record) + "n")  # append one JSON line per call

# Example call from inside the FastAPI route handler:
log_prediction(
    request_id="req-abc-123",
    features={"amount": 250.0, "hour_of_day": 2, "merchant_category": 5, "num_prev_txns_24h": 8},
    fraud_probability=0.87,
    model_version="pipeline_v20240601",
)
`}
      />

      <CodeBlock
        filename="validate_batch.py"
        caption="Assert schema and value ranges on an incoming feature batch before scoring — catch data quality issues early."
        code={`import numpy as np
import pandas as pd

# Data validation at inference time is the last line of defence against
# training-serving skew and upstream data pipeline failures.
# Run these checks before the features reach the model.
# A failed assert raises immediately with a clear message — far better than
# a silent NaN propagating through matrix multiplication and producing a
# garbage probability score that no alert will catch.

EXPECTED_COLUMNS = ["amount", "hour_of_day", "merchant_category", "num_prev_txns_24h"]

def validate_feature_batch(df: pd.DataFrame) -> None:
    # 1. Schema: all required columns must be present.
    missing = set(EXPECTED_COLUMNS) - set(df.columns)
    assert not missing, f"Missing columns: {missing}"

    # 2. No nulls in any feature column — the model was not trained on NaNs.
    null_counts = df[EXPECTED_COLUMNS].isnull().sum()
    assert null_counts.sum() == 0, f"Null values detected:n{null_counts[null_counts > 0]}"

    # 3. Value ranges — violations indicate an upstream pipeline change or bug.
    assert df["amount"].gt(0).all(), "amount must be positive"
    assert df["hour_of_day"].between(0, 23).all(), "hour_of_day must be 0-23"
    assert df["num_prev_txns_24h"].ge(0).all(), "num_prev_txns_24h must be non-negative"

    # 4. Soft check: warn if the mean amount is more than 3 standard deviations
    # from the training mean.  This catches distribution shifts that pass
    # the range check but are still anomalous.
    TRAINING_AMOUNT_MEAN = 245.0    # record this when training the pipeline
    TRAINING_AMOUNT_STD  = 310.0
    z_score = abs(df["amount"].mean() - TRAINING_AMOUNT_MEAN) / TRAINING_AMOUNT_STD
    if z_score > 3.0:
        print(f"WARNING: amount distribution shifted {z_score:.1f} std devs from training mean")

# Usage — call before every batch scoring job:
sample_batch = pd.DataFrame({
    "amount":              [120.0, 45.5, 2300.0],
    "hour_of_day":         [14, 2, 23],
    "merchant_category":   [3, 7, 1],
    "num_prev_txns_24h":   [2, 0, 15],
})
validate_feature_batch(sample_batch)
print("Batch passed validation — safe to score")
`}
      />

      <ExplanationBox title="Responsible Deployment and Course Wrap-Up">
        <p>
          Responsible deployment is not a set of restrictions — it&apos;s a set of practices that make
          models trustworthy enough to rely on. The same disciplines that make a model safe to
          deploy (documented behavior, monitored performance, rollback capability, access control)
          also make it easier to maintain, debug, and improve.
        </p>
        <p>
          Looking back at the full roadmap: you now have a complete picture of what it takes to
          move from a promising notebook experiment to a production ML system. The journey covers
          understanding your domain (which task, which data, which model class), building reliable
          pipelines (data ingestion, feature stores, training automation, experiment tracking),
          deploying thoughtfully (serving patterns, latency-throughput tradeoffs, distributed
          training), operating in production (monitoring, drift detection, A/B testing, CI/CD),
          and doing so responsibly (governance, security, privacy, compliance).
        </p>
        <p>
          None of these areas is optional in a serious production system. The teams that build
          reliable ML products are not those who found the best model architecture — they are the
          ones who built the best surrounding systems. That&apos;s applied ML.
        </p>
      </ExplanationBox>
    </div>
  );
}
