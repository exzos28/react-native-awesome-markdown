import { ScrollView, StyleSheet } from 'react-native';
import Markdown from 'react-native-awesome-markdown';

export default function App() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Markdown value={TEST} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    maxWidth: 700,
    width: '100%',
    alignSelf: 'center',
  },
});

const TEST = `
# Top level heading

## Heading of the second level

### Third level heading

#### Fourth level heading

##### Level 5 heading

###### Level 6 heading

Paragraph with *italic*, **bold** and ***bold italic***.
Paragraph with *italic*, **bold** and ***bold italic***.
Paragraph with *italic*, **bold** and ***bold italic***.
Paragraph with *italic*, **bold** and ***bold italic***.

Underlined text.

> block quote.

Link to [site](https://example.com)

- First item
- Second item
  - Nested item
- Third item

1. One
2. Two
3. Three

- [x] Done task
- [ ] Todo task

\`inline code\`

\`\`\`js
const answer = 42;
console.log(answer);
\`\`\`

---

| Column A | Column B |
|----------|----------|
| 1        | 2        |
| 3        | 4        |

![alt text](https://reactnative.dev/img/tiny_logo.png)
`.trim();
