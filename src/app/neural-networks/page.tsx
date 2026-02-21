'use client';

import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { STEPS, TOTAL_STEPS } from '@/lib/store';
import { getCompletedSteps, markStepComplete, markStepIncomplete } from '@/lib/progress';

const PART_NAMES: Record<number, string> = {
  0: 'Introduction',
  1: 'The Neuron',
  2: 'Building the Network',
};

const PARTS = [0, 1, 2].map(part => ({
  part,
  name: PART_NAMES[part],
  steps: STEPS.filter(s => s.part === part),
}));

const preloadStep = (stepNum: number) => {
  if (stepNum >= 1 && stepNum <= TOTAL_STEPS) {
    import(`@/app/steps/Step${stepNum}`);
  }
};

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

const createStepComponent = (stepNum: number) =>
  dynamic(() => import(`@/app/steps/Step${stepNum}`), {
    loading: () => <StepLoader />,
    ssr: false,
  });

const stepComponents = Array.from({ length: TOTAL_STEPS }, (_, i) => createStepComponent(i + 1));

const FooterButton = memo(function FooterButton({
  direction,
  onClick
}: {
  direction: 'prev' | 'next';
  onClick: () => void;
}) {
  return (
    <button className={`footer-btn ${direction}`} onClick={onClick}>
      {direction === 'prev' ? '← Previous' : 'Next →'}
    </button>
  );
});

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

const MIN_SIDEBAR_WIDTH = 200;
const MAX_SIDEBAR_WIDTH = 500;
const COLLAPSE_THRESHOLD = 140;
const DEFAULT_SIDEBAR_WIDTH = 320;

