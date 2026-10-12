// Central API configuration.
//
// The base URL comes from the VITE_API_URL environment variable so the same
// codebase can point at different backends across environments:
//   - local dev  -> .env        (loaded by `vite dev`)
//   - production -> .env.production (loaded by `vite build`)
//
// Vite only exposes variables prefixed with VITE_ to the client bundle, and
// it inlines them at BUILD time. Changing VITE_API_URL therefore requires a
// rebuild -- setting it at runtime in the browser will not have any effect.
//
// Never put secrets in a VITE_* variable: everything prefixed that way ends up
// visible in the shipped JavaScript.

const rawBase = import.meta.env.VITE_API_URL;

// Normalise away a trailing slash so `${API_BASE}/api/menu` never produces
// a double slash. An unset/empty value stays empty, which lets callers fall
// back to same-origin relative URLs.
export const API_BASE = (rawBase || "").replace(/\/+$/, "");

// True when the app has been pointed at a real backend.
export const HAS_API_BASE = API_BASE.length > 0;

/**
 * Build an absolute API URL from a path like "/api/menu".
 * Returns the path unchanged when no base is configured, so a missing
 * env var degrades to a same-origin request instead of "undefined/api/menu".
 */
export function apiUrl(path) {
  if (!HAS_API_BASE) return path;
  return `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
}