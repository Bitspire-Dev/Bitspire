'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  themes: Theme[];
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  resolvedTheme: 'dark',
  setTheme: () => {},
  toggleTheme: () => {},
  themes: ['dark', 'light'],
});

export function useTheme() {
  return useContext(ThemeContext);
}

interface ThemeProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = 'bitspire-theme';
// Matches the transition duration defined in globals.css (.theme-transition).
const TRANSITION_DURATION = 400;

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return 'dark';
}

function applyTheme(theme: Theme, animate: boolean, transitionTimeout: RefObject<number | null>) {
  const root = document.documentElement;

  if (animate) {
    // Replace any pending removal so the transition class stays active for this switch.
    if (transitionTimeout.current !== null) {
      window.clearTimeout(transitionTimeout.current);
      transitionTimeout.current = null;
    }
    root.classList.add('theme-transition');
    // Force a reflow so the browser commits the transition styles before the
    // theme variables change; otherwise the swap can happen instantly (0/1).
    void root.offsetHeight;
  }

  root.classList.remove('dark', 'light');
  root.classList.add(theme);
  root.style.colorScheme = theme;

  if (animate) {
    transitionTimeout.current = window.setTimeout(() => {
      root.classList.remove('theme-transition');
      transitionTimeout.current = null;
    }, TRANSITION_DURATION + 50);
  }
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Lazy initializer reads from localStorage on the client (the inline script
  // in layout.tsx has already set the <html> class before hydration).
  // This prevents a flash where the state defaults to 'dark' and then
  // switches to the stored theme after the first effect runs.
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);
  const transitionTimeout = useRef<number | null>(null);

  useEffect(() => {
    // Safety net: ensure the DOM class matches the state. The inline script
    // already does this, but this guarantees consistency.
    applyTheme(theme, false, transitionTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    applyTheme(next, true, transitionTimeout);
    localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState(prev => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark';
      applyTheme(next, true, transitionTimeout);
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme: theme,
        setTheme,
        toggleTheme,
        themes: ['dark', 'light'],
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
