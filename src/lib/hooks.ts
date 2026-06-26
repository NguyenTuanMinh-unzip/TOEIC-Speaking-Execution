"use client";

import { useEffect, useState } from "react";
import { currentDayNumber } from "./date";

/** True only after the component has mounted on the client. Use to avoid
 *  hydration mismatches when reading persisted (localStorage) state. */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

/** The active program day, recomputed on mount (and stable thereafter). */
export function useCurrentDay(): number {
  const [day, setDay] = useState(0);
  useEffect(() => setDay(currentDayNumber()), []);
  return day;
}
