'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step1() {
  return (
    <div>
      <ExplanationBox title="The Gap Between a Notebook and a Product">
        <p>
          Every ML project starts the same way: a Jupyter notebook, some data, and a model that
          achieves a promising accuracy on the test set. Then someone says &quot;ship it,&quot; and
          the real work begins.
        </p>
        <p>
          The notebook runs once, on your machine, with your data, in your Python environment. A
          production service runs continuously, on someone else&apos;s hardware, with new data arriving
          every second, serving thousands of concurrent users. These are entirely different engineering
          problems. The model itself is often the smallest part of the work.
        </p>
        <p>
          Research from Google estimates that for every line of model code in a mature ML system,
          there are roughly 100 lines of surrounding infrastructure: data ingestion, feature
          computation, monitoring, serving, retraining triggers, and rollback logic. This course is
          about that infrastructure.
        </p>
      </ExplanationBox>

      <ExplanationBox title="What &quot;Applied ML&quot; Means">
        <p>
          Applied ML is the discipline of making machine learning models actually useful in the real
          world. It covers three concerns that academic ML largely ignores:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Domain fit</strong> — understanding which ML techniques suit which problem
            types: computer vision, NLP, time-series forecasting, ranking, fraud detection, and more.
          </li>
          <li>
            <strong>Systems thinking</strong> — designing the data pipelines, serving infrastructure,
            and feedback loops that keep a model working over time, not just at launch.
          </li>
          <li>
            <strong>Operational discipline</strong> — monitoring model health, detecting when
            predictions degrade, running controlled experiments, and rolling back safely when
            something breaks.
          </li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="What MLOps Means">
        <p>
          MLOps (Machine Learning Operations) borrows the mindset of DevOps — automation,
          reproducibility, and continuous delivery — and applies it to ML systems. In practice,
          MLOps means:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Reproducible training</strong> — given the same code, data, and configuration,
            you always get the same model. No more &quot;it worked on my machine.&quot;
          </li>
          <li>
            <strong>Automated pipelines</strong> — data preprocessing, training, evaluation, and
            deployment happen through versioned, testable code — not manual notebook runs.
          </li>
          <li>
            <strong>Continuous delivery</strong> — new model versions can be validated and
            promoted to production without human intervention for routine updates.
          </li>
          <li>
            <strong>Observability</strong> — you know what your model is predicting in production
            right now, and you get alerted when something drifts.
          </li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="The Running Example">
        <p>
          Throughout this course we follow one concrete journey: a team building a
          <strong> fraud detection service</strong> for an e-commerce platform. They start with a
          promising gradient-boosted model in a notebook and end with a reliable, monitored,
          compliant production API.
        </p>
        <p>
          Every concept — pipelines, deployment patterns, drift detection, A/B testing, governance —
          will be grounded in decisions that team actually faces. By the end you&apos;ll have a clear
          mental model of what it takes to run ML in production, regardless of the specific domain
          you work in.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Course Roadmap">
        <p>
          The course is organized into two parts after this introduction:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Part 1: ML Application Domains</strong> — a structured tour of the major ML
            problem types: vision, NLP, speech, time series, recommender systems, and a broad look
            at high-stakes industry applications. You need to know which tool fits which problem
            before you can build anything.
          </li>
          <li>
            <strong>Part 2: ML Systems and MLOps</strong> — the engineering that turns a model into
            a service. Data pipelines, training pipelines, experiment tracking, deployment patterns,
            inference optimization, production monitoring, drift detection, A/B testing, CI/CD,
            governance, security, and privacy. This is where &quot;applied&quot; really means something.
          </li>
        </ul>
      </ExplanationBox>
    </div>
  );
}
