export const HEADINGS = `
# H1
## H2
### H3
`.trim();

export const INLINE_FORMATTING =
  'Text with *italic*, **bold**, ~~strikethrough~~ and `inline code`.';

export const BLOCKQUOTE = '> A quote';

export const LINK = 'Visit [example](https://example.com) now.';

export const IMAGE = '![alt text](https://example.com/image.png)';

export const HR = 'above\n\n---\n\nbelow';

export const CODE_BLOCK = '```js\nconst x = 1;\n```';

export const UNORDERED_LIST = '- First\n- Second\n- Third';

export const ORDERED_LIST = '1. First\n2. Second\n3. Third';

export const NESTED_LIST = '- Parent\n  - Child A\n  - Child B\n- Sibling';

export const TASK_LIST = '- [x] Done\n- [ ] Todo';

export const SOFT_BREAK = 'First line\nSecond line';

export const TABLE = [
  '| Left | Right |',
  '|:-----|------:|',
  '| a    | b     |',
  '| c    | d     |',
].join('\n');
