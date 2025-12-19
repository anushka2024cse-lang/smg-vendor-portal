import type { Plugin } from 'vite';

export default function cartographer(): Plugin {
  return {
    name: 'cartographer-stub',
    transform(code, id) {
      // No-op stub
      return null;
    },
  };
}
