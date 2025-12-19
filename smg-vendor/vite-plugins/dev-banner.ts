import type { Plugin } from 'vite';

export default function devBanner(): Plugin {
  return {
    name: 'dev-banner-stub',
    configureServer(server) {
      // no-op placeholder for dev server behavior
    },
  };
}
