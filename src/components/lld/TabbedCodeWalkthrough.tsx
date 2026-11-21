import { FileCode2 } from 'lucide-react';
import { AnnotatedCodeBlock } from '@/components/code/AnnotatedCodeBlock';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { LldCodeFile } from '@/types/curriculum';

interface TabbedCodeWalkthroughProps {
  files: LldCodeFile[];
}

export function TabbedCodeWalkthrough({ files }: TabbedCodeWalkthroughProps) {
  if (files.length === 0) return null;

  return (
    <Tabs defaultValue={files[0].filename} className="w-full">
      <div className="overflow-x-auto pb-1">
        <TabsList className="w-max min-w-full justify-start">
          {files.map((file) => (
            <TabsTrigger key={file.filename} value={file.filename} className="font-mono text-[11.5px]">
              <FileCode2 className="h-3.5 w-3.5 opacity-75" />
              <span>{file.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {files.map((file) => (
        <TabsContent key={file.filename} value={file.filename} className="space-y-3">
          <p className="text-xs leading-relaxed text-muted-foreground px-0.5">{file.summary}</p>
          <AnnotatedCodeBlock
            filename={file.filename}
            code={file.code}
            callouts={file.callouts}
            language="java"
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}
