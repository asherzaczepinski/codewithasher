'use client';

import ExplanationBox from '@/components/ExplanationBox';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step8() {
  return (
    <div>
      <p>
        <strong>Where we are:</strong> Our rain neuron output z = 1.49, but z can be any number.
        We need a way to convert z into a confidence between 0 and 1 — that&apos;s what sigmoid does.
      </p>

      <ExplanationBox title="The Problem: Our Numbers Are All Over the Place">
        <p>
          In the last step, we computed our rain neuron&apos;s pre‑activation value: <strong>z = 1.49</strong>.
          However, z can be any number. With different inputs and weights, you might get:
        </p>
        <ul style={{ marginTop: '0.5rem', lineHeight: '1.8' }}>
          <li>z = 1.49 (our rain neuron)</li>
          <li>z = -5.2 (based on a cloud-free sky)</li>
          <li>z = 47.3 (another neuron with extreme confidence)</li>
        </ul>
        <p style={{ marginTop: '1rem' }}>
          Here&apos;s the challenge: How do we compare all these neurons? If one neuron outputs
          z = 47.3 and another outputs z = 1.49, which is more confident? How much more? How can
          we compare a negative and a positive value? We can&apos;t just compare raw z values —
          we need a <strong>common scale</strong> so every neuron&apos;s confidence is expressed
          the same way!
        </p>
      </ExplanationBox>

      <div style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        borderRadius: '16px',
        padding: '24px 16px',
        margin: '0 0 20px 0',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}>
        <svg viewBox="0 0 460 80" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: 'auto', display: 'block' }}>
          <text x="20" y="18" fill="#64748b" fontSize="11" fontWeight="600">The problem: raw z values are hard to interpret as confidence</text>
          <rect x="20" y="30" width="80" height="30" rx="6" fill="#a78bfa" stroke="#7c3aed" strokeWidth="1.5"/>
          <text x="60" y="50" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="600">z = 1.49</text>
          <text x="115" y="50" fill="#64748b" fontSize="18">→</text>
          <text x="140" y="50" fill="#64748b" fontSize="11">sigmoid</text>
          <text x="195" y="50" fill="#64748b" fontSize="18">→</text>
          <rect x="215" y="30" width="100" height="30" rx="6" fill="#f0fdf4" stroke="#86efac" strokeWidth="1.5"/>
          <text x="265" y="50" textAnchor="middle" fill="#15803d" fontSize="11" fontWeight="600">≈82% confident</text>
          <text x="340" y="50" fill="#15803d" fontSize="11" fontWeight="600">rain!</text>
        </svg>
      </div>

      <ExplanationBox title="The Sigmoid Formula">
        <div style={{
          background: '#f8fafc',
          border: '2px solid #3b82f6',
          borderRadius: '8px',
          padding: '2rem',
          marginTop: '1rem',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '24px',
            fontFamily: 'Georgia, serif',
            display: 'inline-block'
          }}>
            <div style={{ marginBottom: '8px' }}>
              sigmoid(z) =
              <span style={{
                display: 'inline-block',
                textAlign: 'center',
                verticalAlign: 'middle',
                marginLeft: '12px'
              }}>
                <div style={{ fontSize: '28px', paddingBottom: '4px' }}>1</div>
                <div style={{ borderTop: '2px solid #1e293b', margin: '0 auto', width: '140px' }}></div>
                <div style={{ fontSize: '28px', paddingTop: '4px' }}>1 + e<sup>−z</sup></div>
              </span>
            </div>
          </div>
          <div style={{ marginTop: '1rem', fontSize: '14px', color: '#64748b' }}>
            where e ≈ 2.718 (Euler&apos;s number)
          </div>
        </div>
      </ExplanationBox>

      <WorkedExample title="How Sigmoid Transforms Different Values">
        <p>
          Let&apos;s see how sigmoid transforms different z values. Notice the pattern in the calculations:
        </p>

        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '1.5rem',
          marginTop: '1rem'
        }}>
          {/* z = 0 */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ fontWeight: '600', marginBottom: '0.75rem', color: '#1e293b', fontSize: '16px' }}>
              z = 0:
            </div>
            <div style={{ fontFamily: 'Georgia, serif', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '18px' }}>sigmoid(0) = </span>
              <span style={{ display: 'inline-block', textAlign: 'center', verticalAlign: 'middle', marginLeft: '8px', marginRight: '8px' }}>
                <div style={{ fontSize: '20px', paddingBottom: '2px' }}>1</div>
                <div style={{ borderTop: '2px solid #1e293b', width: '80px' }}></div>
                <div style={{ fontSize: '20px', paddingTop: '2px' }}>1 + e<sup>0</sup></div>
              </span>
              <span style={{ fontSize: '18px' }}> = </span>
              <span style={{ display: 'inline-block', textAlign: 'center', verticalAlign: 'middle', marginLeft: '8px', marginRight: '8px' }}>
                <div style={{ fontSize: '20px', paddingBottom: '2px' }}>1</div>
                <div style={{ borderTop: '2px solid #1e293b', width: '60px' }}></div>
                <div style={{ fontSize: '20px', paddingTop: '2px' }}>1 + 1</div>
              </span>
              <span style={{ fontSize: '18px' }}> = </span>
              <span style={{ display: 'inline-block', textAlign: 'center', verticalAlign: 'middle', marginLeft: '8px', marginRight: '8px' }}>
                <div style={{ fontSize: '20px', paddingBottom: '2px' }}>1</div>
                <div style={{ borderTop: '2px solid #1e293b', width: '30px' }}></div>
                <div style={{ fontSize: '20px', paddingTop: '2px' }}>2</div>
              </span>
              <span style={{ fontSize: '18px' }}> = <strong style={{ color: '#2563eb' }}>0.5</strong></span>
            </div>
            <div style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5' }}>
              When z = 0, we have neutral probabilities. Since e<sup>0</sup> = 1, we get 1/(1+1) = 1/2 = 50% chance!
            </div>
          </div>

          {/* z = 5 */}
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ fontWeight: '600', marginBottom: '0.75rem', color: '#1e293b', fontSize: '16px' }}>
              z = 5:
            </div>
            <div style={{ fontFamily: 'Georgia, serif', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '18px' }}>sigmoid(5) = </span>
              <span style={{ display: 'inline-block', textAlign: 'center', verticalAlign: 'middle', marginLeft: '8px', marginRight: '8px' }}>
                <div style={{ fontSize: '20px', paddingBottom: '2px' }}>1</div>
                <div style={{ borderTop: '2px solid #1e293b', width: '80px' }}></div>
                <div style={{ fontSize: '20px', paddingTop: '2px' }}>1 + e<sup>-5</sup></div>
              </span>
              <span style={{ fontSize: '18px' }}> = </span>
              <span style={{ display: 'inline-block', textAlign: 'center', verticalAlign: 'middle', marginLeft: '8px', marginRight: '8px' }}>
                <div style={{ fontSize: '20px', paddingBottom: '2px' }}>1</div>
                <div style={{ borderTop: '2px solid #1e293b', width: '110px' }}></div>
                <div style={{ fontSize: '20px', paddingTop: '2px' }}>1 + 0.0067</div>
              </span>
              <span style={{ fontSize: '18px' }}> ≈ <strong style={{ color: '#2563eb' }}>0.993</strong></span>
            </div>
            <div style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5' }}>
              e<sup>-5</sup> is very small (0.0067), so the denominator is close to 1, making the output close to 1
            </div>
          </div>

          {/* z = 10 */}
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ fontWeight: '600', marginBottom: '0.75rem', color: '#1e293b', fontSize: '16px' }}>
              z = 10:
            </div>
            <div style={{ fontFamily: 'Georgia, serif', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '18px' }}>sigmoid(10) = </span>
              <span style={{ display: 'inline-block', textAlign: 'center', verticalAlign: 'middle', marginLeft: '8px', marginRight: '8px' }}>
                <div style={{ fontSize: '20px', paddingBottom: '2px' }}>1</div>
                <div style={{ borderTop: '2px solid #1e293b', width: '90px' }}></div>
                <div style={{ fontSize: '20px', paddingTop: '2px' }}>1 + e<sup>-10</sup></div>
              </span>
              <span style={{ fontSize: '18px' }}> = </span>
              <span style={{ display: 'inline-block', textAlign: 'center', verticalAlign: 'middle', marginLeft: '8px', marginRight: '8px' }}>
                <div style={{ fontSize: '20px', paddingBottom: '2px' }}>1</div>
                <div style={{ borderTop: '2px solid #1e293b', width: '130px' }}></div>
                <div style={{ fontSize: '20px', paddingTop: '2px' }}>1 + 0.000045</div>
              </span>
              <span style={{ fontSize: '18px' }}> ≈ <strong style={{ color: '#2563eb' }}>0.99995</strong></span>
            </div>
            <div style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5' }}>
              e<sup>-10</sup> is extremely small, so the denominator is almost exactly 1, making the output almost exactly 1
            </div>
          </div>

          {/* z = 100 */}
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
            <div style={{ fontWeight: '600', marginBottom: '0.75rem', color: '#1e293b', fontSize: '16px' }}>
              z = 100:
            </div>
            <div style={{ fontFamily: 'Georgia, serif', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '18px' }}>sigmoid(100) = </span>
              <span style={{ display: 'inline-block', textAlign: 'center', verticalAlign: 'middle', marginLeft: '8px', marginRight: '8px' }}>
                <div style={{ fontSize: '20px', paddingBottom: '2px' }}>1</div>
                <div style={{ borderTop: '2px solid #1e293b', width: '100px' }}></div>
                <div style={{ fontSize: '20px', paddingTop: '2px' }}>1 + e<sup>-100</sup></div>
              </span>
              <span style={{ fontSize: '18px' }}> ≈ </span>
              <span style={{ display: 'inline-block', textAlign: 'center', verticalAlign: 'middle', marginLeft: '8px', marginRight: '8px' }}>
                <div style={{ fontSize: '20px', paddingBottom: '2px' }}>1</div>
                <div style={{ borderTop: '2px solid #1e293b', width: '60px' }}></div>
                <div style={{ fontSize: '20px', paddingTop: '2px' }}>1 + 0</div>
              </span>
              <span style={{ fontSize: '18px' }}> ≈ <strong style={{ color: '#2563eb' }}>1.0</strong></span>
            </div>
            <div style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5' }}>
              e<sup>-100</sup> is so tiny it&apos;s essentially 0, so we get ≈ 1/1 ≈ 1
            </div>
          </div>
        </div>
      </WorkedExample>
      <ExplanationBox title="Why Use e (Euler's Number)?">
        <p>
          You might wonder: why use e ≈ 2.718 instead of a simpler number like 2 or 10?
        </p>
        <p style={{ marginTop: '1rem' }}>
          The answer has to do with <strong>backpropagation</strong> — the process where the neural
          network adjusts its weights to become more accurate. Using e makes the math for updating
          weights much simpler and more efficient. When we get to the backpropagation section later,
          you&apos;ll see exactly why e is the perfect choice!
        </p>
      </ExplanationBox>

      <p>
        <strong>Simpler version:</strong> We use e because it makes the backward math (training) much cleaner.
        Don&apos;t worry about why — just know that sigmoid with e gives us a beautiful shortcut for computing
        how to adjust weights. We&apos;ll see this in action during backpropagation.
      </p>

      <ExplanationBox title="The Pattern: Bigger z → Smaller Denominator → Bigger Output">
        <p>
          As z gets bigger, e<sup>-z</sup> gets smaller. When the bottom of the fraction (denominator)
          gets smaller by approaching 1, the overall fraction gets bigger (approaching 1). That&apos;s
          why large positive inputs give outputs close to 1, while large negative inputs give outputs
          close to 0!
        </p>
        <p>
          For our rain neuron with z = 1.49: sigmoid(1.49) ≈ 0.816 — so the neuron is about 82% confident
          it&apos;ll rain. That&apos;s sigmoid turning the raw signal into a confidence level we can actually
          interpret.
        </p>
      </ExplanationBox>

      <ExplanationBox title="A Note on Extreme Values">
        <p>
          You may have noticed that z = 10 and z = 100 produce nearly the same result (0.99995 vs 1.0)
          even though they&apos;re very far apart. This would normally be an issue because both values
          would activate the neuron&apos;s confidence at essentially the same level, even though the
          inputs are quite different.
        </p>
        <p style={{ marginTop: '1rem' }}>
          However, even though we used z = 100 as an example, you would rarely ever have a z value
          above 10 in practice. Remember we used normalization at the start (turning values like 28°C
          into 0.7), and weights are typically initialized to small values.
          Our rain neuron got z = 1.49 — comfortably in range where the neuron&apos;s confidence
          can meaningfully change based on the inputs.
        </p>
      </ExplanationBox>

      <p>
        <strong>Rain check:</strong> Our rain neuron&apos;s z = 1.49 sits comfortably in the range where
        sigmoid is sensitive — sigmoid(1.49) ≈ 0.816, giving us ~82% rain confidence.
        But what happens when we scale up to many inputs? We need to make sure z stays in this useful range.
      </p>
    </div>
  );
}
