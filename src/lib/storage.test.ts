import { beforeEach, describe, expect, it } from 'vitest';
import { loadLocalState, saveLocalState, STORAGE_KEY } from './storage';

describe('local state', () => {
  beforeEach(() => window.localStorage.clear());

  it('returns fallback when empty', () => expect(loadLocalState({ count: 0 })).toEqual({ count: 0 }));
  it('merges stored values with defaults', () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ count: 4 }));
    expect(loadLocalState({ count: 0, name: 'LOLO' })).toEqual({ count: 4, name: 'LOLO' });
  });
  it('saves state', () => {
    saveLocalState({ ready: true });
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY)!)).toEqual({ ready: true });
  });
});

