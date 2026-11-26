import { ReactNode } from 'react';

/**
 * Safely parses inline markdown formatting (**bold**, *italic*, `code`) into React elements
 * without utilizing `dangerouslySetInnerHTML`, ensuring zero XSS exposure.
 */
export function renderInlineMarkdown(text: string): ReactNode[] {
  // Regex splitting by bold (**...**), italic (*...*), or inline code (`...`)
  const tokenRegex = /(\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return (
        <strong key={`b-${index}`} className="font-bold text-slate-900 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      return (
        <em key={`i-${index}`} className="italic">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code
          key={`c-${index}`}
          className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-mono text-[11px] text-emerald-800 dark:text-emerald-300"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={`t-${index}`}>{part}</span>;
  });
}

/**
 * Parses multi-line markdown text into structured semantic React elements.
 * Supports headers (###, ####), lists (- or numbers), blockquotes, horizontal rules, and paragraphs.
 */
export function SafeMarkdownRenderer({ content }: { content: string }): ReactNode {
  const lines = content.split('\n');

  return (
    <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();

        if (trimmed === '') {
          return <div key={`empty-${lineIdx}`} className="h-1" />;
        }

        if (trimmed === '---') {
          return <hr key={`hr-${lineIdx}`} className="my-2 border-slate-200 dark:border-slate-800" />;
        }

        if (trimmed.startsWith('### ')) {
          return (
            <h3
              key={`h3-${lineIdx}`}
              className="text-sm font-black text-slate-900 dark:text-white mt-3 mb-1"
            >
              {renderInlineMarkdown(trimmed.slice(4))}
            </h3>
          );
        }

        if (trimmed.startsWith('#### ')) {
          return (
            <h4
              key={`h4-${lineIdx}`}
              className="text-xs font-bold text-emerald-800 dark:text-emerald-400 mt-2 mb-1 uppercase tracking-wider"
            >
              {renderInlineMarkdown(trimmed.slice(5))}
            </h4>
          );
        }

        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <div key={`li-${lineIdx}`} className="flex items-start space-x-2 ml-3 my-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <span>{renderInlineMarkdown(trimmed.slice(2))}</span>
            </div>
          );
        }

        if (/^\d+\.\s/.test(trimmed)) {
          const match = trimmed.match(/^(\d+)\.\s(.*)$/);
          const num = match ? match[1] : '•';
          const rest = match ? match[2] : trimmed;
          return (
            <div key={`num-${lineIdx}`} className="flex items-start space-x-2 ml-3 my-0.5">
              <span className="font-bold text-emerald-600 shrink-0">{num}.</span>
              <span>{renderInlineMarkdown(rest)}</span>
            </div>
          );
        }

        return (
          <p key={`p-${lineIdx}`} className="my-1 leading-relaxed">
            {renderInlineMarkdown(line)}
          </p>
        );
      })}
    </div>
  );
}
