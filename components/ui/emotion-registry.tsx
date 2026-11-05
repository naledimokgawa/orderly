'use client';

import createCache, { type EmotionCache } from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { useServerInsertedHTML } from 'next/navigation';
import { useState } from 'react';

/**
 * Collects the CSS Emotion (Chakra's styling engine) generates during server rendering
 * and sends it in <head> via Next's useServerInsertedHTML, instead of letting Emotion
 * drop <style> tags into the middle of <body>. Those inline tags don't exist on the
 * client, which made React's hydration fail.
 * See: node_modules/next/dist/docs/01-app/02-guides/css-in-js.md
 */
export function EmotionRegistry({ children }: { children: React.ReactNode }) {
  const [registry] = useState(() => {
    const cache: EmotionCache = createCache({ key: 'css' });
    // compat mode stops Emotion from rendering its own inline <style> tags during SSR.
    cache.compat = true;

    let inserted: { name: string; isGlobal: boolean }[] = [];
    const originalInsert = cache.insert;
    cache.insert = (...args) => {
      const [selector, serialized] = args;
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push({ name: serialized.name, isGlobal: !selector });
      }
      return originalInsert(...args);
    };
    const flush = () => {
      const flushed = inserted;
      inserted = [];
      return flushed;
    };
    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const names = registry.flush();
    if (names.length === 0) return null;

    const globals: { name: string; css: string }[] = [];
    let styles = '';
    let dataEmotion = registry.cache.key;

    for (const { name, isGlobal } of names) {
      const css = registry.cache.inserted[name];
      if (typeof css !== 'string') continue;
      if (isGlobal) {
        globals.push({ name, css });
      } else {
        styles += css;
        dataEmotion += ` ${name}`;
      }
    }

    return (
      <>
        {globals.map(({ name, css }) => (
          <style key={name} data-emotion={`${registry.cache.key}-global ${name}`} dangerouslySetInnerHTML={{ __html: css }} />
        ))}
        {styles && <style data-emotion={dataEmotion} dangerouslySetInnerHTML={{ __html: styles }} />}
      </>
    );
  });

  return <CacheProvider value={registry.cache}>{children}</CacheProvider>;
}
