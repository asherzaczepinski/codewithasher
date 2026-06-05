'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import CodeBlock from '@/components/CodeBlock';

export default function Step7() {
  return (
    <div>
      <ExplanationBox title="Maximum Likelihood Estimation: Training Has a Probabilistic Meaning">
        <p>
          When we minimize a loss function during training, we are doing something deeper than
          just &quot;making predictions close to labels.&quot; We are performing
          <strong> Maximum Likelihood Estimation (MLE)</strong>: finding the parameters
          &theta; that make the observed training data as probable as possible under the
          model&apos;s distribution.
        </p>
        <p>
          Formally, given a dataset of n independent examples, the likelihood is the product of
          individual example probabilities. Because products of small numbers become numerically
          unstable, we maximize the <em>log-likelihood</em> instead.
        </p>
      </ExplanationBox>

      <MathFormula label="Maximum Likelihood Estimation">
        &theta;_MLE = argmax&theta; &Sigma;_i log P(y_i | x_i; &theta;)
      </MathFormula>

      <ExplanationBox title="MLE and Common Loss Functions">
        <p>
          The connection to standard losses is exact, not approximate:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Minimizing MSE</strong> &equiv; MLE under a Gaussian noise model. If you
            assume each label is the true value plus Gaussian noise, maximizing the likelihood
            is identical to minimizing the average squared error.
          </li>
          <li>
            <strong>Minimizing cross-entropy</strong> &equiv; MLE under a categorical (Bernoulli
            for binary) distribution. Every time you train a classifier with cross-entropy loss,
            you are doing MLE.
          </li>
        </ul>
        <p>
          This framing is useful: it tells you that your choice of loss function encodes an
          assumption about the noise distribution of your data.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Maximum a Posteriori: Add a Prior, Get Regularization">
        <p>
          MLE has no preference about the size of &theta; &mdash; it will happily produce huge
          weights if they fit the training data better. <strong>Maximum a Posteriori (MAP)</strong>
          estimation adds a <em>prior distribution</em> over &theta; that encodes our belief
          about what reasonable parameters look like before seeing any data.
        </p>
        <p>
          By Bayes&apos; theorem, the posterior is proportional to likelihood times prior.
          MAP maximizes the log-posterior, which is the log-likelihood plus the log-prior.
        </p>
      </ExplanationBox>

      <MathFormula label="MAP estimation">
        &theta;_MAP = argmax&theta; [&Sigma;_i log P(y_i | x_i; &theta;) + log P(&theta;)]
      </MathFormula>

      <ExplanationBox title="The Prior Is Regularization">
        <p>
          The connection between MAP and regularization is exact:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Gaussian prior on weights</strong> (P(&theta;) = N(0, 1/2&lambda;)) &mdash;
            the log-prior is &minus;&lambda;&times;&Sigma;w&sup2;. MAP with a Gaussian prior is
            identical to L2 regularization. The prior is saying &quot;I expect weights to be
            near zero.&quot;
          </li>
          <li>
            <strong>Laplace prior on weights</strong> (P(&theta;) = Laplace(0, 1/&lambda;)) &mdash;
            the log-prior is &minus;&lambda;&times;&Sigma;|w|. MAP with a Laplace prior is
            identical to L1 regularization. The Laplace distribution has heavier tails and a
            sharp peak at zero, which is why it induces sparsity.
          </li>
        </ul>
        <p>
          Regularization is not just an engineering trick to prevent overfitting. It is a
          precise probabilistic statement about what kinds of models you believe are plausible
          before seeing the data.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Hyperparameter Search: Finding &lambda;, &alpha;, and More">
        <p>
          Training has many hyperparameters &mdash; learning rate, regularization strength,
          batch size, architecture choices &mdash; that are not learned by gradient descent.
          They must be chosen by searching over candidate values and evaluating on a held-out
          validation set.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Grid Search">
        <p>
          <strong>Grid search</strong> defines a finite grid of candidate values for each
          hyperparameter and evaluates every combination. For two hyperparameters each with
          5 candidate values, that is 5&times;5 = 25 training runs. Grid search is
          exhaustive within the grid and easy to parallelize, but it scales exponentially:
          10 hyperparameters each with 5 values would require 5^10 &asymp; 10 million runs.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Random Search">
        <p>
          <strong>Random search</strong> (Bergstra &amp; Bengio, 2012) samples hyperparameter
          combinations randomly from specified ranges. Surprisingly, random search usually
          outperforms grid search with the same budget because of a key insight: in practice,
          only a few hyperparameters matter a lot and the rest barely affect the result. A
          random search that samples many values along the important dimensions will find good
          configurations that grid search &mdash; which wastes most of its budget on
          unimportant dimensions &mdash; misses entirely.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Bayesian Optimization">
        <p>
          <strong>Bayesian optimization</strong> builds a probabilistic model (typically a
          Gaussian process) of the objective function &mdash; validation loss as a function of
          hyperparameters &mdash; and uses it to select the most promising next configuration
          to evaluate. The key idea is the <strong>acquisition function</strong>: it balances
          <em>exploitation</em> (try configurations the model predicts will be good) with
          <em>exploration</em> (try configurations the model is uncertain about). Each
          evaluation updates the model and sharpens the next guess.
        </p>
        <p>
          Bayesian optimization is dramatically more sample-efficient than grid or random
          search when each evaluation is expensive (e.g., training a large model takes hours).
          Tools like Optuna, Hyperopt, and Weights &amp; Biases Sweeps implement it. It is
          the method of choice when compute is limited and hyperparameters matter.
        </p>
      </ExplanationBox>

      <ExplanationBox title="In Python">
        <p>
          A hand-rolled grid search loop (so you can see exactly what is happening), followed
          by the equivalent sklearn one-liner. Both evaluate every combination of learning
          rate and regularization strength on a held-out validation set.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="hyperparameter_search.py"
        caption="Grid search is a nested loop over every hyperparameter combination — sklearn wraps this into GridSearchCV, and RandomizedSearchCV samples the same space randomly for a faster budget."
        code={`import numpy as np
from itertools import product

# ── Toy validation function ────────────────────────────────────────────────────
# In a real project this would train a model for N epochs and return val loss.
# Here we use a closed-form surface so the example runs instantly.
def train_and_validate(lr, lam, seed=42):
    rng = np.random.default_rng(seed)
    # Pretend val loss is minimized near lr=0.01, lam=0.001.
    # Add a little noise so the surface is not perfectly smooth.
    noise = rng.normal(0, 0.02)
    val_loss = (np.log10(lr) + 2.0) ** 2 + (np.log10(lam) + 3.0) ** 2 + noise
    return val_loss


# ── Hand-rolled grid search ────────────────────────────────────────────────────
# Define candidate values for each hyperparameter on a log scale.
# Using a log scale for lr and lam is almost always better than a linear grid
# because these values span multiple orders of magnitude.
lr_candidates  = [1e-4, 1e-3, 1e-2, 1e-1]   # 4 learning rate candidates
lam_candidates = [1e-5, 1e-4, 1e-3, 1e-2]   # 4 lambda candidates
# Total evaluations: 4 x 4 = 16 training runs

best_loss   = float("inf")
best_config = None

# product() generates every (lr, lam) pair -- this IS the grid.
for lr, lam in product(lr_candidates, lam_candidates):

    val_loss = train_and_validate(lr, lam)  # one full train+eval run

    print(f"lr={lr:.0e}  lam={lam:.0e}  ->  val_loss={val_loss:.4f}")

    # Track the best configuration seen so far.
    if val_loss < best_loss:
        best_loss   = val_loss
        best_config = (lr, lam)

print(f"Best: lr={best_config[0]:.0e}  lam={best_config[1]:.0e}  loss={best_loss:.4f}")


# ── Equivalent with sklearn GridSearchCV ───────────────────────────────────────
# GridSearchCV wraps the above loop automatically and adds cross-validation.
# It also parallelizes across cores with n_jobs=-1.
#
# from sklearn.model_selection import GridSearchCV, RandomizedSearchCV
# from sklearn.linear_model import Ridge
#
# param_grid = {
#     "alpha": [1e-4, 1e-3, 1e-2, 1e-1],  # lambda in our notation
# }
# grid_search = GridSearchCV(Ridge(), param_grid, cv=5, scoring="neg_mean_squared_error")
# grid_search.fit(X_train, y_train)
# print("Best params:", grid_search.best_params_)
#
# ── RandomizedSearchCV: same idea, random sampling ────────────────────────────
# When the grid is huge, random sampling finds good configs faster because
# (Bergstra & Bengio 2012) most hyperparameters barely affect the result --
# sampling randomly covers the important axes better than a rigid grid.
#
# from scipy.stats import loguniform
# param_dist = {"alpha": loguniform(1e-5, 1e-1)}
# rand_search = RandomizedSearchCV(Ridge(), param_dist, n_iter=20, cv=5)
# rand_search.fit(X_train, y_train)
# print("Best params:", rand_search.best_params_)`}
      />
    </div>
  );
}
