import { describe, it, expect } from 'vitest';
import { getHreflangLinks } from './utils';

describe('getHreflangLinks', () => {
  const siteUrl = 'https://cooper.gladtek.com';

  it('generates alternate links for all configured languages plus x-default on standard pages', () => {
    const links = getHreflangLinks('/en/about', siteUrl);
    expect(links).toEqual([
      { lang: 'en', href: 'https://cooper.gladtek.com/en/about' },
      { lang: 'ar', href: 'https://cooper.gladtek.com/ar/about' },
      { lang: 'fr', href: 'https://cooper.gladtek.com/fr/about' },
      { lang: 'de', href: 'https://cooper.gladtek.com/de/about' },
      { lang: 'x-default', href: 'https://cooper.gladtek.com/en/about' },
    ]);
  });

  it('correctly handles root paths with trailing slashes', () => {
    const links = getHreflangLinks('/fr/', siteUrl);
    expect(links).toEqual([
      { lang: 'en', href: 'https://cooper.gladtek.com/en/' },
      { lang: 'ar', href: 'https://cooper.gladtek.com/ar/' },
      { lang: 'fr', href: 'https://cooper.gladtek.com/fr/' },
      { lang: 'de', href: 'https://cooper.gladtek.com/de/' },
      { lang: 'x-default', href: 'https://cooper.gladtek.com/en/' },
    ]);
  });

  it('filters alternate links when availableLangs is provided', () => {
    const links = getHreflangLinks('/en/blog/my-post', siteUrl, ['en', 'fr']);
    expect(links).toEqual([
      { lang: 'en', href: 'https://cooper.gladtek.com/en/blog/my-post' },
      { lang: 'fr', href: 'https://cooper.gladtek.com/fr/blog/my-post' },
      { lang: 'x-default', href: 'https://cooper.gladtek.com/en/blog/my-post' },
    ]);
  });

  it('returns empty array when availableLangs has 1 or 0 languages', () => {
    expect(getHreflangLinks('/en/docs/intro', siteUrl, ['en'])).toEqual([]);
    expect(getHreflangLinks('/en/docs/intro', siteUrl, [])).toEqual([]);
  });

  it('returns empty array for unlocalized paths without a language prefix', () => {
    expect(getHreflangLinks('/demo/home-centered', siteUrl)).toEqual([]);
    expect(getHreflangLinks('/license', siteUrl)).toEqual([]);
    expect(getHreflangLinks('/docs/getting-started', siteUrl)).toEqual([]);
  });

  it('works when site is a URL object or undefined', () => {
    const linksFromUrlObj = getHreflangLinks('/en/about', new URL(siteUrl));
    expect(linksFromUrlObj).toHaveLength(5);
    expect(linksFromUrlObj[0].href).toBe('https://cooper.gladtek.com/en/about');

    const linksWithoutSite = getHreflangLinks('/en/about', undefined);
    expect(linksWithoutSite).toHaveLength(5);
    expect(linksWithoutSite[0].href).toBe('/en/about');
  });
});
