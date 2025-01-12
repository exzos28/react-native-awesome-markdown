import { StyleSheet, View } from 'react-native';
import Markdown from 'react-native-awesome-markdown';

export default function App() {
  return (
    <View style={styles.container}>
      <Markdown debug text={TEST} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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

Underlined text.

> block quote.

Link to [site](https://example.com)

- First item
- Second item
- Third item
- Fourth item
`.trim();
