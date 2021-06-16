export function getDomain(url: string): string {
  return url.replace(/^https?:\/\//i, '').split('/')[0];
}
