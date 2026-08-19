import { measureRenders } from 'reassure';
import Markdown from '../index';

const DOCUMENT = `
# Heading one

Paragraph with *italic*, **bold**, ~~strikethrough~~ and \`inline code\`.

> A blockquote.

- First item
- Second item
  - Nested item
- Third item

1. One
2. Two
3. Three

- [x] Done
- [ ] Todo

\`\`\`js
const answer = 42;
console.log(answer);
\`\`\`

---

| Column A | Column B |
|----------|----------|
| 1        | 2        |
| 3        | 4        |

![alt text](https://example.com/image.png)

Link to [example](https://example.com).
`.trim();

test('renders a full markdown document', async () => {
  await measureRenders(<Markdown value={DOCUMENT} />);
});

test('re-renders when custom styles change', async () => {
  await measureRenders(
    <Markdown value={DOCUMENT} styles={{ h1: { color: 'red' } }} />
  );
});
