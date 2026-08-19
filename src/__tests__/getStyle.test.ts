import type { Token } from 'marked';
import { getStyle, getStyleKey } from '../getStyle';
import createStyles from '../createStyles';

const styles = createStyles(undefined, 10);

function paragraph(): Token {
  return { type: 'paragraph', raw: '', text: '', tokens: [] } as Token;
}

describe('getStyleKey', () => {
  it('maps heading tokens to their depth-specific key', () => {
    const heading = {
      type: 'heading',
      depth: 3,
      raw: '',
      text: '',
      tokens: [],
    } as unknown as Token;
    expect(getStyleKey(heading)).toBe('h3');
  });

  it('uses the token type for every other token', () => {
    expect(getStyleKey(paragraph())).toBe('paragraph');
  });
});

describe('getStyle', () => {
  it('returns the style unmodified when there is no previous sibling', () => {
    const style = getStyle(paragraph(), undefined, styles);
    expect(style).toBe(styles.paragraph);
  });

  it('collapses marginTop against the previous sibling marginBottom', () => {
    // paragraph: marginTop = marginBottom = 1em = 10
    const style = getStyle(paragraph(), paragraph(), styles);
    expect(style).toMatchObject({ marginTop: 0 });
  });

  it('reduces marginTop by the previous marginBottom without going negative', () => {
    const big = createStyles(
      { paragraph: { marginBottom: 4, marginTop: 10 } },
      10
    );
    const style = getStyle(paragraph(), paragraph(), big);
    expect(style).toMatchObject({ marginTop: 6 });
  });
});
