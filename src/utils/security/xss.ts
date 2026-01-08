/**
 * XSS Protection Utilities
 */

/**
 * Sanitize HTML string to prevent XSS attacks
 * Removes script tags and event handlers
 */
export const sanitizeHTML = (html: string): string => {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
};

/**
 * Escape HTML special characters
 */
export const escapeHTML = (text: string): string => {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return text.replace(/[&<>"'/]/g, (char) => map[char] ?? char);
};

/**
 * Validate and sanitize URLs to prevent javascript: protocol
 */
export const sanitizeURL = (url: string): string => {
  const trimmedUrl = url.trim();

  // Block javascript: and data: protocols
  if (
    trimmedUrl.toLowerCase().startsWith('javascript:') ||
    trimmedUrl.toLowerCase().startsWith('data:')
  ) {
    return '';
  }

  return trimmedUrl;
};

/**
 * Sanitize object by escaping all string values
 */
export const sanitizeObject = <T extends Record<string, unknown>>(
  obj: T
): T => {
  const sanitized = {} as T;

  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (typeof value === 'string') {
      sanitized[key as keyof T] = escapeHTML(value) as T[keyof T];
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key as keyof T] = sanitizeObject(
        value as Record<string, unknown>
      ) as T[keyof T];
    } else {
      sanitized[key as keyof T] = value as T[keyof T];
    }
  });

  return sanitized;
};
