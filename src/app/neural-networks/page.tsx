'use client';

import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { STEPS, TOTAL_STEPS } from '@/lib/store';
import { getCompletedSteps, markStepComplete, markStepIncomplete } from '@/lib/progress';

const PART_NAMES: Record<number, string> = {
  0: 'Introduction',
  1: 'The Overview',
  2: 'The Math',
};

const PARTS = [0, 1, 2].map(part => ({
  part,
  name: PART_NAMES[part],
  steps: STEPS.filter(s => s.part === part),
}));

// Preload adjacent steps for instant navigation
const preloadStep = (stepNum: number) => {
  if (stepNum >= 1 && stepNum <= TOTAL_STEPS) {
    import(`@/app/steps/Step${stepNum}`);
  }
};

// Loading skeleton
const StepLoader = memo(function StepLoader() {
  return (
    <div className="step-loader">
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-text" />
      <div className="skeleton skeleton-text short" />
      <div className="skeleton skeleton-text" />
    </div>
  );
});

// Create dynamic imports with loading state
const createStepComponent = (stepNum: number) =>
  dynamic(() => import(`@/app/steps/Step${stepNum}`), {
    loading: () => <StepLoader />,
    ssr: false,
  });

const stepComponents = Array.from({ length: TOTAL_STEPS }, (_, i) => createStepComponent(i + 1));

// Memoized footer button
const FooterButton = memo(function FooterButton({
  direction,
  onClick
}: {
  direction: 'prev' | 'next';
  onClick: () => void;
}) {
  return (
    <button
      className={`footer-btn ${direction}`}
      onClick={onClick}
    >
      {direction === 'prev' ? '← Previous' : 'Next →'}
    </button>
  );
});

// Helper to refresh completed set into state properly
function useCompleted() {
  const [completedArr, setCompletedArr] = useState<number[]>([]);

  useEffect(() => {
    setCompletedArr([...getCompletedSteps()]);
  }, []);

  const refresh = useCallback(() => {
    setCompletedArr([...getCompletedSteps()]);
  }, []);

  const completedSet = new Set(completedArr);
  return { completed: completedSet, completedCount: completedArr.length, refresh };
}

