import { useState, type ReactNode } from 'react';
import { Code, Eye } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ComponentPreviewProps {
  code: string;
  children: ReactNode;
}

const ComponentPreview = ({ code, children }: ComponentPreviewProps) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');

  return (
    <div className="relative my-4 flex flex-col space-y-2 lg:max-w-[120ch]">
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center rounded-lg bg-black/5 p-1 dark:bg-white/5">
          <button
            onClick={() => setActiveTab('preview')}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              activeTab === 'preview'
                ? "bg-white text-black shadow-sm dark:bg-zinc-800 dark:text-white"
                : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5"
            )}
          >
            <Eye className="h-4 w-4" />
            Preview
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              activeTab === 'code'
                ? "bg-white text-black shadow-sm dark:bg-zinc-800 dark:text-white"
                : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5"
            )}
          >
            <Code className="h-4 w-4" />
            Code
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-black/5 bg-background dark:border-white/10">
        {activeTab === 'preview' ? (
          <div className="preview flex min-h-[350px] w-full items-center justify-center p-10">
            <div className="w-full">
              {children}
            </div>
          </div>
        ) : (
          <div className="w-full overflow-hidden rounded-xl bg-zinc-950 p-4">
            <pre className="overflow-x-auto p-4 text-sm text-white">
              <code className="language-astro">{code}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComponentPreview;
