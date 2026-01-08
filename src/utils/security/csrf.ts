/**
 * CSRF Token Management
 * Tokens are stored in localStorage and sent with each request
 */

const CSRF_TOKEN_KEY = 'csrf_token';

export const setCSRFToken = (token: string): void => {
  localStorage.setItem(CSRF_TOKEN_KEY, token);
};

export const getCSRFToken = (): string | null => {
  return localStorage.getItem(CSRF_TOKEN_KEY);
};

export const removeCSRFToken = (): void => {
  localStorage.removeItem(CSRF_TOKEN_KEY);
};

/**
 * Initialize CSRF token from cookie
 * This should be called on app initialization
 */
export const initCSRFToken = (): void => {
  const token = getCookieValue('csrf_token');
  if (token) {
    setCSRFToken(token);
  }
};

/**
 * Helper to get cookie value by name
 */
function getCookieValue(name: string): string | null {
  const matches = document.cookie.match(
    new RegExp(
      '(?:^|; )' + name.replace(/([.$?*|{}()[]\\\/+^])/g, '\\$1') + '=([^;]*)'
    )
  );
  return matches ? decodeURIComponent(matches[1]) : null;
}