function CourseContent() {
  const searchParams = useSearchParams();
  const stepParam = searchParams.get('step');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedParts, setExpandedParts] = useState<Set<number>>(new Set([0, 1, 2]));
  const { completed, completedCount, refresh: refreshCompleted } = useCompleted();
  const [headerVisible, setHeaderVisible] = useState(true);
  const [showCertificate, setShowCertificate] = useState(false);
  const lastScrollY = useRef(0);
  const scrollTicking = useRef(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  const getInitialStep = () => {
    if (stepParam) {
      const parsed = parseInt(stepParam, 10);
      if (parsed >= 1 && parsed <= TOTAL_STEPS) return parsed;
    }
    return 1;
  };

  const [currentStep, setCurrentStep] = useState(getInitialStep);

  useEffect(() => {
    const newStep = getInitialStep();
    if (newStep !== currentStep) setCurrentStep(newStep);
  }, [stepParam]);

  useEffect(() => {
    preloadStep(currentStep + 1);
    preloadStep(currentStep - 1);
  }, [currentStep]);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollTicking.current) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          if (y < lastScrollY.current || y < 100) setHeaderVisible(true);
          else if (y > 100) setHeaderVisible(false);
          lastScrollY.current = y;
          scrollTicking.current = false;
        });
        scrollTicking.current = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') { setSidebarOpen(false); setShowCertificate(false); } };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const goToStep = useCallback((stepId: number) => {
    setCurrentStep(stepId);
    setHeaderVisible(true);
    window.scrollTo({ top: 0, behavior: 'instant' });
    window.history.pushState({}, '', `/neural-networks?step=${stepId}`);
    setSidebarOpen(false);
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < TOTAL_STEPS) {
      markStepComplete(currentStep);
      refreshCompleted();
      goToStep(currentStep + 1);
    } else {
      // On last step, mark complete and show certificate if all done
      markStepComplete(currentStep);
      refreshCompleted();
      // Check if all complete after marking
      const nowCompleted = getCompletedSteps();
      if (nowCompleted.size === TOTAL_STEPS) {
        setShowCertificate(true);
      }
    }
  }, [currentStep, goToStep, refreshCompleted]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) goToStep(currentStep - 1);
  }, [currentStep, goToStep]);

  const togglePart = (part: number) => {
    setExpandedParts(prev => {
      const next = new Set(prev);
      if (next.has(part)) next.delete(part);
      else next.add(part);
      return next;
    });
  };

  const toggleComplete = (stepId: number) => {
    if (completed.has(stepId)) markStepIncomplete(stepId);
    else markStepComplete(stepId);
    refreshCompleted();
  };

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (val >= 1 && val <= TOTAL_STEPS) goToStep(val);
  }, [goToStep]);

  const progressPercent = Math.round((completedCount / TOTAL_STEPS) * 100);
  const allComplete = completedCount === TOTAL_STEPS;

  const StepComponent = stepComponents[currentStep - 1];
  const step = STEPS[currentStep - 1];

  const downloadCertificate = () => {
    const name = prompt('Enter your full name for the certificate:');
    if (!name) return;

    const canvas = document.createElement('canvas');
    canvas.width = 1400;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d')!;

    // Background
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, 1400, 1000);

    // Border
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 4;
    ctx.strokeRect(40, 40, 1320, 920);

    // Inner border
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.strokeRect(52, 52, 1296, 896);

    // Top accent line
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(200, 100, 1000, 4);

    // "CERTIFICATE OF COMPLETION"
    ctx.fillStyle = '#2563eb';
    ctx.font = '600 18px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '6px';
    ctx.fillText('CERTIFICATE OF COMPLETION', 700, 180);

    // Course name
    ctx.fillStyle = '#222';
    ctx.font = '600 48px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.letterSpacing = '0px';
    ctx.fillText('Neural Networks', 700, 280);

    // Subtitle
    ctx.fillStyle = '#666';
    ctx.font = '400 20px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('Building Neural Networks from Scratch', 700, 330);

    // "This certifies that"
    ctx.fillStyle = '#888';
    ctx.font = '400 18px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('This certifies that', 700, 420);

    // Name
    ctx.fillStyle = '#222';
    ctx.font = '600 40px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(name, 700, 490);

    // Line under name
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(350, 510);
    ctx.lineTo(1050, 510);
    ctx.stroke();

    // Description
    ctx.fillStyle = '#666';
    ctx.font = '400 18px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('has successfully completed all 24 modules of the Neural Networks course,', 700, 580);
    ctx.fillText('demonstrating understanding of neural network architecture, forward propagation,', 700, 610);
    ctx.fillText('backpropagation, gradient descent, and training from first principles.', 700, 640);

    // Date
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    ctx.fillStyle = '#888';
    ctx.font = '400 16px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(date, 400, 780);

    // Date label
    ctx.fillStyle = '#bbb';
    ctx.font = '400 13px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('DATE', 400, 810);

    // Issuer
    ctx.fillStyle = '#888';
    ctx.font = '400 16px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('Asher Zaczepinski', 1000, 780);

    // Issuer label
    ctx.fillStyle = '#bbb';
    ctx.font = '400 13px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('INSTRUCTOR', 1000, 810);

    // Lines under date and issuer
    ctx.strokeStyle = '#e5e7eb';
    ctx.beginPath();
    ctx.moveTo(280, 760);
    ctx.lineTo(520, 760);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(880, 760);
    ctx.lineTo(1120, 760);
    ctx.stroke();

    // Bottom accent
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(200, 880, 1000, 4);

    // codewithasher branding
    ctx.fillStyle = '#2563eb';
    ctx.font = '600 14px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('codewithasher.com', 700, 920);

    // Credential ID
    const credId = `CWA-NN-${Date.now().toString(36).toUpperCase()}`;
    ctx.fillStyle = '#bbb';
    ctx.font = '400 12px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(`Credential ID: ${credId}`, 700, 945);

    // Download
    const link = document.createElement('a');
    link.download = `Neural-Networks-Certificate-${name.replace(/\s+/g, '-')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="course-page">
      {/* Header */}
      <header className={`course-header ${headerVisible ? 'visible' : 'hidden'}`}>
        <nav className="course-nav">
          <button
            className="nav-arrow sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle curriculum"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 4.5h12M3 9h12M3 13.5h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>

          <button className="nav-arrow" onClick={prevStep} disabled={currentStep === 1} aria-label="Previous step">←</button>

          <div className="step-pagination">
            <input type="number" className="step-input" value={currentStep} onChange={handleInputChange} min={1} max={TOTAL_STEPS} />
            <span className="step-total">of {TOTAL_STEPS}</span>
          </div>

          <button className="nav-arrow" onClick={nextStep} disabled={currentStep === TOTAL_STEPS} aria-label="Next step">→</button>
        </nav>
      </header>

      {/* Sidebar overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`course-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">Course Content</h2>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Sidebar progress */}
        <div className="sidebar-progress">
          <div className="sidebar-progress-text">
            <span>{completedCount} of {TOTAL_STEPS} complete</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="sidebar-progress-bar">
            <div className="sidebar-progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        {/* Certificate button in sidebar */}
        {allComplete && (
          <div style={{ padding: '12px 20px', borderBottom: '1px solid #e5e7eb' }}>
            <button
              onClick={() => { setSidebarOpen(false); setShowCertificate(true); }}
              style={{
                width: '100%',
                padding: '10px 16px',
                background: '#22c55e',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Get Your Certificate
            </button>
          </div>
        )}

        {/* Accordion sections */}
        <div className="sidebar-sections">
          {PARTS.map(({ part, name, steps }) => {
            const partCompleted = steps.filter(s => completed.has(s.id)).length;
            const isExpanded = expandedParts.has(part);
            return (
              <div key={part} className="sidebar-section">
                <button className="sidebar-section-header" onClick={() => togglePart(part)}>
                  <div className="sidebar-section-left">
                    <svg className={`sidebar-chevron ${isExpanded ? 'expanded' : ''}`} width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="sidebar-section-name">{part > 0 ? `Part ${part}: ` : ''}{name}</span>
                  </div>
                  <span className="sidebar-section-count">{partCompleted}/{steps.length}</span>
                </button>

                {isExpanded && (
                  <div className="sidebar-lessons">
                    {steps.map(s => (
                      <div
                        key={s.id}
                        className={`sidebar-lesson ${s.id === currentStep ? 'active' : ''} ${completed.has(s.id) ? 'completed' : ''}`}
                      >
                        <button
                          className="sidebar-lesson-check"
                          onClick={(e) => { e.stopPropagation(); toggleComplete(s.id); }}
                          aria-label={completed.has(s.id) ? 'Mark incomplete' : 'Mark complete'}
                        >
                          {completed.has(s.id) ? (
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                              <circle cx="9" cy="9" r="9" fill="#22c55e"/>
                              <path d="M5.5 9l2.2 2.2L12.5 6.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          ) : (
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                              <circle cx="9" cy="9" r="8.25" stroke="#d1d5db" strokeWidth="1.5"/>
                            </svg>
                          )}
                        </button>
                        <button className="sidebar-lesson-link" onClick={() => goToStep(s.id)}>
                          {s.title}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>

      {/* Certificate modal */}
      {showCertificate && (
        <div className="cert-overlay" onClick={() => setShowCertificate(false)}>
          <div className="cert-modal" onClick={e => e.stopPropagation()} ref={certificateRef}>
            <div className="cert-card">
              <div className="cert-border">
                <div className="cert-accent-top" />
                <p className="cert-heading">CERTIFICATE OF COMPLETION</p>
                <h2 className="cert-course-name">Neural Networks</h2>
                <p className="cert-subtitle">Building Neural Networks from Scratch</p>
                <p className="cert-congrats">
                  Congratulations! You&apos;ve completed all 24 modules, covering neural network
                  architecture, forward propagation, backpropagation, gradient descent, and training
                  from first principles.
                </p>
                <div className="cert-accent-bottom" />
                <p className="cert-brand">codewithasher.com</p>
              </div>
            </div>

            <div className="cert-actions">
              <button className="cert-download-btn" onClick={downloadCertificate}>
                Download Certificate (PNG)
              </button>
              <button className="cert-close-btn" onClick={() => setShowCertificate(false)}>
                Close
              </button>
            </div>
            <p style={{ fontSize: 13, color: '#888', textAlign: 'center', marginTop: 8 }}>
              Download the certificate and add it to your LinkedIn profile under Licenses & Certifications.
            </p>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="course-main">
        <div className="course-content">
          <div className="step-header-section">
            <span className="step-label">{step.part === 0 ? '' : `Part ${step.part} · `}Module {currentStep}</span>
            <h1>{step.title}</h1>
          </div>

          <div className="step-body">
            <StepComponent />
          </div>

          {/* Bottom navigation */}
          <div className="step-footer">
            {currentStep > 1 && <FooterButton direction="prev" onClick={prevStep} />}
            <div className="footer-spacer" />
            {currentStep < TOTAL_STEPS ? (
              <FooterButton direction="next" onClick={nextStep} />
            ) : (
              <button
                className="footer-btn next"
                onClick={() => {
                  markStepComplete(currentStep);
                  refreshCompleted();
                  const nowCompleted = getCompletedSteps();
                  if (nowCompleted.size === TOTAL_STEPS) {
                    setShowCertificate(true);
                  }
                }}
              >
                {allComplete ? 'View Certificate' : 'Complete Course'}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function NeuralNetworksPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="course-page">
        <header className="course-header visible">
          <nav className="course-nav">
            <div className="nav-arrow" style={{ opacity: 0.3 }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 4.5h12M3 9h12M3 13.5h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="nav-arrow" style={{ opacity: 0.3 }}>←</div>
            <div className="step-pagination">
              <div className="step-input" style={{ background: '#f3f4f6' }} />
              <span className="step-total">of {TOTAL_STEPS}</span>
            </div>
            <div className="nav-arrow" style={{ opacity: 0.3 }}>→</div>
          </nav>
        </header>
        <main className="course-main">
          <div className="course-content">
            <div className="step-header-section">
              <div className="skeleton" style={{ width: '80px', height: '14px', marginBottom: '10px' }} />
              <div className="skeleton" style={{ width: '60%', height: '32px' }} />
            </div>
            <StepLoader />
          </div>
        </main>
      </div>
    );
  }

  return <CourseContent />;
}
