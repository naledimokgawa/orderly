'use client';

import { ClientOnly, IconButton, Skeleton, type IconButtonProps } from '@chakra-ui/react';
import { ThemeProvider, useTheme, type ThemeProviderProps } from 'next-themes';

// next-themes renders an inline <script> that sets the theme before the page paints.
// On the server it must stay a normal script so the browser runs it. In the browser,
// React 19.2 warns about any executable <script> it renders, so there we mark it as a
// data block (type="application/json"); it has already run by then, so nothing is lost.
const themeScriptProps =
  typeof window === 'undefined'
    ? { suppressHydrationWarning: true }
    : { type: 'application/json', suppressHydrationWarning: true };

export function ColorModeProvider(props: ThemeProviderProps) {
  return <ThemeProvider attribute="class" disableTransitionOnChange scriptProps={themeScriptProps} {...props} />;
}

export function useColorMode() {
  const { resolvedTheme, setTheme } = useTheme();
  const colorMode = resolvedTheme === 'dark' ? 'dark' : 'light';
  return {
    colorMode,
    toggleColorMode: () => setTheme(colorMode === 'dark' ? 'light' : 'dark'),
  };
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export function ColorModeButton(props: Omit<IconButtonProps, 'aria-label'>) {
  const { colorMode, toggleColorMode } = useColorMode();
  const label = colorMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
  return (
    <ClientOnly fallback={<Skeleton boxSize="9" rounded="md" />}>
      <IconButton variant="ghost" size="sm" aria-label={label} title={label} onClick={toggleColorMode} {...props}>
        {colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
      </IconButton>
    </ClientOnly>
  );
}
