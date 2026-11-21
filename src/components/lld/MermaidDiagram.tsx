import { Maximize2, Minus, Plus, RotateCcw } from 'lucide-react';
import mermaid from 'mermaid';
import { useEffect, useId, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useReaderState } from '@/hooks/useReaderState';

let renderCounter = 0;

interface MermaidDiagramProps {
  title: string;
  caption?: string;
  chart: string;
  testId?: string;
}

export function MermaidDiagram({ title, caption, chart, testId }: MermaidDiagramProps) {
  const { theme } = useReaderState();
  const baseId = useId().replace(/:/g, '');
  const [svgMarkup, setSvgMarkup] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [expanded, setExpanded] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;

    async function renderChart() {
      try {
        if (document.fonts?.ready) {
          await document.fonts.ready;
        }
        const isDark = theme === 'dark';
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'loose',
          theme: 'base',
          htmlLabels: false,
          fontFamily: '"Inter Variable", Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          themeVariables: isDark
            ? {
                darkMode: true,
                background: '#0e1218',
                primaryColor: '#161d29',
                primaryTextColor: '#eceff4',
                primaryBorderColor: '#4f8ff7',
                secondaryColor: '#131922',
                secondaryTextColor: '#dce3ee',
                secondaryBorderColor: '#334155',
                tertiaryColor: '#192130',
                tertiaryTextColor: '#dce3ee',
                lineColor: '#7c8ea6',
                textColor: '#eceff4',
                mainBkg: '#161d29',
                nodeBorder: '#4f8ff7',
                clusterBkg: '#111620',
                clusterBorder: '#334155',
                actorBkg: '#161d29',
                actorBorder: '#4f8ff7',
                actorTextColor: '#eceff4',
                actorLineColor: '#475569',
                signalColor: '#cbd5e1',
                signalTextColor: '#eceff4',
                labelBoxBkgColor: '#161d29',
                labelBoxBorderColor: '#334155',
                labelTextColor: '#eceff4',
                noteBkgColor: '#1e293b',
                noteBorderColor: '#4f8ff7',
                noteTextColor: '#e2e8f0',
                activationBkgColor: '#1e3a5f',
                activationBorderColor: '#60a5fa',
                classText: '#eceff4',
              }
            : {
                darkMode: false,
                background: '#ffffff',
                primaryColor: '#f8fafc',
                primaryTextColor: '#0f172a',
                primaryBorderColor: '#2563eb',
                secondaryColor: '#f1f5f9',
                secondaryTextColor: '#1e293b',
                secondaryBorderColor: '#cbd5e1',
                tertiaryColor: '#eff6ff',
                tertiaryTextColor: '#1e293b',
                lineColor: '#475569',
                textColor: '#0f172a',
                mainBkg: '#f8fafc',
                nodeBorder: '#2563eb',
                clusterBkg: '#f8fafc',
                clusterBorder: '#cbd5e1',
                actorBkg: '#f8fafc',
                actorBorder: '#2563eb',
                actorTextColor: '#0f172a',
                actorLineColor: '#94a3b8',
                signalColor: '#334155',
                signalTextColor: '#0f172a',
                labelBoxBkgColor: '#ffffff',
                labelBoxBorderColor: '#cbd5e1',
                labelTextColor: '#0f172a',
                noteBkgColor: '#eff6ff',
                noteBorderColor: '#3b82f6',
                noteTextColor: '#1e293b',
                activationBkgColor: '#dbeafe',
                activationBorderColor: '#2563eb',
                classText: '#0f172a',
              },
          class: {
            useMaxWidth: true,
            htmlLabels: false,
          },
          sequence: {
            useMaxWidth: true,
            mirrorActors: false,
            messageMargin: 34,
            boxMargin: 12,
          },
        });

        renderCounter += 1;
        const uniqueId = `mmd-${baseId}-${renderCounter}`;
        const { svg } = await mermaid.render(uniqueId, chart.trim());

        if (!cancelled) {
          setSvgMarkup(svg);
          setErrorMsg(null);
        }
      } catch (err) {
        if (!cancelled) {
          setErrorMsg(err instanceof Error ? err.message : 'Failed to render Mermaid diagram');
          setSvgMarkup('');
        }
      }
    }

    renderChart();
    return () => {
      cancelled = true;
    };
  }, [chart, theme, baseId]);

  return (
    <div
      className="rounded-xl border border-border bg-card overflow-hidden"
      data-testid={testId ?? 'mermaid-diagram'}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-surface px-4 py-2.5">
        <div>
          <h4 className="text-xs font-semibold text-foreground">{title}</h4>
          {caption && <p className="text-[11px] text-muted-foreground mt-0.5">{caption}</p>}
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setZoom((z) => Math.max(0.65, Number((z - 0.15).toFixed(2))))}
            aria-label="Zoom out diagram"
            title="Zoom out"
          >
            <Minus className="h-3.5 w-3.5" />
          </Button>
          <span className="w-11 text-center font-mono text-[11px] text-muted-foreground select-none">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setZoom((z) => Math.min(1.75, Number((z + 0.15).toFixed(2))))}
            aria-label="Zoom in diagram"
            title="Zoom in"
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setZoom(1)}
            aria-label="Reset zoom"
            title="Reset zoom"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            size="xs"
            onClick={() => setExpanded(true)}
            className="ml-1"
            aria-label="Expand diagram"
          >
            <Maximize2 className="h-3 w-3" />
            <span>Expand</span>
          </Button>
        </div>
      </div>

      {/* Rendered SVG viewport */}
      <div className="overflow-auto bg-[var(--code-bg)] p-4 sm:p-6 min-h-[240px] flex items-center justify-center">
        {errorMsg ? (
          <div
            role="alert"
            className="rounded-lg border border-rose-500/40 bg-rose-500/10 p-4 font-mono text-xs text-rose-500 max-w-xl"
          >
            Mermaid render error: {errorMsg}
          </div>
        ) : svgMarkup ? (
          <div
            className="mermaid-host w-full transition-transform origin-top"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
            dangerouslySetInnerHTML={{ __html: svgMarkup }}
          />
        ) : (
          <div className="font-mono text-xs text-muted-foreground">Rendering diagram…</div>
        )}
      </div>

      {/* Fullscreen Modal */}
      <Dialog open={expanded} onOpenChange={setExpanded}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {caption && <DialogDescription>{caption}</DialogDescription>}
          </DialogHeader>
          <div className="overflow-auto bg-[var(--code-bg)] p-6 flex-1 min-h-[60vh]">
            {svgMarkup && (
              <div
                className="mermaid-host w-full"
                dangerouslySetInnerHTML={{ __html: svgMarkup }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