function CourseContent() {
  const searchParams = useSearchParams();
  const stepParam = searchParams.get('step');
  const [sidebarOpen, setSidebarOpen] = useState(typeof window !== 'undefined' && window.innerWidth > 768);
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH);
  const isDragging = useRef(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  const { completed, completedCount, refresh: refreshCompleted } = useCompleted();
  const [headerVisible, setHeaderVisible] = useState(true);
  const [showCertificate, setShowCertificate] = useState(false);
  const [reachedBottom, setReachedBottom] = useState(false);
  const lastScrollY = useRef(0);
  const scrollTicking = useRef(false);
  const footerRef = useRef<HTMLDivElement>(null);

  const getInitialStep = () => {
    if (stepParam) {
      const parsed = parseInt(stepParam, 10);
      if (parsed >= 1 && parsed <= TOTAL_STEPS) return parsed;
    }
    const done = getCompletedSteps();
    for (let i = 1; i <= TOTAL_STEPS; i++) {
      if (!done.has(i)) return i;
    }
    return TOTAL_STEPS;
  };

  const [currentStep, setCurrentStep] = useState(getInitialStep);

  // Only expand the part that contains the current step on initial load
  const currentPart = STEPS[currentStep - 1]?.part ?? 0;
  const [expandedParts, setExpandedParts] = useState<Set<number>>(new Set([currentPart]));

  useEffect(() => {
    if (!stepParam) {
      window.history.replaceState({}, '', `/neural-networks?step=${currentStep}`);
    }
  }, []);

  useEffect(() => {
    if (stepParam) {
      const newStep = getInitialStep();
      if (newStep !== currentStep) setCurrentStep(newStep);
    }
  }, [stepParam]);

  useEffect(() => {
    preloadStep(currentStep + 1);
    preloadStep(currentStep - 1);
  }, [currentStep]);

  useEffect(() => {
    if (completed.has(currentStep)) {
      setReachedBottom(true);
    } else {
      setReachedBottom(false);
    }
  }, [currentStep]);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollTicking.current) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          if (y < lastScrollY.current || y < 100) setHeaderVisible(true);
          else if (y > 100) setHeaderVisible(false);
          lastScrollY.current = y;

          if (footerRef.current) {
            const rect = footerRef.current.getBoundingClientRect();
            if (rect.top <= window.innerHeight) {
              setReachedBottom(true);
            }
          }

          scrollTicking.current = false;
        });
        scrollTicking.current = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (reachedBottom && !completed.has(currentStep)) {
      markStepComplete(currentStep);
      refreshCompleted();
    }
  }, [reachedBottom, currentStep]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') { setSidebarOpen(false); setShowCertificate(false); } };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Lock body scroll when sidebar overlay is open (mobile only)
  useEffect(() => {
    if (sidebarOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen, isMobile]);

  // Drag to resize sidebar
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const handleMove = (ev: MouseEvent) => {
      if (!isDragging.current) return;
      const newWidth = ev.clientX;
      if (newWidth < COLLAPSE_THRESHOLD) {
        setSidebarOpen(false);
        setSidebarWidth(DEFAULT_SIDEBAR_WIDTH);
      } else {
        setSidebarWidth(Math.min(MAX_SIDEBAR_WIDTH, Math.max(MIN_SIDEBAR_WIDTH, newWidth)));
      }
    };

    const handleUp = () => {
      isDragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
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
      goToStep(currentStep + 1);
    }
  }, [currentStep, goToStep]);

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

    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, 1400, 1000);

    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 4;
    ctx.strokeRect(40, 40, 1320, 920);

    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.strokeRect(52, 52, 1296, 896);

    ctx.fillStyle = '#2563eb';
    ctx.fillRect(200, 100, 1000, 4);

    ctx.fillStyle = '#2563eb';
    ctx.font = '600 18px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '6px';
    ctx.fillText('CERTIFICATE OF COMPLETION', 700, 180);

    ctx.fillStyle = '#222';
    ctx.font = '600 48px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.letterSpacing = '0px';
    ctx.fillText('Neural Networks', 700, 280);

    ctx.fillStyle = '#666';
    ctx.font = '400 20px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('Building Neural Networks from Scratch', 700, 330);

    ctx.fillStyle = '#888';
    ctx.font = '400 18px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('This certifies that', 700, 420);

    ctx.fillStyle = '#222';
    ctx.font = '600 40px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(name, 700, 490);

    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(350, 510);
    ctx.lineTo(1050, 510);
    ctx.stroke();

    ctx.fillStyle = '#666';
    ctx.font = '400 18px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('has successfully completed all 20 modules of the Neural Networks course,', 700, 580);
    ctx.fillText('demonstrating understanding of neural network architecture, forward propagation,', 700, 610);
    ctx.fillText('backpropagation, gradient descent, and training from first principles.', 700, 640);

    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    ctx.fillStyle = '#888';
    ctx.font = '400 16px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(date, 400, 780);

    ctx.fillStyle = '#bbb';
    ctx.font = '400 13px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('DATE', 400, 810);

    ctx.fillStyle = '#888';
    ctx.font = '400 16px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('Asher Zaczepinski', 1000, 780);

    ctx.fillStyle = '#bbb';
    ctx.font = '400 13px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('INSTRUCTOR', 1000, 810);

    ctx.strokeStyle = '#e5e7eb';
    ctx.beginPath();
    ctx.moveTo(280, 760);
    ctx.lineTo(520, 760);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(880, 760);
    ctx.lineTo(1120, 760);
    ctx.stroke();

    ctx.fillStyle = '#2563eb';
    ctx.fillRect(200, 880, 1000, 4);

    ctx.fillStyle = '#2563eb';
    ctx.font = '600 14px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('codewithasher.com', 700, 920);

    const credId = `CWA-NN-${Date.now().toString(36).toUpperCase()}`;
    ctx.fillStyle = '#bbb';
    ctx.font = '400 12px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(`Credential ID: ${credId}`, 700, 945);

    const link = document.createElement('a');
    link.download = `Neural-Networks-Certificate-${name.replace(/\s+/g, '-')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="course-page">
      {/* Top bar line */}
      <div className={`top-bar ${headerVisible ? 'visible' : 'hidden'}`} />

      {/* Home button */}
      <span className={`top-bar-title ${headerVisible ? 'visible' : 'hidden'}`}>Neural Networks</span>
      <a href="/" className={`home-btn ${headerVisible ? 'visible' : 'hidden'}`} aria-label="Back to home">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M5 12l6-6M5 12l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </a>

      {/* Hamburger / X toggle — always visible */}
      <button
        className={`menu-btn ${sidebarOpen ? 'is-open' : ''} ${headerVisible ? 'visible' : 'hidden'}`}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle curriculum"
      >
        <span className="menu-icon">
          <span className="menu-line menu-line-1" />
          <span className="menu-line menu-line-2" />
          <span className="menu-line menu-line-3" />
        </span>
      </button>

      {/* Sidebar overlay — mobile only */}
      {sidebarOpen && isMobile && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={`course-sidebar ${sidebarOpen ? 'open' : 'closed'}`}
        style={sidebarOpen && !isMobile ? { width: sidebarWidth } : undefined}
      >
        <div className="sidebar-progress">
          <div className="sidebar-progress-text">
            <span>{completedCount} of {TOTAL_STEPS} complete</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="sidebar-progress-bar">
            <div className="sidebar-progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

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

          {/* Certificate section */}
          <div className="sidebar-section">
            <div className={`sidebar-cert-section ${allComplete ? '' : 'locked'}`}>
              <div className="sidebar-cert-icon">
                {allComplete ? (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="10" fill="#22c55e"/>
                    <path d="M6 10l2.5 2.5L14 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <rect x="6" y="8" width="8" height="7" rx="1" stroke="#9ca3af" strokeWidth="1.5"/>
                    <path d="M8 8V6a2 2 0 114 0v2" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                )}
              </div>
              <div className="sidebar-cert-text">
                <span className="sidebar-cert-title">Certificate</span>
                <span className="sidebar-cert-desc">
                  {allComplete ? 'Course completed! Get your certificate.' : `Complete all ${TOTAL_STEPS} modules to unlock`}
                </span>
              </div>
              {allComplete && (
                <button
                  className="sidebar-cert-btn"
                  onClick={() => { setSidebarOpen(false); setShowCertificate(true); }}
                >
                  View
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Drag handle on right edge */}
        <div className="sidebar-drag-handle" onMouseDown={handleDragStart} />
      </aside>

      {/* Certificate modal */}
      {showCertificate && (
        <div className="cert-overlay" onClick={() => setShowCertificate(false)}>
          <div className="cert-modal" onClick={e => e.stopPropagation()}>
            <div className="cert-card">
              <div className="cert-border">
                <div className="cert-accent-top" />
                <p className="cert-heading">CERTIFICATE OF COMPLETION</p>
                <h2 className="cert-course-name">Neural Networks</h2>
                <p className="cert-subtitle">Building Neural Networks from Scratch</p>
                <p className="cert-congrats">
                  Congratulations! You&apos;ve completed all 20 modules, covering neural network
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
      <main className="course-main" style={sidebarOpen && !isMobile ? { marginLeft: sidebarWidth } : undefined}>
        <div className="course-content">
          <div className="step-header-section">
            <span className="step-label">{step.part === 0 ? '' : `Part ${step.part} · `}Module {currentStep}</span>
            <h1>{step.title}</h1>
          </div>

          <div className="step-body">
            <StepComponent />
          </div>

          {/* Bottom navigation */}
          <div className="step-footer" ref={footerRef}>
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
        <div className="top-bar" />
        <span className="top-bar-title" style={{ opacity: 0.3 }}>Neural Network Tutorial</span>
        <a href="/" className="home-btn" style={{ opacity: 0.3 }} aria-label="Home">
          <img src="/logo.png" alt="Home" className="home-logo" />
        </a>
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
