import { useState } from 'react';

export function assignVariant(key: string, variants: string[]) {
  if (typeof window === 'undefined') return variants[0];
  try {
    const existing = localStorage.getItem(key);
    if (existing && variants.includes(existing)) return existing;
    const pick = variants[Math.floor(Math.random() * variants.length)];
    localStorage.setItem(key, pick);
    return pick;
  } catch {
    return variants[0];
  }
}

export default function useABTest(key: string, variants: string[] = ['A', 'B']) {
  return useState<string>(() => assignVariant(key, variants))[0];
}
