'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step1() {
  return (
    <div>
      <ExplanationBox title="What Machine Learning Actually Is">
        <p>
          Most software is built on rules. A developer sits down and writes: <em>if the email
          contains the word &quot;lottery,&quot; move it to spam.</em> That works fine — until
          spammers write &quot;l0ttery&quot; instead, or use an image, or invent a new trick you
          haven&apos;t seen yet. Every new trick requires a new rule. You&apos;re always playing
          catch-up.
        </p>
        <p>
          Machine learning flips this around. Instead of writing the rules yourself, you show the
          computer thousands of examples — emails that are spam, emails that are not — and let it
          figure out the rules on its own. The computer finds patterns in the data that you might
          never have thought to look for. It learns.
        </p>
        <p>
          More precisely: <strong>machine learning is the practice of building programs that improve
          their performance on a task by learning from data, rather than by following explicitly
          hand-coded logic.</strong>
        </p>
      </ExplanationBox>

      <ExplanationBox title="A Concrete Mental Model">
        <p>
          Think of teaching a child to recognize dogs. You don&apos;t hand them a rulebook that
          says &quot;four legs, fur, barks.&quot; You show them a hundred dogs and a hundred
          non-dogs, and they develop an internal sense for what a dog looks like. They can then
          correctly identify a breed they&apos;ve never seen before.
        </p>
        <p>
          An ML model does the same thing — but the &quot;internal sense&quot; it builds is a
          mathematical function: a set of numbers (called parameters or weights) tuned by exposure
          to examples until the function maps inputs to correct outputs.
        </p>
        <p>
          The process of finding those numbers is called <strong>training</strong>. The examples
          used to train are called <strong>training data</strong>. Everything else in this course
          is about doing this rigorously so the model actually generalizes to new, unseen inputs.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Our Running Example">
        <p>
          Throughout this course you will follow a beginner — let&apos;s call them Alex — building
          their very first ML project. Alex has two goals:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Predict house prices</strong> — given square footage, number of bedrooms,
            neighborhood, and age, estimate the sale price of a home.
          </li>
          <li>
            <strong>Classify emails</strong> — given the text of an email, decide whether it is
            spam or not spam.
          </li>
        </ul>
        <p>
          These two tasks are deliberately different. Predicting a price produces a number on a
          continuous scale ($247,000, $310,500, ...). Classifying an email produces a category
          (spam or not spam). That difference turns out to matter a great deal — and we will
          return to it again and again.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Course Roadmap">
        <p>Here is what you will build up, module by module:</p>
        <ul style={{ lineHeight: '1.9' }}>
          <li><strong>Types of ML</strong> — the four main learning paradigms and where each fits.</li>
          <li><strong>Framing the Problem</strong> — turning a real-world goal into a precise ML task.</li>
          <li><strong>Data &amp; Features</strong> — how data is structured; what features and labels are.</li>
          <li><strong>Data Splits</strong> — why we hold data back, and the danger of data leakage.</li>
          <li><strong>EDA</strong> — looking at the data before modeling so surprises don&apos;t bite you later.</li>
          <li><strong>Preprocessing</strong> — scaling, encoding, and cleaning so the model can learn cleanly.</li>
          <li><strong>Tools &amp; Reproducibility</strong> — the Python stack Alex uses and why each piece exists.</li>
        </ul>
        <p>
          By the end you will have the mental model and vocabulary to understand any introductory
          ML tutorial, paper, or codebase — and to build your own first model with confidence.
        </p>
      </ExplanationBox>
    </div>
  );
}
