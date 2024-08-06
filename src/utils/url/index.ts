export function removeBaseURL(url: string): string {
  const urlObject = new URL(url);
  return urlObject.pathname + urlObject.search;
}
