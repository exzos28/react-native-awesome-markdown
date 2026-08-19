# react-native-awesome-markdown

Renders Markdown as native React Native views (`Text`/`View`/`Image`), powered by [`marked`](https://github.com/markedjs/marked).

## Installation

```sh
npm i react-native-awesome-markdown
```
or
```sh
yarn add react-native-awesome-markdown
```

## Usage

Below is an example of basic usage of the `react-native-awesome-markdown` library:

```javascript
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Markdown from 'react-native-awesome-markdown';

export default function App() {
  return (
    <View style={styles.container}>
      <Markdown value={TEST} />
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

Paragraph with *italic*, **bold**, ~~strikethrough~~, and \`inline code\`.

> Block quote.

- Unordered item
  - Nested item
- Another item

1. Ordered item
2. Another ordered item

- [x] Done task
- [ ] Todo task

\`\`\`js
const answer = 42;
\`\`\`

---

| Column A | Column B |
|----------|----------|
| 1        | 2        |

![alt text](https://example.com/image.png)

Link to [site](https://example.com)
`;
```

## Props

The `Markdown` component accepts the following props:

| Prop           | Type                                                | Description                                                                                        |
|----------------|------------------------------------------------------|-----------------------------------------------------------------------------------------------------|
| `value`        | `string`                                             | **Required**. The Markdown text to render.                                                          |
| `onLinkPress`  | `(href: string) => void`                             | Called when a link is pressed. Overrides the default `Linking.openURL` behavior.                    |
| `onImagePress` | `(href: string) => void`                             | Called when an image is pressed. If omitted, images are not pressable.                              |
| `fontSize`     | `number`                                             | The global font size from which all other sizes inherit. Defaults to `14`.                          |
| `styles`       | `Partial<StyleSheetRecord>`                          | An object containing styles to override the default styles. [List of available keys.](#supported-tokens) |
| `components`   | `Partial<Record<TokenKey, TokenRenderer>>`           | An object containing renderers to override how specific tokens are rendered. See below.             |
| `debug`        | `boolean`                                            | Enables debug mode (outlines every rendered node). Available only on web.                           |

### Supported tokens

- `h1`–`h6`
- `paragraph`
- `blockquote`
- `strong`
- `em`
- `del`
- `link`
- `image` — rendered at a fixed 200×200 by default (`resizeMode: 'contain'`), since React Native can't read a remote image's natural size without an async request. Override `styles.image` for a different fixed size, or `components.image` if you need to fetch the real dimensions yourself (e.g. via `Image.getSize`).
- `codespan` — inline code
- `code` — fenced code block
- `hr`
- `list` / `list_item` — unordered, ordered, nested, and task (checkbox) lists
- `checkbox` — the marker of a task list item
- `table` / `tableRow` / `tableCell`
- `space`
- `text`
- `html` — raw HTML has no default renderer (React Native can't render arbitrary HTML); override via `components.html` if you need to support it (e.g. with a `WebView`).

## Style Customization

You can override the default styles by passing a `styles` object to the `Markdown` component. This allows you to tailor the appearance of the Markdown text to match your application's design.

### Example: Overriding Styles

```javascript
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Markdown from 'react-native-awesome-markdown';

export default function App() {
  const customStyles = {
    h1: {
      color: 'red',
      fontSize: 24,
    },
    paragraph: {
      color: 'gray',
      lineHeight: 20,
    },
    link: {
      color: 'purple',
      textDecorationLine: 'underline',
    },
    code: {
      backgroundColor: '#1e1e1e',
      color: '#dcdcdc',
    },
  };

  return (
    <View style={styles.container}>
      <Markdown value={TEST} styles={customStyles} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

const TEST = `
# Custom Styled Heading

This is a paragraph with a [custom link](https://example.com).
`;
```

## Customizing Renderers

The library allows you to override the rendering of specific tokens using the `components` prop. Each renderer receives:

- `token` — the raw `marked` token (`href`, `checked`, `depth`, `align`, ... depending on the type)
- `children` — the already-rendered inner content, **not** wrapped in the default host element
- `props` — everything the default renderer would spread onto its own host element (`style`, and `onPress` where relevant). Spread this to keep the default look/behavior and layer your own on top, instead of rebuilding it from scratch.
- `key`

### Example: Custom Renderers

```javascript
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Markdown from 'react-native-awesome-markdown';

export default function App() {
  const customComponents = {
    // Keep the default styling and press behavior (props.onPress already
    // calls onLinkPress(token.href)), just add a long-press on top.
    link: ({ token, children, key, props }) => (
      <Text
        key={key}
        {...props}
        onLongPress={() => showPreview(token.href)}
      >
        {children}
      </Text>
    ),
    h1: ({ children, key }) => (
      <Text key={key} style={{ fontSize: 30, color: 'blue' }}>
        {children}
      </Text>
    ),
  };

  return (
    <View style={styles.container}>
      <Markdown value={TEST} components={customComponents} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

const TEST = `
# Custom Heading

Visit [Google](https://google.com).
`;
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
