import React from 'react';

// Lightweight markdown renderer for lesson content — zero dependencies.
// Supports: headings, fenced code blocks (with language label), lists,
// tables, blockquotes, hr, bold/italic/inline code/links, checkboxes.

interface MarkdownProps {
  source: string;
}

const renderInline = (text: string, keyPrefix: string): React.ReactNode[] => {
  const nodes: React.ReactNode[] = [];
  // Tokenize: inline code, bold, italic, links
  const pattern = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*]+\*)|(\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) {
      nodes.push(text.slice(last, match.index));
    }
    const token = match[0];
    const key = `${keyPrefix}-in-${i++}`;
    if (token.startsWith('`')) {
      nodes.push(
        <code key={key} className="px-1.5 py-0.5 rounded bg-slate-800/80 border border-slate-700/60 text-cyan-300 font-mono text-[0.85em]">
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith('**')) {
      nodes.push(<strong key={key} className="font-bold text-white">{renderInline(token.slice(2, -2), key)}</strong>);
    } else if (token.startsWith('*')) {
      nodes.push(<em key={key} className="italic text-slate-200">{token.slice(1, -1)}</em>);
    } else if (token.startsWith('[')) {
      const m = token.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (m) {
        nodes.push(
          <a key={key} href={m[2]} target="_blank" rel="noreferrer" className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 decoration-cyan-500/40">
            {m[1]}
          </a>
        );
      }
    }
    last = match.index + token.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
};

const LANGUAGE_LABELS: Record<string, string> = {
  typescript: 'TypeScript', javascript: 'JavaScript', python: 'Python',
  bash: 'Shell', sql: 'SQL', hcl: 'Terraform HCL', yaml: 'YAML',
  kotlin: 'Kotlin', dockerfile: 'Dockerfile', json: 'JSON', text: 'Plain Text',
};

