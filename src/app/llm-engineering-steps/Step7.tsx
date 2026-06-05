'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step7() {
  return (
    <div>
      <ExplanationBox title="Hallucinations: The Fundamental Problem">
        <p>
          An LLM <strong>hallucination</strong> is a confident, fluent, plausible-sounding
          statement that is factually wrong. The model cites a paper that does not exist,
          invents a court ruling, or confidently gives a wrong calculation.
        </p>
        <p>
          Why does this happen? Remember the training objective: predict the next token to
          maximize likelihood on the training corpus. The model learned which token sequences
          are statistically plausible — not which facts are true. When asked about something
          rare or out of distribution, the model generates plausible-sounding tokens, not
          verified facts.
        </p>
        <p>
          There is no simple fix. Hallucinations are an emergent property of how these models
          are trained. Mitigation strategies include:
        </p>
        <ul style={{ lineHeight: '1.8' }}>
          <li><strong>RAG:</strong> Grounding answers in retrieved documents shifts the model
          from recalling to paraphrasing, dramatically reducing factual errors.</li>
          <li><strong>Citation prompting:</strong> Requiring the model to cite sources forces
          it to only claim things present in its context.</li>
          <li><strong>Temperature reduction:</strong> Lower temperatures make the model more
          conservative, though this can reduce helpfulness.</li>
          <li><strong>Calibration and uncertainty:</strong> Training models to say &quot;I&apos;m
          not sure&quot; when uncertain, rather than confabulating.</li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="Bias and Toxicity">
        <p>
          LLMs are trained on human-generated text, and human-generated text contains bias.
          Models pick up and can amplify stereotypes about gender, race, religion, profession,
          and nationality. They may associate certain occupations with specific genders, or
          generate more negative text about certain groups than others.
        </p>
        <p>
          This is not a solved problem. Alignment training reduces overt toxicity — responses
          that contain slurs, graphic violence, or hate speech — but subtler forms of bias
          are much harder to train away. Some types of bias emerge from the composition of
          the training data and cannot be fully eliminated without changing that data.
        </p>
        <p>
          Practitioners should:
        </p>
        <ul style={{ lineHeight: '1.8' }}>
          <li>Run bias evaluation benchmarks (BBQ, WinoBias) before deploying models in
          sensitive contexts.</li>
          <li>Use system prompts to explicitly instruct the model about fairness expectations.</li>
          <li>Implement output filtering for known toxic patterns.</li>
          <li>Conduct ongoing red-team testing with diverse evaluators.</li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="Guardrails">
        <p>
          <strong>Guardrails</strong> are programmatic safety layers applied on top of the model.
          They operate at two levels:
        </p>
        <ul style={{ lineHeight: '1.8' }}>
          <li>
            <strong>Input guardrails:</strong> Classify the user&apos;s input before it reaches
            the model. If the input matches a harmful category (prompt injection, jailbreak,
            personal data exfiltration), block or modify it.
          </li>
          <li>
            <strong>Output guardrails:</strong> Classify the model&apos;s response before
            returning it to the user. Flag or redact content that violates policies — PII,
            specific toxic categories, competitor mentions, etc.
          </li>
        </ul>
        <p>
          Guardrail classifiers are typically fast, small models (e.g., a fine-tuned BERT)
          deployed inline in the serving stack. They add a few milliseconds of latency in
          exchange for a meaningful safety layer independent of the main model&apos;s own
          alignment.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Jailbreaks and Adversarial Prompting">
        <p>
          A <strong>jailbreak</strong> is a prompt designed to circumvent the model&apos;s
          safety training — getting it to produce content it was aligned to refuse.
          Common techniques include role-play framing (&quot;pretend you are an AI without
          restrictions&quot;), base-64 encoding of forbidden requests, and multi-turn
          conversations that gradually shift the model&apos;s context.
        </p>
        <p>
          No alignment approach provides 100% protection. Frontier labs employ dedicated
          <strong> red teams</strong> — researchers whose job is to find jailbreaks —
          and continuously update alignment training in response. The practical approach for
          application developers is defense in depth: strong alignment + input/output
          guardrails + rate limiting + anomaly detection.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Safety Evaluation">
        <p>
          Measuring safety rigorously is as important as improving it. Standard evaluation
          approaches include:
        </p>
        <ul style={{ lineHeight: '1.8' }}>
          <li>
            <strong>Benchmark suites:</strong> TruthfulQA (measures tendency to produce
            false but plausible answers), ToxiGen (toxic generation), HarmBench (standardized
            red-team scenarios).
          </li>
          <li>
            <strong>Human red-teaming:</strong> Diverse teams of annotators systematically
            probe the model for failure modes.
          </li>
          <li>
            <strong>Automated red-teaming:</strong> A separate LLM generates adversarial
            prompts at scale; cheaper and faster than human red-teaming but less creative.
          </li>
        </ul>
        <p>
          The core tension in safety work is the <strong>alignment-capability trade-off</strong>:
          a model that refuses more is safer but less useful. Every product team must decide
          where on this spectrum to sit — and that decision should be made deliberately,
          not by default.
        </p>
      </ExplanationBox>
    </div>
  );
}
