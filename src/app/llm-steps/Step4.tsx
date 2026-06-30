'use client';

import ExplanationBox from '@/components/ExplanationBox';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step4() {
  return (
    <div>
      <ExplanationBox title="A Token ID Means Nothing — So We Swap It for a Vector">
        <p>
          Tokenizing turned <strong>&ldquo;The sky is&rdquo;</strong> into IDs like{' '}
          <code>464, 6766, 318</code>. But those numbers are just <em>name tags</em> — token 6766 is not
          &ldquo;bigger&rdquo; than 464 in any meaningful way. Feed them straight into a machine that
          multiplies and adds and you would get nonsense.
        </p>
        <p>
          So the first thing the model does is throw each ID away and look up a <strong>vector</strong> —
          a short list of numbers — in a big table called the <strong>embedding</strong> (one row per
          token). A vector is just coordinates, so you can picture each word as a{' '}
          <strong>point in space</strong>, where words used alike sit near each other.
        </p>
        <p>
          Where do the numbers come from? They start <em>random</em> and get tuned alongside the whole
          network while it learns to predict the next token — nobody writes them by hand. We will not dwell
          on it, because the real story of this course is what happens to these vectors <em>next</em>.
        </p>
      </ExplanationBox>

      <WorkedExample title="Our Three Vectors">
        <p>These exact three vectors carry through every step from here on — worth memorizing:</p>
        <CalcStep number={1}>The = [0.1, 0.0, 0.9]</CalcStep>
        <CalcStep number={2}>sky = [1.0, 0.7, 0.0]</CalcStep>
        <CalcStep number={3}>is&nbsp;&nbsp;= [0.1, 0.2, 0.8]</CalcStep>
      </WorkedExample>

      <ExplanationBox title="Comparing Two Vectors: The Dot Product">
        <p>
          We will constantly need to ask &ldquo;how much do two vectors line up?&rdquo; The tool is the{' '}
          <strong>dot product</strong>: multiply matching slots, then add the results. A big number means
          they point the same way; near zero means they are unrelated. It is the single most-used operation
          inside an LLM — attention scores and the final prediction are both built from it.
        </p>
        <CalcStep number={1}>The &middot; is = (0.1&times;0.1) + (0.0&times;0.2) + (0.9&times;0.8) = <strong>0.73</strong></CalcStep>
        <CalcStep number={2}>sky &middot; is = (1.0&times;0.1) + (0.7&times;0.2) + (0.0&times;0.8) = <strong>0.24</strong></CalcStep>
        <CalcStep number={3}>The &middot; sky = (0.1&times;1.0) + (0.0&times;0.7) + (0.9&times;0.0) = <strong>0.10</strong></CalcStep>
        <p style={{ marginTop: '1rem' }}>
          Notice the trap already: <strong>The</strong> and <strong>is</strong> line up the most (0.73) —
          two little function words pointing the same way — while <strong>sky</strong> barely aligns with
          either. Hold that thought.
        </p>
      </ExplanationBox>

      <ExplanationBox title="One Fixed Vector Per Word — and Why That's a Problem">
        <p>
          These vectors are the model&apos;s real input. But there is a catch baked into the table: it
          hands each token <strong>one fixed vector</strong>, the same in every sentence. So &ldquo;bank&rdquo;
          by a river and &ldquo;bank&rdquo; with your money get identical numbers — and, as the dot products
          just showed, &ldquo;is&rdquo; ends up looking more like &ldquo;The&rdquo; than like the word that
          actually matters, &ldquo;sky.&rdquo; A word&apos;s real meaning depends on its <em>neighbours</em>,
          and a fixed lookup cannot see them. Fixing that — letting every word reshape itself from the words
          around it — is <strong>attention</strong>, the heart of the whole machine. That is exactly where we
          go next.
        </p>
      </ExplanationBox>
    </div>
  );
}
