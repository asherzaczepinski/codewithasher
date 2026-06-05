'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step3() {
  return (
    <div>
      <ExplanationBox title="The Goal: Score Each Class">
        <p>
          We want to answer the question: given the words in this email, which class — spam or ham —
          is more probable? In other words, we want to compute
          <strong> P(class | words)</strong> for each class and pick the highest one.
        </p>
        <p>
          But computing P(class | words) directly is awkward — it requires knowing the probability
          of every possible combination of words. Bayes&apos; theorem lets us flip the problem around
          and work with quantities we can easily estimate from training data.
        </p>
      </ExplanationBox>

      <MathFormula label="Bayes' Theorem">
        P(class | words) = P(words | class) · P(class) / P(words)
      </MathFormula>

      <ExplanationBox title="Naming the Parts">
        <p>
          Each term has a name that captures its role:
        </p>
        <ul style={{ lineHeight: '2' }}>
          <li>
            <strong>Prior — P(class):</strong> how common is this class before we look at any words?
            If 40 % of all emails are spam, then P(spam) = 0.40. This is our starting belief.
          </li>
          <li>
            <strong>Likelihood — P(words | class):</strong> how probable are these particular words
            if the email really does belong to this class? This is what the training data teaches us.
          </li>
          <li>
            <strong>Posterior — P(class | words):</strong> the updated belief after seeing the words.
            This is what we want.
          </li>
          <li>
            <strong>Evidence — P(words):</strong> how probable are these words overall, across all
            classes? This is a normalising constant — the same for every class we compare.
          </li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="Dropping the Denominator">
        <p>
          Since P(words) is identical for every class, it does not affect which class scores highest.
          When we are only comparing classes — not computing exact probabilities — we can drop the
          denominator entirely and work with the <strong>unnormalised posterior</strong>:
        </p>
      </ExplanationBox>

      <MathFormula label="Decision Rule (proportional form)">
        P(class | words) ∝ P(words | class) · P(class)
      </MathFormula>

      <ExplanationBox title="Classification in One Sentence">
        <p>
          For each candidate class, multiply the <strong>likelihood</strong> of the observed words by
          the <strong>prior</strong> probability of that class. The class with the
          <strong> highest product wins</strong>. That is the entire Naive Bayes decision rule.
        </p>
        <p>
          The denominator P(words) is only needed if you want a calibrated probability out of 1.
          For a binary spam/ham decision it is unnecessary — we just compare the two products.
        </p>
      </ExplanationBox>

      <WorkedExample title="Bayes' Theorem Applied to One Word">
        <p>
          One email contains only the word &quot;free.&quot; Using our 100-email dataset (40 spam, 60 ham):
        </p>
        <CalcStep number={1}>Prior: P(spam) = 40/100 = 0.40, P(ham) = 60/100 = 0.60</CalcStep>
        <CalcStep number={2}>Likelihood from training data: P(&quot;free&quot; | spam) = 32/40 = 0.80</CalcStep>
        <CalcStep number={3}>Likelihood from training data: P(&quot;free&quot; | ham) = 4/60 ≈ 0.067</CalcStep>
        <CalcStep number={4}>Spam score ∝ 0.80 × 0.40 = 0.320</CalcStep>
        <CalcStep number={5}>Ham score ∝ 0.067 × 0.60 ≈ 0.040</CalcStep>
        <CalcStep number={6}>0.320 &gt; 0.040 → classify as SPAM</CalcStep>
        <p style={{ marginTop: '1rem' }}>
          The spam score is eight times larger than the ham score, so the classifier confidently
          marks this email as spam — matching intuition. Next we will handle emails with
          <em> multiple</em> words, which requires one further simplification.
        </p>
      </WorkedExample>

      <ExplanationBox title="In Python">
        <p>
          Here is what the dataset and prior calculation look like as code.
          Each email is stored as a list of words and a label — exactly the data
          structure we will build on throughout the course.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="naive_bayes.py"
        caption="A tiny labelled dataset and the prior probabilities computed from it."
        code={`# Each email is represented as (list_of_words, label).
# Label is "spam" or "ham". This is our entire training set.
dataset = [
    (["free", "winner", "claim", "prize"], "spam"),
    (["free", "offer", "limited", "time"], "spam"),
    (["free", "cash", "click", "now"],     "spam"),
    (["meeting", "agenda", "project"],     "ham"),
    (["lunch", "tomorrow", "meeting"],     "ham"),
    (["report", "due", "friday"],          "ham"),
    (["agenda", "call", "schedule"],       "ham"),
]

# Count how many emails belong to each class.
# We iterate once through the dataset and tally labels.
spam_count = sum(1 for _, label in dataset if label == "spam")
ham_count  = sum(1 for _, label in dataset if label == "ham")
total      = len(dataset)  # total number of training emails

# P(spam) and P(ham) are the CLASS PRIORS.
# They capture our baseline belief before we look at any words.
# If 3 out of 7 emails are spam, our prior for spam is 3/7 ≈ 0.43.
p_spam = spam_count / total  # prior probability of spam
p_ham  = ham_count  / total  # prior probability of ham

print(f"Total emails : {total}")
print(f"Spam emails  : {spam_count}  -> P(spam) = {p_spam:.3f}")
print(f"Ham emails   : {ham_count}   -> P(ham)  = {p_ham:.3f}")
# Notice the two priors sum to 1.0 — one email must be in one class.`}
      />
    </div>
  );
}
