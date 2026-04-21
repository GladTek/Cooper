import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import BrandIcon from '~/components/common/BrandIcon';
import * as Icons from 'lucide-react';
import { ACTION_LINKS } from '~/site.config';

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

interface MobileMenuProps {
  links: NavLink[];
  currentPath?: string;
  labels?: {
    menu: string;
    getStarted: string;
  };
}

export default function MobileMenu({ 
  links, 
  currentPath = '/',
  labels = {
    menu: 'Menu',
    getStarted: 'Get Started'
  }
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 text-foreground hover:bg-foreground/5 rounded-md transition-colors z-50 relative"
        aria-label="Open Mobile Menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? "mobile-menu-panel" : undefined}
      >
        <Menu className="w-6 h-6" aria-hidden="true" />
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
              className="fixed inset-0 bg-background/60 backdrop-blur-sm z-60"
              aria-hidden="true"
            />

            {/* Slide-out Panel / Full Screen Overlay */}
            <motion.div
              id="mobile-menu-panel"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile Navigation"
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-0 md:inset-auto md:top-0 md:right-0 md:w-96 bg-background md:border-l md:border-foreground/10 md:shadow-2xl z-70 p-6 flex flex-col h-dvh md:h-full"
            >
              <div className="flex justify-between items-center mb-6">
                <span className="text-2xl font-bold text-primary md:text-lg">{labels.menu}</span>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-foreground/70 hover:text-foreground rounded-full hover:bg-foreground/5 transition-colors"
                  aria-label="Close Mobile Menu"
                >
                  <X className="w-8 h-8 md:w-6 md:h-6" aria-hidden="true" />
                </button>
              </div>

              <nav className="flex-1 min-h-0 overflow-y-auto" aria-label="Mobile Menu Links">
                <ul className="flex flex-col gap-4 md:gap-2 m-0 p-0 list-none">
                  {links.map((link) => {
                    const isActive = (href: string) => {
                         if (href === '/') return currentPath === '/';
                         return currentPath.startsWith(href);
                    };
                    const isLinkActive = isActive(link.href || '') || (link.children && link.children.map(c => isActive(c.href)).some(Boolean));

                    return (
                    <li key={link.label}>
                      {link.children ? (
                          <div className="flex flex-col">
                               <div className={`flex items-center justify-between py-2 text-xl md:text-lg font-bold ${
                                   isLinkActive ? 'text-primary dark:text-blue-300' : 'text-foreground/80 dark:text-white'
                               }`}>
                                  {link.label}
                               </div>
                               <ul className="pl-4 flex flex-col gap-3 md:gap-2 border-l-2 border-foreground/10 ml-2 m-0 list-none">
                                  {link.children.map(child => {
                                      const Icon = child.icon ? (Icons as any)[child.icon] : null;
                                      return (
                                      <li key={child.href}>
                                        <a 
                                            href={child.href}
                                            onClick={() => setIsOpen(false)}
                                            className={`py-2 text-lg md:text-base transition-colors flex items-center gap-3 ${
                                                isActive(child.href) 
                                                ? 'text-primary dark:text-blue-300 font-medium' 
                                                : 'text-foreground hover:text-primary dark:text-white dark:hover:text-blue-300'
                                            }`}
                                        >
                                            {Icon && <Icon className="w-5 h-5 md:w-4 md:h-4" aria-hidden="true" />}
                                            {child.label}
                                        </a>
                                      </li>
                                  )})}
                               </ul>
                          </div>
                      ) : (
                          <a
                              href={link.href}
                              onClick={() => setIsOpen(false)}
                              className={`flex items-center justify-between py-2 text-xl md:text-lg font-bold transition-colors ${
                                  isActive(link.href || '') 
                                  ? 'text-primary dark:text-blue-300' 
                                  : 'text-foreground hover:text-primary dark:text-white dark:hover:text-blue-300'
                              }`}
                          >
                              {link.label}
                              <motion.span 
                                initial={{ x: -10, opacity: 0 }}
                                whileHover={{ x: 0, opacity: 1 }}
                                className="text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-hidden="true"
                              >
                                →
                              </motion.span>
                          </a>
                      )}
                    </li>
                  );})}
                </ul>
              </nav>

              <div className="pt-6 md:pt-8 border-t border-foreground/10 flex flex-col gap-4 mt-auto">
                 <a 
                    href={ACTION_LINKS.primary.href}
                    className="w-full py-3 px-4 bg-primary text-primary-foreground text-center font-semibold rounded-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25"
                  >
                    {labels.getStarted}
                  </a>
                  
                  <div className="flex justify-center gap-6 mt-4">
                     <a href={ACTION_LINKS.social.github} target="_blank" rel="noopener noreferrer" className="text-foreground/70 hover:text-primary transition-colors" aria-label="GitHub">
                        <BrandIcon icon="github" className="w-6 h-6" aria-hidden="true" />
                     </a>
                  </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
