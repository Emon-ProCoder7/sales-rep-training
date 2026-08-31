"use client";

import { useEffect, useState } from "react";

/**
 * Progress lives in localStorage, which the server can never see. Any
 * component that reads it must render an identical, static first pass on
 * both server and client, then switch to real data only after mount -
 * otherwise React's hydration diff fails. Gate real content on this hook.
 */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
