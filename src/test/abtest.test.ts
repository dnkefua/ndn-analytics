import { describe, it, expect, beforeEach, vi } from 'vitest';
import { assignVariant } from '../lib/abtest';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

describe('assignVariant', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('returns one of the provided variants', () => {
    const variant = assignVariant('test-key', ['A', 'B', 'C']);
    expect(['A', 'B', 'C']).toContain(variant);
  });

  it('persists variant to localStorage', () => {
    const variant = assignVariant('persist-key', ['X', 'Y']);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('persist-key', variant);
  });

  it('returns the same variant on subsequent calls (cached)', () => {
    const first = assignVariant('sticky-key', ['A', 'B']);
    const second = assignVariant('sticky-key', ['A', 'B']);
    expect(second).toBe(first);
  });

  it('returns existing cached variant from localStorage', () => {
    localStorageMock.setItem('cached-key', 'B');
    localStorageMock.getItem.mockReturnValueOnce('B');
    const result = assignVariant('cached-key', ['A', 'B']);
    expect(result).toBe('B');
  });

  it('re-assigns when cached variant is no longer in variant list', () => {
    localStorageMock.setItem('stale-key', 'OLD');
    localStorageMock.getItem.mockReturnValueOnce('OLD');
    const result = assignVariant('stale-key', ['A', 'B']);
    expect(['A', 'B']).toContain(result);
  });

  it('returns first variant when localStorage throws', () => {
    localStorageMock.getItem.mockImplementationOnce(() => { throw new Error('Storage blocked'); });
    const result = assignVariant('error-key', ['FALLBACK', 'B']);
    expect(result).toBe('FALLBACK');
  });

  it('handles single-variant array', () => {
    const result = assignVariant('single', ['ONLY']);
    expect(result).toBe('ONLY');
  });
});
