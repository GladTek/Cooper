import type { Facebook } from "lucide-react";

export const siteConfig = {
  name: 'Cooper',
  description: 'Premium Astro Boilerplate for explorers.',
  logo: {
    src: '/logo.svg',
    srcDark: '/logo.svg',       // Used when strategy is 'switch'
    alt: 'Cooper Logo',
    strategy: 'invert' as 'invert' | 'switch' | 'static', // 'invert' | 'switch' | 'static'
  },
  ogImage: '/og-image.webp',
  primaryColor: '#00008B', // Default primary color
  search: {
    enabled: true,
  },
  announcement: {
    enabled: true,
    id: 'upgrade_v1_1_0', // Change this ID to reshow the banner
    link: '/changelog',
    localizeLink: true, // Set to true to apply i18n routing to the link, false for external/absolute links
  },
  blog: {
    postsPerPage: 6,
  },
  contact: {
    email: {
      support: 'support@interstellar.com',
      sales: 'sales@interstellar.com',
    },
    phone: {
      main: '+1 (555) 123-4567',
      label: 'Mon-Fri 9am-6pm PST'
    },
    address: {
      city: 'Endurance',
      full: 'Interstellar Space Station'
    }
  },
  analytics: {
    alwaysLoad: false, // Set to true to bypass cookie consent check
    vendors: {
      googleAnalytics: {
        id: 'G-XXXXXXXXXX', // e.g. 'G-XXXXXXXXXX'
        enabled: false,
      },
      rybbit: {
        id: "your-site-id", // e.g. 'your-site-id'
        src: 'https://analytics.gladtek.cloud/api/script.js', // Default source
        enabled: false,
      },
      umami: {
        id: "your-website-id", // e.g. 'your-website-id'
        src: 'https://analytics.umami.is/script.js', // Default source
        enabled: false,
      },
      // Add other vendors here (e.g. Plausible, Fathom)
    },
  },
  dateOptions: {
    localeMapping: {
        'ar': 'ar-TN', // Force Maghreb Arabic date format (e.g., جانفي instead of يناير)
        'en': 'en-GB', // Example: Force UK English date format
    }
  }
};

export const NAV_LINKS = [
  { 
    href: '/features', 
    label: 'Product',
    children: [
        { href: '/features', label: 'Features', description: 'What makes us different', icon: 'Zap' },
        { href: '/pricing', label: 'Pricing', description: 'Plans for every team', icon: 'CreditCard' },
    ]
  },
  { 
    href: '/docs', 
    label: 'Resources',
    children: [
        { href: '/docs/getting-started', label: 'Docs', description: 'Start building today', icon: 'Book', localize: false },
        { href: '/blog', label: 'Blog', description: 'Latest updates & guides', icon: 'Newspaper' },
        { href: '/changelog', label: 'Changelog', description: 'New features & fixes', icon: 'FileClock' },
    ]
  },
  { 
    href: '/portfolio', 
    label: 'Work',
    children: [
        { href: '/portfolio', label: 'All Projects', description: 'Our complete portfolio', icon: 'LayoutGrid' },
        { href: '/design', label: 'Design System', description: 'Style guide & tokens', icon: 'Palette' },
    ]
  },
  { 
    href: '/about', 
    label: 'Company',
    children: [
        { href: '/about', label: 'About', description: 'Our story & mission', icon: 'Building2' },
        { href: '/contact', label: 'Contact', description: 'Get in touch with us', icon: 'Mail' },
    ]
  },
];

export const ACTION_LINKS = {
  primary: { label: 'Get Started', href: '/docs/getting-started' },
  social: { 
    twitter: 'https://twitter.com/gladtek',
    linkedin: 'https://linkedin.com/company/gladtek',
    github: 'https://github.com/gladtek',
    youtube: 'https://youtube.com/@gladtek',
    facebook: 'https://facebook.com/gladtek'
    
  }
};

export const FOOTER_LINKS = {
  product: {
    title: 'Product',
    links: [
      { href: '/features', label: 'Features' },
      { href: '/about', label: 'About' },
      { href: '/pricing', label: 'Pricing' },
      { href: '/changelog', label: 'Changelog' },
    ],
  },
  legal: {
    title: 'Legal',
    links: [
      { href: '/privacy', label: 'Privacy', localize: false },
      { href: '/terms', label: 'Terms', localize: false }
    ],
  },
};
