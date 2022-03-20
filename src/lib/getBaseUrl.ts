export function getBaseUrl() {
  if (typeof window === 'undefined') {
    return '';
  }
  // reference for vercel.com
  if (process.env.DOMAIN) {
    return `${process.env.DOMAIN}`;
  }

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}
