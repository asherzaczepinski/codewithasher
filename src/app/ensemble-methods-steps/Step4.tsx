'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step4() {
  return (
    <div>
      <ExplanationBox title="The Core Idea of Boosting">
        <p>
          Where bagging trains models <em>in parallel</em> on random subsets and averages them,
          boosting trains models <em>sequentially</em>. Each new model looks at what the
          previous model got wrong and focuses its effort there.
        </p>
        <p>
          Think of it like a study group. After a practice exam, the group reviews only the
          questions they missed. The next study session is targeted at exactly those weaknesses.
          Repeating this process, the group converges on mastery — not by being brilliant
          individually, but by consistently correcting mistakes.
        </p>
        <p>
          Boosting primarily reduces <strong>bias</strong>. Each round corrects systematic
          errors the ensemble is making. A shallow decision tree (a &quot;stump&quot; with depth 1 or 2)
          has high bias on its own — boosting turns a hundred stumps into a powerful model.
        </p>
      </ExplanationBox>

      <ExplanationBox title="AdaBoost: Reweighting Mistakes">
        <p>
          AdaBoost (Adaptive Boosting, 1997) is the original boosting algorithm. It works by
          maintaining a <strong>weight</strong> on every training example. Initially all weights
          are equal: w&#7522; = 1/N for all i. After each round:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>Correctly classified examples have their weights <strong>decreased</strong>.</li>
          <li>Misclassified examples have their weights <strong>increased</strong>.</li>
        </ul>
        <p>
          The next weak learner trains on this reweighted distribution, so it automatically
          focuses on the hard examples. The final prediction is a weighted majority vote of
          all weak learners, where better learners (lower error) get a larger vote.
        </p>
      </ExplanationBox>

      <MathFormula label="AdaBoost: Learner Weight (alpha)">
        alpha&#8346; = 0.5 &times; ln((1 - err&#8346;) / err&#8346;)
      </MathFormula>

      <MathFormula label="AdaBoost: Sample Weight Update for Misclassified Example i">
        w&#7522; &#8592; w&#7522; &times; exp(alpha&#8346;) &nbsp;&nbsp; then renormalise so all weights sum to 1
      </MathFormula>

      <WorkedExample title="AdaBoost Weight Update — Loan Default Example">
        <p>
          We have 6 training examples. Round 1 trains a depth-1 stump and misclassifies
          examples 3 and 5 (both defaults that the stump called repay). Initial weight per
          example = 1/6 &asymp; 0.167.
        </p>
        <CalcStep number={1}>
          Round 1 error: 2 misclassified out of 6. Weighted error = (0.167 + 0.167) = 0.333.
        </CalcStep>
        <CalcStep number={2}>
          alpha&#8321; = 0.5 &times; ln((1 - 0.333) / 0.333) = 0.5 &times; ln(2.00) = 0.5 &times; 0.693 = <strong>0.347</strong>.
        </CalcStep>
        <CalcStep number={3}>
          Correctly classified examples (4 of them): new weight = 0.167 &times; exp(-0.347) = 0.167 &times; 0.707 = 0.118.
        </CalcStep>
        <CalcStep number={4}>
          Misclassified examples (2 of them): new weight = 0.167 &times; exp(+0.347) = 0.167 &times; 1.415 = 0.236.
        </CalcStep>
        <CalcStep number={5}>
          Sum of all new weights = 4 &times; 0.118 + 2 &times; 0.236 = 0.472 + 0.472 = 0.944.
        </CalcStep>
        <CalcStep number={6}>
          Renormalise: divide each weight by 0.944. Correct examples: 0.118/0.944 = <strong>0.125</strong>. Misclassified: 0.236/0.944 = <strong>0.250</strong>.
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          Round 2 now sees examples 3 and 5 with weight 0.250 each — double the weight of
          the correctly classified examples. The next stump is trained on this reweighted
          data and will prioritise getting those two loan applications right.
        </p>
      </WorkedExample>

      <ExplanationBox title="Bagging vs Boosting: Side by Side">
        <p>
          <strong>Bagging</strong> — parallel, independent models; reduces variance; base learners
          should be complex (deep trees); robust to hyperparameter tuning; hard to overfit with more trees.
        </p>
        <p>
          <strong>Boosting</strong> — sequential, dependent models; reduces bias; base learners are
          deliberately simple (shallow stumps or small trees); sensitive to hyperparameters (learning rate,
          depth); can overfit if too many rounds. Regularisation (early stopping, shrinkage) is essential.
        </p>
        <p>
          In practice: start with a Random Forest to get a strong, reliable baseline quickly. Then
          try gradient boosting (XGBoost, LightGBM) for a further accuracy gain when you have time to tune.
        </p>
      </ExplanationBox>

    </div>
  );
}