export const Markdown: React.FC<MarkdownProps> = ({ source }) => {
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const blocks: React.ReactNode[] = [];
  let i = 0;
  let blockIdx = 0;

  const nextKey = () => `md-${blockIdx++}`;

  while (i < lines.length) {
    const line = lines[i];

    // Skip blank lines between blocks
    if (line.trim() === '') { i++; continue; }

    // Fenced code block
    if (line.trim().startsWith('```')) {
      const lang = line.trim().slice(3).trim().toLowerCase();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // closing fence
      blocks.push(
        <div key={nextKey()} className="my-4 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner">
          <div className="flex items-center justify-between px-4 py-1.5 bg-slate-900/80 border-b border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              {LANGUAGE_LABELS[lang] || lang || 'Code'}
            </span>
            <span className="flex space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-700" />
              <span className="w-2 h-2 rounded-full bg-slate-700" />
              <span className="w-2 h-2 rounded-full bg-cyan-500/60" />
            </span>
          </div>
          <pre className="p-4 overflow-x-auto text-[13px] leading-relaxed font-mono text-cyan-100/90">
            <code>{codeLines.join('\n')}</code>
          </pre>
        </div>
      );
      continue;
    }

    // Inline video embed:  @video[Caption](https://www.youtube.com/embed/ID)
    const videoMatch = line.trim().match(/^@video\[([^\]]*)\]\(([^)]+)\)$/);
    if (videoMatch) {
      const [, caption, url] = videoMatch;
      const key = nextKey();
      blocks.push(
        <figure key={key} className="my-6">
          <div className="relative w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-lg" style={{ paddingTop: '56.25%' }}>
            <iframe
              src={url}
              title={caption || 'Lesson video'}
              className="absolute inset-0 w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
          {caption && (
            <figcaption className="mt-2 text-center text-[11px] text-slate-500 italic flex items-center justify-center gap-1.5">
              <span className="inline-block w-3.5 h-3.5 rounded-full bg-rose-500/80 shrink-0" />
              {renderInline(caption, key + '-cap')}
            </figcaption>
          )}
        </figure>
      );
      i++;
      continue;
    }

    // Image / figure:  ![alt](src)  or  ![alt](src "caption")
    const imgMatch = line.trim().match(/^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)$/);
    if (imgMatch) {
      const [, alt, src, caption] = imgMatch;
      const isGif = /\.gif($|\?)/i.test(src);
      const key = nextKey();
      blocks.push(
        <figure key={key} className="my-6">
          <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900/40 shadow-lg">
            {isGif && (
              <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/80 border-b border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                  Screen Recording
                </span>
                <span className="text-[10px] text-slate-500">auto-playing walkthrough</span>
              </div>
            )}
            <img src={src} alt={alt} loading="lazy" className="w-full block" />
          </div>
          {(caption || alt) && (
            <figcaption className="mt-2 text-center text-[11px] text-slate-500 italic">
              {renderInline(caption || alt, key + '-cap')}
            </figcaption>
          )}
        </figure>
      );
      i++;
      continue;
    }

    // Headings
    const headingMatch = line.match(/^(#{1,4})\s+(.*)/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      const key = nextKey();
      if (level === 1) {
        blocks.push(
          <h1 key={key} className="text-2xl font-extrabold text-white font-display mt-2 mb-4 pb-3 border-b border-slate-800">
            {renderInline(text, key)}
          </h1>
        );
      } else if (level === 2) {
        blocks.push(
          <h2 key={key} className="text-lg font-bold text-cyan-300 font-display mt-8 mb-3 flex items-center">
            <span className="w-1 h-5 bg-gradient-to-b from-cyan-400 to-indigo-500 rounded-full mr-3 shrink-0" />
            {renderInline(text, key)}
          </h2>
        );
      } else {
        blocks.push(
          <h3 key={key} className="text-base font-bold text-white mt-6 mb-2">
            {renderInline(text, key)}
          </h3>
        );
      }
      i++;
      continue;
    }

    // Horizontal rule
    if (/^---+\s*$/.test(line.trim())) {
      blocks.push(<hr key={nextKey()} className="my-6 border-slate-800" />);
      i++;
      continue;
    }

    // Blockquote
    if (line.trim().startsWith('>')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ''));
        i++;
      }
      const key = nextKey();
      blocks.push(
        <blockquote key={key} className="my-4 pl-4 py-2.5 pr-4 border-l-4 border-amber-500/60 bg-amber-500/5 rounded-r-lg text-sm text-amber-100/90 italic">
          {renderInline(quoteLines.join(' '), key)}
        </blockquote>
      );
      continue;
    }

    // Table
    if (line.trim().startsWith('|') && i + 1 < lines.length && /^\|?[\s:|-]+\|?$/.test(lines[i + 1].trim())) {
      const parseRow = (row: string) => row.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim());
      const headers = parseRow(line);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        rows.push(parseRow(lines[i]));
        i++;
      }
      const key = nextKey();
      blocks.push(
        <div key={key} className="my-4 overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-900">
                {headers.map((h, hi) => (
                  <th key={hi} className="px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider text-cyan-400 border-b border-slate-800">
                    {renderInline(h, `${key}-h${hi}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, ri) => (
                <tr key={ri} className={ri % 2 ? 'bg-slate-900/40' : 'bg-slate-950/40'}>
                  {r.map((c, ci) => (
                    <td key={ci} className="px-4 py-2.5 text-slate-300 border-b border-slate-800/50 align-top">
                      {renderInline(c, `${key}-r${ri}c${ci}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // Lists (unordered, ordered, checkboxes)
    const listMatch = line.match(/^(\s*)([-*]|\d+\.)\s+(.*)/);
    if (listMatch) {
      const items: { marker: string; text: string }[] = [];
      while (i < lines.length) {
        const m = lines[i].match(/^(\s*)([-*]|\d+\.)\s+(.*)/);
        if (!m) break;
        items.push({ marker: m[2], text: m[3] });
        i++;
      }
      const ordered = /^\d+\./.test(items[0].marker);
      const key = nextKey();
      const ListTag = ordered ? 'ol' : 'ul';
      blocks.push(
        <ListTag key={key} className={`my-3 space-y-1.5 pl-1 ${ordered ? 'list-decimal list-inside' : ''}`}>
          {items.map((item, ii) => {
            const checkbox = item.text.match(/^\[([ x])\]\s+(.*)/);
            return (
              <li key={ii} className="flex items-start text-sm text-slate-300 leading-relaxed">
                {checkbox ? (
                  <span className={`mr-2 mt-0.5 w-4 h-4 shrink-0 rounded border flex items-center justify-center text-[10px] font-bold ${
                    checkbox[1] === 'x' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'border-slate-700 text-transparent'
                  }`}>✓</span>
                ) : !ordered ? (
                  <span className="mr-2.5 mt-[7px] w-1.5 h-1.5 shrink-0 rounded-full bg-cyan-500/70" />
                ) : null}
                <span>{renderInline(checkbox ? checkbox[2] : item.text, `${key}-li${ii}`)}</span>
              </li>
            );
          })}
        </ListTag>
      );
      continue;
    }

    // Paragraph (merge consecutive plain lines)
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].trim().startsWith('```') &&
      !lines[i].match(/^#{1,4}\s/) &&
      !lines[i].trim().startsWith('>') &&
      !lines[i].trim().startsWith('|') &&
      !lines[i].match(/^(\s*)([-*]|\d+\.)\s+/)
    ) {
      paraLines.push(lines[i].trim());
      i++;
    }
    if (paraLines.length > 0) {
      const key = nextKey();
      blocks.push(
        <p key={key} className="my-3 text-sm text-slate-300 leading-[1.75]">
          {renderInline(paraLines.join(' '), key)}
        </p>
      );
    }
  }

  return <div className="markdown-body">{blocks}</div>;
};
