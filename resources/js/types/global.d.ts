import type { route as routeFn } from 'ziggy-js';
export {};
declare global {
    const route: typeof routeFn;
    interface Window {
    csrfToken: string;
  }
}

