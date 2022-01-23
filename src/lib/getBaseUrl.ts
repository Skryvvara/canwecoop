export function getBaseUrl() {
  if (process.browser) {
    return '';
  }
  // reference for vercel.com
  if (process.env.DOMAIN) {
    return `${process.env.DOMAIN}`;
  }
    
  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}
