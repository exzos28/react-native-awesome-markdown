import { StyleSheet, type TextStyle } from 'react-native';
import createStyles, { mergeNamedStyles } from '../createStyles';

describe('createStyles', () => {
  it('scales sizes relative to the given fontSize', () => {
    const styles = createStyles(undefined, 20);
    const h1 = StyleSheet.flatten(styles.h1) as TextStyle;
    expect(h1.fontSize).toBe(40);
  });

  it('falls back to the default global font size', () => {
    const styles = createStyles(undefined);
    const paragraph = StyleSheet.flatten(styles.paragraph) as TextStyle;
    expect(paragraph.fontSize).toBe(14);
  });

  it('includes default styles for every newly supported token', () => {
    const styles = createStyles(undefined);
    for (const key of [
      'code',
      'hr',
      'image',
      'list',
      'list_item',
      'checkbox',
      'table',
      'tableRow',
      'tableCell',
      'html',
    ] as const) {
      expect(styles[key]).toBeDefined();
    }
  });
});

describe('mergeNamedStyles', () => {
  it('shallow-merges an override on top of an existing key', () => {
    const base = StyleSheet.create<{ h1: TextStyle }>({
      h1: { fontSize: 10, color: 'black' },
    });
    const merged = mergeNamedStyles(base, { h1: { color: 'red' } });
    expect(StyleSheet.flatten(merged.h1)).toEqual({
      fontSize: 10,
      color: 'red',
    });
  });

  it('adds a key that did not previously exist', () => {
    const base = StyleSheet.create({ h1: { fontSize: 10 } });
    const merged = mergeNamedStyles(base, {
      newKey: { color: 'blue' },
    } as Partial<typeof base>);
    expect(merged).toHaveProperty('newKey');
  });
});
