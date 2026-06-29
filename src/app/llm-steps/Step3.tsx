import ExplanationBox from '@/components/ExplanationBox';

export default function Step3() {
  return (
    <div>
      <ExplanationBox title="Tokenization: Splitting Text Into Tokens">
        <p>
          A computer can only work with numbers, not letters. So the very first thing that happens to your
          text is it gets chopped into small pieces called <strong>tokens</strong> — usually a whole word or
          a fragment of one. Each token is then swapped for a number called its <strong>ID</strong>, which is
          just its row number in the model&apos;s fixed dictionary.
        </p>
        <p>
          The trick is that these IDs are <strong>name tags, not amounts</strong> — a bigger number does not
          mean &ldquo;more&rdquo; of anything. The model never sees the actual letters either, which is why it
          once struggled to count the r&apos;s in &ldquo;strawberry&rdquo;: it only saw the token, not the
          spelling. Turning these label-numbers into ones that actually carry meaning is the job of the next
          step, embeddings.
        </p>
      </ExplanationBox>
    </div>
  );
}
