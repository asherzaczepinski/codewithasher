'use client';

import React from 'react';

/**
 * CodeBlock — a READ-ONLY, syntax-highlighted Python code display.
 *
 * This is intentionally NOT editable and does NOT run anything. It exists purely
 * to *show* learners what the concept looks like as real, well-commented code.
 * Pass the source as a template-literal string:
 *
 *   <CodeBlock filename="neuron.py" code={`...python...`} />
 *
 * Highlighting is light-theme (GitHub-like) and comments are emphasized, since
 * the comments are where the teaching happens.
 */

interface CodeBlockProps {
  /** Source code (Python). Pass as a template literal. */
  code: string;
  /** Optional filename shown in the header bar, e.g. "neuron.py". */
  filename?: string;
  /** Optional one-line caption shown under the block. */
  caption?: string;
}

const COLORS = {
  default: '#1f2328',
  comment: '#0a7b34', // green — comments stand out on purpose
  keyword: '#cf222e', // red
  string: '#0a3069', // dark blue
  number: '#0550ae', // blue
  func: '#8250df', // purple (calls / definitions)
  constant: '#0550ae',
};

const KEYWORDS = new Set([
  'def', 'return', 'if', 'elif', 'else', 'for', 'while', 'in', 'not', 'and', 'or',
  'import', 'from', 'as', 'class', 'with', 'lambda', 'break', 'continue', 'pass',
  'yield', 'global', 'nonlocal', 'assert', 'try', 'except', 'finally', 'raise',
  'is', 'del', 'await', 'async',
]);

const CONSTANTS = new Set(['True', 'False', 'None', 'self', 'cls']);

// Split a single line into [codePart, commentPart] respecting string literals,
// so a "#" inside a string is not treated as the start of a comment.
function splitComment(line: string): [string, string | null] {
  let inStr: string | null = null;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inStr) {
      if (ch === '\\') { i++; continue; }
      if (ch === inStr) inStr = null;
    } else if (ch === '"' || ch === "'") {
      inStr = ch;
    } else if (ch === '#') {
      return [line.slice(0, i), line.slice(i)];
    }
  }
  return [line, null];
}

// Tokenize the (comment-free) code portion of a line into colored spans.
const TOKEN_RE = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(\d+\.?\d*)|([A-Za-z_]\w*)|(\s+)|([^\s\w])/g;

function highlightCode(code: string, keyPrefix: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let m: RegExpExecArray | null;
  let idx = 0;
  TOKEN_RE.lastIndex = 0;
  while ((m = TOKEN_RE.exec(code)) !== null) {
    const [tok, str, num, ident, ws] = m;
    if (str) {
      out.push(<span key={`${keyPrefix}-${idx}`} style={{ color: COLORS.string }}>{tok}</span>);
    } else if (num) {
      out.push(<span key={`${keyPrefix}-${idx}`} style={{ color: COLORS.number }}>{tok}</span>);
    } else if (ws) {
      out.push(tok);
    } else if (ident) {
      let color = COLORS.default;
      if (KEYWORDS.has(ident)) color = COLORS.keyword;
      else if (CONSTANTS.has(ident)) color = COLORS.constant;
      else {
        // function call / definition: identifier immediately followed by "("
        const after = code.slice(m.index + ident.length);
        if (/^\s*\(/.test(after)) color = COLORS.func;
      }
      out.push(
        color === COLORS.default
          ? tok
          : <span key={`${keyPrefix}-${idx}`} style={{ color }}>{tok}</span>
      );
    } else {
      out.push(tok);
    }
    idx++;
  }
  return out;
}

export default function CodeBlock({ code, filename, caption }: CodeBlockProps) {
  const lines = code.replace(/\n$/, '').split('\n');

  return (
    <div className="code-block">
      <div className="code-block-header">
        <span className="code-block-dots" aria-hidden="true">
          <span style={{ background: '#ff5f56' }} />
          <span style={{ background: '#ffbd2e' }} />
          <span style={{ background: '#27c93f' }} />
        </span>
        {filename && <span className="code-block-filename">{filename}</span>}
        <span className="code-block-lang">Python</span>
      </div>
      <pre className="code-block-body">
        <code>
          {lines.map((line, i) => {
            const [codePart, commentPart] = splitComment(line);
            return (
              <span key={i} className="code-block-line">
                {highlightCode(codePart, `l${i}`)}
                {commentPart !== null && (
                  <span style={{ color: COLORS.comment, fontStyle: 'italic' }}>{commentPart}</span>
                )}
                {'\n'}
              </span>
            );
          })}
        </code>
      </pre>
      {caption && <p className="code-block-caption">{caption}</p>}
    </div>
  );
}
