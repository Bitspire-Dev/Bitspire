import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useLocaleSwitcher } from '../use-locale-switcher';
import { useParams } from 'next/navigation';
import { usePathname, useRouter } from '@/i18n/navigation';

const mockReplace = vi.fn();

vi.mock('next/navigation', () => ({
  useParams: vi.fn(),
}));

vi.mock('@/i18n/navigation', () => ({
  usePathname: vi.fn(),
  useRouter: vi.fn(),
}));

describe('useLocaleSwitcher', () => {
  beforeEach(() => {
    mockReplace.mockClear();
    vi.mocked(useRouter).mockReturnValue({ replace: mockReplace } as never);
  });

  it('switches the blog index page', () => {
    vi.mocked(usePathname).mockReturnValue('/blog');
    vi.mocked(useParams).mockReturnValue({});

    const { result } = renderHook(() =>
      useLocaleSwitcher({ locale: 'pl', blogMap: { byCanonical: {}, bySlug: {} } })
    );
    result.current('en');

    expect(mockReplace).toHaveBeenCalledWith('/blog', { locale: 'en' });
  });

  it('switches the privacy page', () => {
    vi.mocked(usePathname).mockReturnValue('/privacy');
    vi.mocked(useParams).mockReturnValue({});

    const { result } = renderHook(() =>
      useLocaleSwitcher({ locale: 'pl', blogMap: { byCanonical: {}, bySlug: {} } })
    );
    result.current('en');

    expect(mockReplace).toHaveBeenCalledWith('/privacy', { locale: 'en' });
  });

  it('switches the home page', () => {
    vi.mocked(usePathname).mockReturnValue('/');
    vi.mocked(useParams).mockReturnValue({});

    const { result } = renderHook(() =>
      useLocaleSwitcher({ locale: 'pl', blogMap: { byCanonical: {}, bySlug: {} } })
    );
    result.current('en');

    expect(mockReplace).toHaveBeenCalledWith('/', { locale: 'en' });
  });

  it('maps the blog slug through the canonical map', () => {
    vi.mocked(usePathname).mockReturnValue('/blog/[slug]');
    vi.mocked(useParams).mockReturnValue({ slug: 'post-pl' });

    const blogMap = {
      byCanonical: {
        'canonical-1': { pl: 'post-pl', en: 'post-en' },
      },
      bySlug: {
        'pl|post-pl': 'canonical-1',
      },
    };

    const { result } = renderHook(() => useLocaleSwitcher({ locale: 'pl', blogMap }));
    result.current('en');

    expect(mockReplace).toHaveBeenCalledWith(
      { pathname: '/blog/[slug]', params: { slug: 'post-en' } },
      { locale: 'en' }
    );
  });

  it('keeps the current slug when canonical is not mapped', () => {
    vi.mocked(usePathname).mockReturnValue('/blog/[slug]');
    vi.mocked(useParams).mockReturnValue({ slug: 'post-pl' });

    const { result } = renderHook(() =>
      useLocaleSwitcher({ locale: 'pl', blogMap: { byCanonical: {}, bySlug: {} } })
    );
    result.current('en');

    expect(mockReplace).toHaveBeenCalledWith(
      { pathname: '/blog/[slug]', params: { slug: 'post-pl' } },
      { locale: 'en' }
    );
  });

  it('maps the portfolio category to the target locale slug', () => {
    vi.mocked(usePathname).mockReturnValue('/portfolio/[category]');
    vi.mocked(useParams).mockReturnValue({ category: 'strony-internetowe' });

    const { result } = renderHook(() =>
      useLocaleSwitcher({ locale: 'pl', blogMap: { byCanonical: {}, bySlug: {} } })
    );
    result.current('en');

    expect(mockReplace).toHaveBeenCalledWith(
      { pathname: '/portfolio/[category]', params: { category: 'websites' } },
      { locale: 'en' }
    );
  });

  it('maps the portfolio project path to the target locale category', () => {
    vi.mocked(usePathname).mockReturnValue('/portfolio/[category]/[slug]');
    vi.mocked(useParams).mockReturnValue({ category: 'strony-internetowe', slug: 'project' });

    const { result } = renderHook(() =>
      useLocaleSwitcher({ locale: 'pl', blogMap: { byCanonical: {}, bySlug: {} } })
    );
    result.current('en');

    expect(mockReplace).toHaveBeenCalledWith(
      {
        pathname: '/portfolio/[category]/[slug]',
        params: { category: 'websites', slug: 'project' },
      },
      { locale: 'en' }
    );
  });

  it('falls back to replacing the raw pathname for unknown dynamic routes', () => {
    vi.mocked(usePathname).mockReturnValue('/unknown');
    vi.mocked(useParams).mockReturnValue({});

    const { result } = renderHook(() =>
      useLocaleSwitcher({ locale: 'pl', blogMap: { byCanonical: {}, bySlug: {} } })
    );
    result.current('en');

    expect(mockReplace).toHaveBeenCalledWith('/unknown', { locale: 'en' });
  });
});
