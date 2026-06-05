'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step2() {
  return (
    <div>
      <ExplanationBox title="Not All Learning Is the Same">
        <p>
          When people say &quot;machine learning,&quot; they often picture one specific setup: a
          model trained on labeled examples. But that is just one of several distinct paradigms.
          Which one you use depends on what data you have, what you want the model to do, and how
          much human annotation you can afford.
        </p>
        <p>
          The four main paradigms are <strong>supervised</strong>, <strong>unsupervised</strong>,
          <strong>semi-supervised</strong>, and <strong>self-supervised</strong> learning. Each
          answers the question &quot;how does the model know what a good output looks like?&quot;
          differently.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Supervised Learning — Learning From Answers">
        <p>
          In supervised learning, every training example comes with a known correct answer —
          called a <strong>label</strong> or <strong>target</strong>. The model sees the input,
          makes a prediction, and is told how wrong it was. It adjusts. Repeat millions of times.
        </p>
        <p>
          This is Alex&apos;s situation for both projects:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>House prices:</strong> each row in the dataset is a past sale — the input is
            the house&apos;s features (size, bedrooms, etc.) and the label is the actual sale price.
            The model learns to map features to prices.
          </li>
          <li>
            <strong>Email classification:</strong> each email has already been marked &quot;spam&quot;
            or &quot;not spam&quot; by a human (or by user actions like clicking &quot;report
            spam&quot;). The model learns to map email text to those two categories.
          </li>
        </ul>
        <p>
          Supervised learning is the most widely used paradigm and powers the majority of deployed
          ML products today — fraud detection, medical diagnosis, recommendation systems,
          translation.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Unsupervised Learning — Finding Structure Without Answers">
        <p>
          Unsupervised learning gets data with <em>no labels at all</em>. There is no correct
          answer to compare against. Instead, the model tries to discover hidden structure in the
          data on its own.
        </p>
        <p>
          The most common unsupervised task is <strong>clustering</strong>: grouping similar
          examples together. Imagine Alex has a database of customers but no idea how to segment
          them. An unsupervised clustering algorithm might discover that customers naturally fall
          into groups — heavy buyers, occasional browsers, bargain hunters — without Alex defining
          those groups in advance.
        </p>
        <p>
          Other unsupervised tasks include <strong>dimensionality reduction</strong> (compressing
          many features into fewer while preserving structure) and <strong>anomaly
          detection</strong> (identifying examples that look different from the rest).
        </p>
      </ExplanationBox>

      <ExplanationBox title="Semi-Supervised Learning — A Little Label Goes a Long Way">
        <p>
          Getting labels is expensive. Annotating a million emails as spam or not spam requires
          enormous human effort. Semi-supervised learning attacks this head-on: use a <em>small</em>
          amount of labeled data alongside a <em>large</em> amount of unlabeled data.
        </p>
        <p>
          The intuition: even without labels, unlabeled data reveals the shape of the input space —
          where examples cluster, which regions are dense, which are rare. A model trained with a
          handful of labels can use that structural knowledge to generalize much further than it
          could from labels alone.
        </p>
        <p>
          This is practical in medicine (thousands of scans, only a few reviewed by specialists),
          speech recognition (hours of audio, little transcription), and many other domains.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Self-Supervised Learning — Creating Your Own Labels">
        <p>
          Self-supervised learning is a clever trick: generate labels automatically from the
          data itself, so you can train on massive unlabeled datasets at supervised-learning
          quality.
        </p>
        <p>
          The canonical example is language models. Given the sentence &quot;The cat sat on
          the&quot;, the model is trained to predict the next word: &quot;mat.&quot; The label
          (&quot;mat&quot;) came for free from the original text — no human annotation needed.
          This is how GPT-style models are pre-trained on hundreds of billions of words.
        </p>
        <p>
          In vision, a common trick is to hide a patch of an image and train the model to
          reconstruct it. Again: the label (the missing patch) is derived automatically from
          the data itself.
        </p>
        <p>
          Self-supervised learning has become one of the most important ideas in modern AI because
          it lets us exploit virtually unlimited raw data — the entire internet — without any
          annotation budget.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Quick Reference">
        <p>
          Here is how the four paradigms compare at a glance:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li><strong>Supervised</strong> — labeled examples; model learns input-to-output mapping. Example: predicting house prices.</li>
          <li><strong>Unsupervised</strong> — no labels; model finds patterns. Example: clustering customers.</li>
          <li><strong>Semi-supervised</strong> — few labels, lots of unlabeled data; combines both signals. Example: medical image classification with limited annotations.</li>
          <li><strong>Self-supervised</strong> — labels generated from the data itself; enables large-scale pretraining. Example: predicting the next word in text.</li>
        </ul>
        <p>
          For the rest of this course, Alex is doing <strong>supervised learning</strong> — it is
          the right tool when you have labeled examples and a clearly defined target to predict.
        </p>
      </ExplanationBox>
    </div>
  );
}
