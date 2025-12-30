const FALLBACK_ORIGIN = 'http://local.test';

export function withBase(path = '/'): string {
  const base = import.meta.env.BASE_URL ?? '/';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  const cleaned = typeof path === 'string' ? path : '/';
  const relative = cleaned.startsWith('/') ? cleaned.slice(1) : cleaned;
  const url = new URL(relative, new URL(normalizedBase, FALLBACK_ORIGIN));
  return url.pathname;
}
