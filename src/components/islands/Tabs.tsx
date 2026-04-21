import { useState, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsProps {
  items: TabItem[];
  defaultValue?: string;
  className?: string;
}

export default function Tabs({ items, defaultValue, className }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue || items[0]?.id);

  return (
    <div className={cn("w-full", className)}>
      <div className="flex space-x-1 rounded-xl bg-gray-100 dark:bg-white/5 p-1 mb-6 max-w-fit">
        {items.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "relative rounded-lg px-3 py-1.5 text-sm font-medium outline-none transition-colors focus-visible:ring-2",
              activeTab === tab.id
                ? "text-primary dark:text-white"
                : "text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-white/5"
            )}
            style={{
              WebkitTapHighlightColor: "transparent",
            }}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 bg-white dark:bg-white/10 shadow-sm rounded-lg"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-2">
        {items.map((tab) => (
          tab.id === activeTab && (
            <motion.div
              key={tab.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="rounded-xl border border-black/5 dark:border-white/10 bg-white dark:bg-white/5 p-6 shadow-sm backdrop-blur-sm"
            >
              {tab.content}
            </motion.div>
          )
        ))}
      </div>
    </div>
  );
}
