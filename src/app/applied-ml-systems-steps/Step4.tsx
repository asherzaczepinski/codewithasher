'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step4() {
  return (
    <div>
      <ExplanationBox title="High-Stakes Domains: When Failure Is Not an Option">
        <p>
          Most ML applications have a forgiving failure mode: a bad movie recommendation means the
          user picks something else. But several industry domains change the stakes entirely — a
          wrong prediction can mean a misdiagnosis, a collision, a financial loss of millions, or
          a regulatory fine. Understanding the specific constraints of each domain is the first step
          to building responsibly.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Medical & Clinical ML">
        <p>
          <strong>Typical tasks:</strong> radiology image interpretation (detecting tumors, fractures),
          clinical risk scoring (predicting ICU deterioration, readmission), drug discovery, and
          genomic analysis.
        </p>
        <p>
          <strong>Key constraints:</strong> regulatory approval (FDA 510(k) in the US, CE marking
          in the EU for software as a medical device), prospective clinical validation on diverse
          patient populations, and interpretability — a clinician must be able to understand why
          the model flagged something before acting on it. Training data is small by ML standards
          (thousands of labeled scans vs. millions of ImageNet images), expensive to label
          (requires expert radiologists), and subject to strict privacy rules (HIPAA in the US,
          GDPR in the EU). Distribution shift is severe: a model trained on scans from one hospital&apos;s
          scanner often degrades significantly on another brand of scanner.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Robotics & Autonomous Systems">
        <p>
          <strong>Typical tasks:</strong> grasping and manipulation, navigation in unstructured
          environments, visual servoing, and multi-agent coordination.
        </p>
        <p>
          <strong>Key constraints:</strong> real-time control loops (often 100 Hz or faster),
          safety-critical failure modes (a robot arm that miscalculates force can injure a worker),
          and the sim-to-real gap — models trained in simulation fail in the physical world due to
          differences in friction, lighting, and sensor noise. Reinforcement learning is common here
          but requires careful reward shaping and safety constraints during exploration. Hardware-in-the-loop
          testing is mandatory before deployment.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Autonomous Vehicles">
        <p>
          <strong>Typical tasks:</strong> 3-D object detection, lane detection, motion prediction
          for other road agents, and trajectory planning.
        </p>
        <p>
          <strong>Key constraints:</strong> functional safety standards (ISO 26262), real-time
          latency requirements (perception must run end-to-end in under 50 ms), sensor fusion
          across cameras, LiDAR, and radar, and the long tail of rare but critical scenarios
          (a child running between parked cars at night). Edge cases that occur once per billion
          miles still happen daily across a large fleet. The ML system is embedded in a full
          autonomy stack alongside rule-based planning and control layers.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Scientific ML">
        <p>
          <strong>Typical tasks:</strong> protein structure prediction (AlphaFold), climate
          modelling, materials discovery, drug-target interaction prediction, and particle physics
          event classification.
        </p>
        <p>
          <strong>Key constraints:</strong> training data is often small but highly structured
          (governed by physical laws). Physics-informed neural networks (PINNs) incorporate
          governing equations directly into the loss function to reduce data requirements.
          Uncertainty quantification is critical — a material property predicted with 95%
          confidence means something very different from 60% confidence when planning an
          expensive synthesis experiment.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Finance ML">
        <p>
          <strong>Typical tasks:</strong> algorithmic trading, credit scoring, loan default
          prediction, anti-money-laundering (AML), and customer churn prediction.
        </p>
        <p>
          <strong>Key constraints:</strong> regulatory explainability requirements (in the US,
          adverse action notices must explain credit decisions in plain English), look-ahead bias
          (inadvertently training on future information that would not have been available at
          decision time), and non-stationarity — market regimes shift rapidly, and a model trained
          during a bull market may be useless in a downturn. Backtesting discipline (strict
          train/test time cuts, accounting for transaction costs and slippage) separates serious
          practitioners from those who overfit to history.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Industrial & Edge ML">
        <p>
          <strong>Industrial ML</strong> covers predictive maintenance (detecting machine failure
          before it happens), quality control vision systems (defect detection on a production line),
          and process optimization. The key challenge is that labeled failure data is rare — machines
          that fail are expensive, so you have very few examples of the failure mode you&apos;re trying
          to predict. Anomaly detection (learning the normal distribution, flagging deviations) is
          more practical than supervised classification in many cases.
        </p>
        <p>
          <strong>Edge and on-device ML</strong> runs inference directly on a device — a smartphone,
          a microcontroller, a security camera — rather than sending data to a cloud server. The
          constraints are tight: a Cortex-M microcontroller may have 256 KB of RAM and no floating-point
          unit. Techniques include quantization (reducing weights from 32-bit floats to 8-bit integers,
          which cuts memory by 4x and speeds up inference), pruning (zeroing out low-magnitude
          weights), and knowledge distillation (training a small student model to mimic a large
          teacher model). Latency is measured in milliseconds; battery draw matters; and there is
          no network round-trip.
        </p>
      </ExplanationBox>
    </div>
  );
}
