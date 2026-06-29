// API Configuration
// Use dynamic URL based on current window location for development
// or use environment variable for production

export const getApiBaseUrl = (): string => {
  // Check for environment variable first (for Vite)
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) {
    return envUrl;
  }

  // In development mode with Vite proxy, use relative URLs (routes to /api)
  // The Vite dev server will proxy these to http://localhost:5000
  if (import.meta.env.DEV) {
    return '';
  }

  // For production, construct URL from current window location
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  const port = window.location.port ? `:${window.location.port}` : '';
  
  return `${protocol}//${hostname}${port}`;
};

export const API_BASE_URL = getApiBaseUrl();
