'use client';

import { Suspense, useEffect, useMemo, useState, type ComponentType } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  PRINTABLE_COURSES,
  PRINTABLE_CATEGORIES,
  getPrintableCourse,
  type PrintableCourse,
} from '@/lib/courseRegistry';

// ─── Course picker ──────────────────────────────────────────────────────────
function CoursePicker({ onSelect }: { onSelect: (slug: string) => void }) {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();

  const groups = useMemo(
    () =>
      PRINTABLE_CATEGORIES.map(category => ({
        category,
        courses: PRINTABLE_COURSES.filter(
          c => c.category === category && (!q || c.name.toLowerCase().includes(q)),
        ),
      })).filter(g => g.courses.length > 0),
    [q],
  );

  return (
    <div style={{ maxWidth: 820, margin: '0 auto', padding: '56px 24px 80px' }}>
      <Link href="/" style={{ fontSize: 14, color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}>← Home</Link>

      <h1 style={{ fontSize: 28, fontWeight: 600, color: '#222', margin: '20px 0 8px' }}>
        Download a course as PDF
      </h1>
      <p style={{ fontSize: 16, color: '#444', lineHeight: 1.6, margin: '0 0 24px', maxWidth: 620 }}>
        Pick a course below to lay out every module as one printable document. Then hit{' '}
        <strong>Save as PDF</strong> — perfect for printing and marking up by hand.
      </p>

      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search courses…"
        style={{
          width: '100%', maxWidth: 360, padding: '10px 14px', fontSize: 15,
          border: '1px solid #cbd5e1', borderRadius: 8, marginBottom: 32,
        }}
      />

      {groups.map(group => (
        <div key={group.category} style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, margin: '0 0 12px' }}>
            {group.category}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
            {group.courses.map(course => (
              <button
                key={course.slug}
                onClick={() => onSelect(course.slug)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                  padding: '16px 18px', background: '#f9fafb', border: '1px solid #e5e7eb',
                  borderRadius: 8, cursor: 'pointer', textAlign: 'left', color: 'inherit',
                }}
              >
                <span style={{ fontSize: 15, fontWeight: 600, color: '#222' }}>{course.name}</span>
                <span style={{ fontSize: 12, color: '#888', whiteSpace: 'nowrap' }}>{course.steps.length} modules →</span>
              </button>
            ))}
          </div>
        </div>
      ))}

      {groups.length === 0 && (
        <p style={{ fontSize: 15, color: '#888' }}>No courses match &ldquo;{query}&rdquo;.</p>
      )}
    </div>
  );
}

// ─── Print document ─────────────────────────────────────────────────────────
type LoadedStep = { id: number; title: string; part: number; Comp: ComponentType };

