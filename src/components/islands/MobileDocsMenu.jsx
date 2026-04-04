import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronDown, ListTree } from 'lucide-react';

export default function MobileDocsMenu({ sections, groupedDocs, currentPath }) {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const normalizedCurrentPath = currentPath.endsWith('/') && currentPath.length > 1 
    ? currentPath.slice(0, -1) 
    : currentPath;

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex lg:hidden items-center gap-2 px-3 py-1.5 text-sm font-medium text-foreground/70 bg-foreground/5 rounded-full hover:text-foreground transition-colors"
        aria-label="Open Documentation Navigation"
      >
        <ListTree className="w-4 h-4" />
        Docs Menu
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-background/60 backdrop-blur-sm z-80"
              aria-hidden="true"
            />

            {/* Side Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-background border-r border-foreground/10 z-90 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-foreground/5">
                <div className="flex items-center gap-2 font-bold text-lg">
                  <ListTree className="w-5 h-5 text-primary" />
                  Documentation
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 -mr-2 text-foreground/50 hover:text-foreground transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {sections.map((section) => {
                    const sectionDocs = groupedDocs[section];
                    
                    if (section === 'root') {
                      return (
                        <ul key="root" className="space-y-1 list-none p-0">
                          {sectionDocs.map(doc => {
                            const docPath = `/docs/${doc.slug}`;
                            const isExact = normalizedCurrentPath === docPath;
                            return (
                              <li key={doc.slug}>
                                <a
                                  href={docPath}
                                  onClick={() => setIsOpen(false)}
                                  className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                                    isExact 
                                    ? "bg-primary/10 text-primary shadow-sm" 
                                    : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
                                  }`}
                                >
                                  <div className={`w-1.5 h-1.5 rounded-full ${isExact ? "bg-primary" : "bg-foreground/20"}`} />
                                  {doc.data.title}
                                </a>
                              </li>
                            )
                          })}
                        </ul>
                      );
                    }

                    const rawTitle = section.charAt(0).toUpperCase() + section.slice(1).replace(/-/g, ' ');
                    const isSectionActive = sectionDocs.some(doc => normalizedCurrentPath === `/docs/${doc.slug}`);
                    
                    return (
                      <div key={section} className="space-y-1">
                        <div className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-foreground/40">
                          {rawTitle}
                        </div>
                        <ul className="pl-4 border-l border-foreground/10 space-y-1 list-none m-0">
                          {sectionDocs.map(doc => {
                            const docPath = `/docs/${doc.slug}`;
                            const isExact = normalizedCurrentPath === docPath;
                            return (
                              <li key={doc.slug} className="relative">
                                {/* Visual branch connector */}
                                <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-3 h-px bg-foreground/10" />
                                
                                <a
                                  href={docPath}
                                  onClick={() => setIsOpen(false)}
                                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all ${
                                    isExact 
                                    ? "bg-primary/5 text-primary font-semibold" 
                                    : "text-foreground/60 hover:text-foreground hover:bg-foreground/5"
                                  }`}
                                >
                                  {doc.data.title}
                                </a>
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </nav>

              <div className="p-6 border-t border-foreground/5 bg-foreground/2">
                <a 
                  href="/docs/getting-started" 
                  className="flex items-center justify-center w-full px-4 py-3 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all text-sm"
                >
                  Quick Start Guide
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
