"use client";

import { useSyncExternalStore } from "react";

const pad = (n: number) => String(n).padStart(2, "0");

function getToday(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const subscribe = () => () => {};

/**
 * Today's local date as YYYY-MM-DD (for <input type="date" min>).
 * `undefined` on the server and during hydration, so pages can still be prerendered.
 */
export function useToday(): string | undefined {
  return useSyncExternalStore(subscribe, getToday, () => undefined);
}