function CourseDocument({ course, onBack }: { course: PrintableCourse; onBack: () => void }) {
  const [steps, setSteps] = useState<LoadedStep[] | null>(null);
  const [loadedCount, setLoadedCount] = useState(0);
  const [failed, setFailed] = useState(false);

  // Load every step component up front so window.print() captures the whole course.
  // CourseDocument is keyed by slug in the parent, so it remounts fresh per course —
  // no need to reset state here.
  useEffect(() => {
    let cancelled = false;

    Promise.all(
      course.steps.map(s =>
        course
          .load(s.id)
          .then(mod => {
            if (!cancelled) setLoadedCount(c => c + 1);
            return { id: s.id, title: s.title, part: s.part, Comp: mod.default };
          }),
      ),
    )
      .then(loaded => { if (!cancelled) setSteps(loaded); })
      .catch(() => { if (!cancelled) setFailed(true); });

    return () => { cancelled = true; };
  }, [course]);

  // Make the saved-PDF filename default to the course name.
  useEffect(() => {
    const prev = document.title;
    document.title = `${course.name} — codewithasher`;
    return () => { document.title = prev; };
  }, [course]);

  const ready = steps !== null;
  const total = course.steps.length;

  return (
    <div style={{ background: '#e9eaee', minHeight: '100vh' }}>
      {/* Toolbar — never printed */}
      <div
        className="no-print"
        style={{
          position: 'sticky', top: 0, zIndex: 10, display: 'flex', alignItems: 'center',
          gap: 16, padding: '12px 20px', background: '#fff', borderBottom: '1px solid #e5e7eb',
        }}
      >
        <button
          onClick={onBack}
          style={{ fontSize: 14, color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}
        >
          ← All courses
        </button>
        <span style={{ fontSize: 14, fontWeight: 600, color: '#222', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {course.name}
        </span>
        <span style={{ fontSize: 12, color: '#888', whiteSpace: 'nowrap' }}>
          {ready ? `${total} modules ready` : failed ? 'Failed to load' : `Loading ${loadedCount}/${total}…`}
        </span>
        <button
          onClick={() => window.print()}
          disabled={!ready}
          style={{
            padding: '9px 18px', fontSize: 14, fontWeight: 600, borderRadius: 8, border: 'none',
            color: '#fff', background: ready ? '#2563eb' : '#9cb6f0',
            cursor: ready ? 'pointer' : 'default', whiteSpace: 'nowrap',
          }}
        >
          Save as PDF
        </button>
      </div>

      <p className="no-print" style={{ textAlign: 'center', fontSize: 13, color: '#64748b', margin: '12px 20px 0' }}>
        Tip: in the print dialog, set the destination to <strong>&ldquo;Save as PDF.&rdquo;</strong> Each module starts on its own page so you have room to scribble.
      </p>

      {/* The printable document */}
      <div
        className="pdf-doc"
        style={{
          maxWidth: 760, margin: '24px auto 60px', background: '#fff', padding: '56px 56px 72px',
          boxShadow: '0 1px 6px rgba(0,0,0,0.12)', color: '#222',
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        {/* Cover */}
        <header className="pdf-cover" style={{ borderBottom: '2px solid #222', paddingBottom: 28, marginBottom: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#2563eb', textTransform: 'uppercase', letterSpacing: 1.5 }}>
            codewithasher
          </div>
          <h1 style={{ fontSize: 38, fontWeight: 700, color: '#111', margin: '14px 0 6px', lineHeight: 1.15 }}>
            {course.name}
          </h1>
          <div style={{ fontSize: 15, color: '#64748b' }}>
            {course.category} · {total} modules
          </div>
          <div style={{ display: 'flex', gap: 40, marginTop: 36, fontSize: 14, color: '#94a3b8' }}>
            <span>Name: ______________________</span>
            <span>Date: ______________</span>
          </div>
        </header>

        {!ready && (
          <p style={{ fontSize: 15, color: '#888', padding: '40px 0' }}>
            {failed ? 'Something went wrong loading this course. Try going back and selecting it again.' : `Loading modules… (${loadedCount}/${total})`}
          </p>
        )}

        {ready &&
          steps!.map((s, i) => {
            const partChanged = i === 0 || s.part !== steps![i - 1].part;
            const Comp = s.Comp;
            return (
              <section key={s.id} className="pdf-module" style={{ paddingTop: 8 }}>
                {partChanged && course.partNames[s.part] && (
                  <div className="pdf-part" style={{ fontSize: 12, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 6px' }}>
                    {course.partNames[s.part]}
                  </div>
                )}
                <h2 className="pdf-module-head" style={{ fontSize: 26, fontWeight: 700, color: '#111', margin: '0 0 20px', paddingBottom: 10, borderBottom: '1px solid #e5e7eb' }}>
                  <span style={{ color: '#94a3b8' }}>{s.id}.</span> {s.title}
                </h2>
                <Comp />
              </section>
            );
          })}
      </div>
    </div>
  );
}

// ─── Page shell ───────────────────────────────────────────────────────────────
function DownloadInner() {
  const searchParams = useSearchParams();
  const initial = searchParams.get('course');
  const [slug, setSlug] = useState<string | null>(
    initial && getPrintableCourse(initial) ? initial : null,
  );

  // Keep the URL in sync so a chosen course is shareable / refresh-safe.
  useEffect(() => {
    const url = new URL(window.location.href);
    if (slug) url.searchParams.set('course', slug);
    else url.searchParams.delete('course');
    window.history.replaceState(null, '', url);
  }, [slug]);

  const course = slug ? getPrintableCourse(slug) : undefined;

  if (!course) {
    return (
      <div style={{ minHeight: '100vh', background: '#fff' }}>
        <CoursePicker onSelect={setSlug} />
      </div>
    );
  }

  return <CourseDocument key={course.slug} course={course} onBack={() => setSlug(null)} />;
}

export default function DownloadPage() {
  return (
    <Suspense fallback={<div style={{ padding: 56, fontFamily: 'sans-serif', color: '#888' }}>Loading…</div>}>
      <DownloadInner />
    </Suspense>
  );
}
