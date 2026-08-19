import type { Token } from 'marked';
import { describe, expect, it } from '@jest/globals';
import { visibleChildren } from '../visibleChildren';

describe('visibleChildren', () => {
  it('drops blank-line `space` tokens', () => {
    const tokens = [
      { type: 'paragraph' },
      { type: 'space' },
      { type: 'paragraph' },
    ] as Token[];
    expect(visibleChildren(tokens).map((t) => t.type)).toEqual([
      'paragraph',
      'paragraph',
    ]);
  });

  it('keeps every other token untouched', () => {
    const tokens = [{ type: 'text' }, { type: 'br' }] as Token[];
    expect(visibleChildren(tokens)).toHaveLength(2);
  });

  it('handles undefined input', () => {
    expect(visibleChildren(undefined)).toEqual([]);
  });
});
