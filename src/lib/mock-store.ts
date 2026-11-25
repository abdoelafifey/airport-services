/**
 * Tiny persistence for the mock backend. Uses localStorage in the browser so a booking
 * made in one tab can be opened from the "email link" in another, and falls back to
 * memory on the server. Delete this file when the real backend arrives.
 */

const memory = new Map<string, string>();

function hasStorage(): boolean {
  try {
    return typeof window !== "undefined" && !!window.localStorage;
  } catch {
    return false;
  }
}

export function readStore<T>(key: string, fallback: T): T {
  try {
    const raw = hasStorage() ? window.localStorage.getItem(key) : memory.get(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStore<T>(key: string, value: T): void {
  const raw = JSON.stringify(value);
  try {
    if (hasStorage()) window.localStorage.setItem(key, raw);
    else memory.set(key, raw);
  } catch {
    memory.set(key, raw);
  }
}
