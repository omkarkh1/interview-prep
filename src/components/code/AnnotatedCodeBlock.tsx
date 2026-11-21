import { Check, Copy, Sparkles } from 'lucide-react';
import { Highlight, Prism, type PrismTheme } from 'prism-react-renderer';
import { useMemo, useState } from 'react';
import { useReaderState } from '@/hooks/useReaderState';
import { cn } from '@/lib/utils';
import type { CodeCallout } from '@/types/curriculum';

// Register a dedicated Java grammar extending Prism's clike grammar
if (!Prism.languages.java) {
  const javaLang = Prism.languages.extend('clike', {
    keyword:
      /\b(?:abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|exports|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|module|native|new|non-sealed|null|open|opens|package|permits|private|protected|provides|public|record|requires|return|sealed|short|static|strictfp|super|switch|synchronized|this|throw|throws|to|transient|transitive|try|uses|var|void|volatile|while|with|yield)\b/,
    number: /\b0b[01][01_]*L?\b|\b0x(?:[\da-f_]*\.?[\da-f_p+-]+)\b|(?:\b\d[\d_]*(?:\.[\d_]*)?|\B\.\d[\d_]*)(?:e[+-]?\d[\d_]*)?[dfl]?/i,
    operator: {
      pattern: /(^|[^.])(?:<<=?|>>>?=?|->|--|\+\+|&&|\|\||::|[?:~]|[-+*/%&|^!=<>]=?)/m,
      lookbehind: true,
    },
  });

  Prism.languages.insertBefore('java', 'string', {
    'triple-quoted-string': {
      pattern: /"""[ \t]*[\r\n](?:(?:"|"")?(?:\\.|[^"\\]))*"""/,
      greedy: true,
      alias: 'string',
    },
  });

  Prism.languages.insertBefore('java', 'class-name', {
    annotation: {
      pattern: /(^|[^.])@\w+(?:\s*\.\s*\w+)*/,
      lookbehind: true,
      alias: 'punctuation',
    },
    generics: {
      pattern: /<(?:[\w\s,.?]|&(?!&)|<(?:[\w\s,.?]|&(?!&)|<(?:[\w\s,.?]|&(?!&)|<[\w\s,.?]*>)*>)*>)*>/,
      inside: {
        'class-name': /\b[A-Z]\w*\b/,
        keyword: /\b(?:extends|super)\b/,
        punctuation: /[<>(),.?&]/,
      },
    },
  });

  Prism.languages.java = javaLang;
}

const EDITORIAL_DARK_THEME: PrismTheme = {
  plain: {
    color: '#dbe4f3',
    backgroundColor: 'transparent',
  },
  styles: [
    { types: ['comment', 'prolog', 'doctype', 'cdata'], style: { color: '#6b778d', fontStyle: 'italic' } },
    { types: ['punctuation'], style: { color: '#8f9bb3' } },
    { types: ['keyword', 'boolean'], style: { color: '#6cb2ff', fontWeight: '500' } },
    { types: ['class-name', 'builtin'], style: { color: '#f3c57a' } },
    { types: ['function'], style: { color: '#8ad8c0' } },
    { types: ['string', 'char', 'attr-value'], style: { color: '#a5d69b' } },
    { types: ['number', 'constant'], style: { color: '#f5a87a' } },
    { types: ['operator'], style: { color: '#9eb6d8' } },
    { types: ['annotation'], style: { color: '#e6b86a' } },
  ],
};

const EDITORIAL_LIGHT_THEME: PrismTheme = {
  plain: {
    color: '#1f2937',
    backgroundColor: 'transparent',
  },
  styles: [
    { types: ['comment', 'prolog', 'doctype', 'cdata'], style: { color: '#6b7280', fontStyle: 'italic' } },
    { types: ['punctuation'], style: { color: '#4b5563' } },
    { types: ['keyword', 'boolean'], style: { color: '#1d4ed8', fontWeight: '600' } },
    { types: ['class-name', 'builtin'], style: { color: '#9a5b00' } },
    { types: ['function'], style: { color: '#0f766e' } },
    { types: ['string', 'char', 'attr-value'], style: { color: '#15803d' } },
    { types: ['number', 'constant'], style: { color: '#c2410c' } },
    { types: ['operator'], style: { color: '#334155' } },
    { types: ['annotation'], style: { color: '#b45309' } },
  ],
};

const CALLOUT_STYLES = {
  primary: {
    lineBg: 'bg-blue-500/12 border-l-blue-500',
    badge: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30',
    cardActive: 'border-blue-500/50 bg-blue-500/8',
  },
  emerald: {
    lineBg: 'bg-emerald-500/12 border-l-emerald-500',
    badge: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
    cardActive: 'border-emerald-500/50 bg-emerald-500/8',
  },
  amber: {
    lineBg: 'bg-amber-500/12 border-l-amber-500',
    badge: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
    cardActive: 'border-amber-500/50 bg-amber-500/8',
  },
  rose: {
    lineBg: 'bg-rose-500/12 border-l-rose-500',
    badge: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30',
    cardActive: 'border-rose-500/50 bg-rose-500/8',
  },
} as const;

