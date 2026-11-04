export function getAppBaseUrl() {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_VERCEL_URL ||
    'http://localhost:3000'
  );
}

export function getApiBaseUrl() {
  return `${getAppBaseUrl()}/api`;
}
