import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import * as Icons from 'lucide-react';

interface NavChild {
  label: string;
  href: string;
  icon?: string;
  description?: string;
}

interface NavLink {
  label: string;
  href?: string;
  children?: NavChild[];
}

interface DesktopNavProps {
  links: NavLink[];
  currentPath?: string;
}

export default function DesktopNav({ links, currentPath = '/' }: DesktopNavProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const isActive = (href: string) => {
    if (href === '/') return currentPath === '/';
    return currentPath.startsWith(href);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setHoveredIndex(hoveredIndex === index ? null : index);
    } else if (e.key === 'Escape') {
      setHoveredIndex(null);
    }
  };

  return (
    <nav className="hidden md:flex items-center gap-6" onMouseLeave={() => setHoveredIndex(null)} aria-label="Main Navigation">
      <ul className="flex items-center gap-6 m-0 p-0 list-none">
        {links.map((link, index) => {
          const isLinkActive = isActive(link.href || '') || (link.children && link.children.some(child => isActive(child.href)));
          
          return (
          <li 
            key={link.label}
            className="relative"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {link.children ? (
              <button
                className={`flex items-center gap-1 text-sm font-medium transition-colors bg-transparent border-0 cursor-pointer p-0 ${
                  hoveredIndex === index || isLinkActive ? 'text-primary dark:text-blue-300' : 'text-foreground/70 hover:text-foreground dark:text-white dark:hover:text-blue-300'
                }`}
                aria-expanded={hoveredIndex === index}
                aria-haspopup="menu"
                aria-controls={hoveredIndex === index ? `dropdown-${index}` : undefined}
                onClick={() => setHoveredIndex(hoveredIndex === index ? null : index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              >
                {link.label}
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                  hoveredIndex === index ? 'rotate-180' : ''
                }`} aria-hidden="true" />
              </button>
            ) : (
                <a 
                    href={link.href}
                    className={`text-sm font-medium transition-colors ${
                        isLinkActive ? 'text-primary dark:text-blue-300' : 'text-foreground/70 hover:text-foreground dark:text-white dark:hover:text-blue-300'
                    }`}
                >
                    {link.label}
                </a>
            )}

            <AnimatePresence>
              {hoveredIndex === index && link.children && (
                <motion.div
                  id={`dropdown-${index}`}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute top-full left-0 pt-4 w-60 z-50"
                  role="menu"
                >
                   <div className="p-2 bg-background/95 backdrop-blur-xl border border-foreground/10 rounded-xl shadow-xl shadow-black/5 overflow-hidden">
                       <ul className="flex flex-col gap-1 m-0 p-0 list-none">
                         {link.children.map((child) => {
                           const Icon = child.icon ? (Icons as any)[child.icon] : null;
                           return (
                           <li key={child.href} role="none">
                             <a
                               href={child.href}
                               className="block px-4 py-3 text-sm rounded-lg hover:bg-foreground/5 transition-colors group"
                               role="menuitem"
                             >
                               <div className="flex items-center gap-3">
                                 {Icon && (
                                   <Icon className="w-5 h-5 text-primary/70 group-hover:text-primary dark:text-white/70 dark:group-hover:text-blue-300 transition-colors" aria-hidden="true" />
                                 )}
                                 <div>
                                   <div className="font-medium text-foreground group-hover:text-primary dark:text-white dark:group-hover:text-blue-300 transition-colors">
                                     {child.label}
                                   </div>
                                   {child.description && (
                                     <div className="text-xs text-foreground/50 mt-1 line-clamp-1">
                                       {child.description}
                                     </div>
                                   )}
                                 </div>
                               </div>
                             </a>
                           </li>
                         )})}
                       </ul>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
            );
        })}
      </ul>
    </nav>
  );
}
