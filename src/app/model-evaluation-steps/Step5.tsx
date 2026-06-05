'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step5() {
  return (
    <div>
      <ExplanationBox title="The Threshold Problem">
        <p>
          Our disease classifier outputs a probability — say 0.73. To make a hard prediction
          (disease / no disease), we apply a <strong>threshold</strong>: usually 0.5, but that is
          just a default. Raising the threshold makes the model more conservative (higher precision,
          lower recall). Lowering it makes the model more aggressive (higher recall, lower precision).
        </p>
        <p>
          Every threshold choice gives a different confusion matrix and therefore different
          precision, recall, and F1 scores. The <strong>ROC curve</strong> visualises all of
          those threshold choices at once.
        </p>
      </ExplanationBox>

      <ExplanationBox title="TPR and FPR — The Two Axes">
        <p>
          The ROC curve plots two rates as the threshold slides from 1.0 down to 0.0:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li><strong>True Positive Rate (TPR) = Recall:</strong> TP / (TP + FN). How many real positives does the model catch? We want this high. Plotted on the y-axis.</li>
          <li><strong>False Positive Rate (FPR):</strong> FP / (FP + TN). How many real negatives does the model wrongly flag? We want this low. Plotted on the x-axis.</li>
        </ul>
        <p>
          At threshold = 1.0, the model predicts nothing as positive: TPR = 0, FPR = 0 (bottom-left
          corner). At threshold = 0.0, the model predicts everything as positive: TPR = 1, FPR = 1
          (top-right corner). The curve traces the path between those two corners as the threshold drops.
        </p>
      </ExplanationBox>

      <MathFormula label="True Positive Rate (TPR / Recall)">
        TPR = TP / (TP + FN)
      </MathFormula>

      <MathFormula label="False Positive Rate (FPR)">
        FPR = FP / (FP + TN)
      </MathFormula>

      <ExplanationBox title="What a Good ROC Curve Looks Like">
        <p>
          A perfect model&apos;s ROC curve shoots straight up to (FPR=0, TPR=1) — catching all positives
          before flagging a single negative. A random model produces a diagonal line from
          (0,0) to (1,1) — it randomly mixes positives and negatives.
        </p>
        <p>
          A real model&apos;s curve bows upward toward the top-left corner. The more it bows, the
          better the model. The <strong>Area Under the Curve (AUC)</strong> — also written
          AUROC — quantifies this bow as a single number between 0 and 1.
        </p>
      </ExplanationBox>

      <ExplanationBox title="AUC: A Probability With Meaning">
        <p>
          AUC has a clean probabilistic interpretation: if you pick one random positive example
          and one random negative example, AUC is the probability that the model assigns a
          higher score to the positive than to the negative.
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li><strong>AUC = 1.0:</strong> perfect ranking — every positive scores above every negative.</li>
          <li><strong>AUC = 0.5:</strong> random — model is no better than chance at ranking positives above negatives.</li>
          <li><strong>AUC = 0.7:</strong> a random positive outranks a random negative 70% of the time.</li>
        </ul>
        <p>
          AUC is <strong>threshold-independent</strong>. It tells you how good the model&apos;s
          underlying ranking is, independent of whatever decision threshold you eventually pick.
          This makes it ideal for comparing two models before committing to a deployment threshold.
        </p>
      </ExplanationBox>

      <WorkedExample title="Tracing the ROC Curve Step by Step">
        <p>
          We have 5 patients. Their true labels and predicted probabilities (sorted by descending
          probability) are:
        </p>
        <p style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: '12px', borderRadius: '6px', margin: '0.75rem 0' }}>
          Rank 1: prob = 0.95, true = 1 (positive)<br />
          Rank 2: prob = 0.80, true = 0 (negative)<br />
          Rank 3: prob = 0.70, true = 1 (positive)<br />
          Rank 4: prob = 0.45, true = 0 (negative)<br />
          Rank 5: prob = 0.30, true = 1 (positive)
        </p>
        <p>There are 3 positives and 2 negatives. Steps below lower the threshold one rank at a time.</p>

        <CalcStep number={1}>Threshold just above 0.95: predict nothing positive. TPR = 0/3 = 0, FPR = 0/2 = 0. Point: (0, 0).</CalcStep>
        <CalcStep number={2}>Threshold = 0.95: include rank 1 (true positive). TPR = 1/3 ≈ 0.33, FPR = 0/2 = 0. Point: (0, 0.33). Curve moves up.</CalcStep>
        <CalcStep number={3}>Threshold = 0.80: include rank 2 (false positive). TPR = 1/3 ≈ 0.33, FPR = 1/2 = 0.50. Point: (0.50, 0.33). Curve moves right.</CalcStep>
        <CalcStep number={4}>Threshold = 0.70: include rank 3 (true positive). TPR = 2/3 ≈ 0.67, FPR = 1/2 = 0.50. Point: (0.50, 0.67). Curve moves up.</CalcStep>
        <CalcStep number={5}>Threshold = 0.45: include rank 4 (false positive). TPR = 2/3 ≈ 0.67, FPR = 2/2 = 1.0. Point: (1.0, 0.67). Curve moves right.</CalcStep>
        <CalcStep number={6}>Threshold = 0.30: include rank 5 (true positive). TPR = 3/3 = 1.0, FPR = 1.0. Point: (1.0, 1.0). Top-right corner.</CalcStep>

        <p style={{ marginTop: '1rem' }}>
          The AUC for this small curve is the area of the rectangles traced above the diagonal.
          For these 5 points, AUC ≈ 0.83 — the model ranks a random positive above a random
          negative 83% of the time. Not bad for 5 examples, and you can see exactly where the
          false positive (rank 2) hurt the model.
        </p>
      </WorkedExample>

      <ExplanationBox title="Threshold Selection in Practice">
        <p>
          AUC tells you which model is better; the ROC curve tells you where to cut. To choose
          a threshold for deployment, look at the ROC curve and ask what trade-off your application
          requires:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li><strong>Disease screening:</strong> prioritise recall (catch every sick patient). Choose a threshold that keeps TPR above 0.90, accepting a higher FPR.</li>
          <li><strong>Fraud prevention:</strong> balance FPR (don&apos;t block too many legitimate transactions) against TPR (catch real fraud).</li>
          <li><strong>Spam detection:</strong> prioritise precision (never put good mail in spam). Choose a threshold that keeps FPR near zero.</li>
        </ul>
        <p>
          The ROC curve puts all of these trade-offs in one picture so you can make an informed,
          explicit choice rather than accepting the 0.5 default blindly.
        </p>
      </ExplanationBox>
    </div>
  );
}