interface AnnotatedCodeBlockProps {
  filename: string;
  code: string;
  callouts: CodeCallout[];
  language?: string;
}

export function AnnotatedCodeBlock({
  filename,
  code,
  callouts,
  language = 'java',
}: AnnotatedCodeBlockProps) {
  const { theme } = useReaderState();
  const [selectedCalloutId, setSelectedCalloutId] = useState<string | null>(
    callouts[0]?.id ?? null,
  );
  const [copied, setCopied] = useState(false);

  const activeCallout = useMemo(
    () => callouts.find((c) => c.id === selectedCalloutId) ?? null,
    [callouts, selectedCalloutId],
  );

  // Map each 1-indexed line to the callouts covering it
  const lineToCallout = useMemo(() => {
    const map = new Map<number, CodeCallout>();
    for (const c of callouts) {
      for (let line = c.startLine; line <= c.endLine; line++) {
        map.set(line, c);
      }
    }
    return map;
  }, [callouts]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard unavailable in restricted context
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-3 border-b border-border bg-[var(--code-header-bg)] px-4 py-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="font-mono text-xs font-medium text-foreground truncate">{filename}</span>
          <span className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Read-Only · Java
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Main split: read-only annotated code + interactive key-line callout panel */}
      <div className={cn('grid grid-cols-1', callouts.length > 0 && 'lg:grid-cols-[minmax(0,1fr)_310px]')}>
        <div className="overflow-x-auto bg-[var(--code-bg)] py-3">
          <Highlight
            prism={Prism}
            theme={theme === 'dark' ? EDITORIAL_DARK_THEME : EDITORIAL_LIGHT_THEME}
            code={code.trimEnd()}
            language={language}
          >
            {({ tokens, getLineProps, getTokenProps }) => (
              <pre className="m-0 font-mono text-[12.5px] leading-[1.68]">
                {tokens.map((line, i) => {
                  const lineNumber = i + 1;
                  const covering = lineToCallout.get(lineNumber);
                  const isActiveLine =
                    activeCallout !== null &&
                    lineNumber >= activeCallout.startLine &&
                    lineNumber <= activeCallout.endLine;
                  const accent = (activeCallout?.accent ?? covering?.accent ?? 'primary') as keyof typeof CALLOUT_STYLES;
                  const lineProps = getLineProps({ line });

                  return (
                    <div
                      key={lineNumber}
                      {...lineProps}
                      onClick={() => {
                        if (covering) {
                          setSelectedCalloutId((prev) => (prev === covering.id ? null : covering.id));
                        }
                      }}
                      className={cn(
                        'flex items-stretch border-l-2 border-l-transparent px-3 transition-colors',
                        covering && 'cursor-pointer hover:bg-muted/40',
                        isActiveLine && CALLOUT_STYLES[accent].lineBg,
                      )}
                    >
                      <span className="mr-4 inline-block w-7 shrink-0 select-none text-right text-[11px] text-muted-foreground/65">
                        {lineNumber}
                      </span>
                      <span className="flex-1 whitespace-pre pr-4">
                        {line.map((token, key) => (
                          <span key={key} {...getTokenProps({ token })} />
                        ))}
                      </span>
                    </div>
                  );
                })}
              </pre>
            )}
          </Highlight>
        </div>

        {/* Key-line callouts sidebar */}
        {callouts.length > 0 && (
          <div className="border-t lg:border-t-0 lg:border-l border-border bg-surface p-3.5 flex flex-col gap-2.5">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span>Key-Line Annotations</span>
              </div>
              <span className="font-mono text-[10px] text-muted-foreground">Click to inspect</span>
            </div>

            <div className="flex flex-col gap-2">
              {callouts.map((callout, idx) => {
                const isSelected = callout.id === selectedCalloutId;
                const accent = callout.accent ?? 'primary';
                const rangeLabel =
                  callout.startLine === callout.endLine
                    ? `L${callout.startLine}`
                    : `L${callout.startLine}–${callout.endLine}`;

                return (
                  <button
                    key={callout.id}
                    type="button"
                    onClick={() => setSelectedCalloutId(isSelected ? null : callout.id)}
                    className={cn(
                      'w-full rounded-lg border p-2.5 text-left transition-all cursor-pointer',
                      isSelected
                        ? CALLOUT_STYLES[accent].cardActive
                        : 'border-border bg-card/70 hover:bg-card hover:border-border-strong',
                    )}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-semibold text-foreground leading-snug">
                        {idx + 1}. {callout.title}
                      </span>
                      <span
                        className={cn(
                          'shrink-0 rounded border px-1.5 py-0.5 font-mono text-[10px] font-medium',
                          CALLOUT_STYLES[accent].badge,
                        )}
                      >
                        {rangeLabel}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {callout.explanation}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
