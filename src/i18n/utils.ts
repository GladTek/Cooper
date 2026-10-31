import { ui, defaultLang, languages } from './ui';

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function useTranslations(lang: string | undefined) {
  const translations = (lang && lang in ui ? ui[lang as keyof typeof ui] : ui[defaultLang]) as typeof ui[typeof defaultLang];

  return new Proxy(translations, {
    get(target, prop) {
      if (prop in target) {
        return target[prop as keyof typeof target];
      }
      return `{${String(prop)}}`;
    }
  });
}

export const RTL_LOCALES = ['ar', 'he', 'fa', 'ur'];

export function isRtl(lang: string): boolean {
  return RTL_LOCALES.includes(lang);
}

const DEFAULT_LOCALE_ORDER = ['en', 'ar', 'fr', 'de'];

export interface HreflangLink {
  lang: string;
  href: string;
}

export function getHreflangLinks(
  pathname: string,
  site?: URL | string,
  availableLangs?: string[]
): HreflangLink[] {
  const configuredLangs = Object.keys(languages);
  const orderedLangs = [
    ...DEFAULT_LOCALE_ORDER.filter((lang) => configuredLangs.includes(lang)),
    ...configuredLangs.filter((lang) => !DEFAULT_LOCALE_ORDER.includes(lang)),
  ];

  const langs = availableLangs
    ? [...new Set(availableLangs)].filter((lang) => configuredLangs.includes(lang))
    : orderedLangs;

  if (langs.length <= 1) {
    return [];
  }

  const normalizedPathname = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const langKeys = configuredLangs.join('|');
  const langPattern = new RegExp(`^/(${langKeys})(?=/|$)(.*)`);
  const match = normalizedPathname.match(langPattern);
  if (!match) {
    return [];
  }
  const cleanPath = match[2];

  const baseUrl = site
    ? (site instanceof URL ? site.href : site).replace(/\/+$/, '')
    : '';

  const links: HreflangLink[] = langs.map((lang) => ({
    lang,
    href: `${baseUrl}/${lang}${cleanPath}`,
  }));

  const xDefaultLang = langs.includes(defaultLang) ? defaultLang : langs[0];
  links.push({
    lang: 'x-default',
    href: `${baseUrl}/${xDefaultLang}${cleanPath}`,
  });

  return links;
}
