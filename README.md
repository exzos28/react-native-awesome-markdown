# react-native-awesome-markdown



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
      <Markdown text={TEST} />
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

Paragraph with *italic*, **bold**, and ***bold italic***.

Underlined text.

> Block quote.

Link to [site](https://example.com)

- First item
- Second item
- Third item
- Fourth item
`;
```

## Props

The `Markdown` component accepts the following props:

| Prop          | Type                                                              | Description                                                                                                                          |
|---------------|-------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------|
| `text`        | `string`                                                          | **Required**. The Markdown text to render.                                                                                           |
| `onLinkPress` | `(href: string) => void`                                          | Function to handle link presses. Allows overriding the default behavior when a link is clicked.                                      |
| `fontSize`    | `number`                                                          | The global font size from which all other sizes inherit. Defaults to `14`.                                                           |
| `styles`      | `StyleSheetRecord`                                                | An object containing styles to override the default styles. [List of available keys.](#supported-tokens)                            |
| `rules`       | `Record<TokenKey, (key: number, props: Attributes) => ReactNode>` | An object containing rendering methods to override the rendering of specific Markdown elements. Available keys: same as in `styles`. |
| `debug`       | `boolean`                                                         | Enables debug mode. Available only in web.                                                                                           |

### Supported tokens

- h1
- h2
- h3
- h4
- h5
- h6
- del
- strong
- em
- link
- codespan
- paragraph
- blockquote
- space
- text



## Style Customization

You can override the default styles by passing a styles object to the Markdown component. This allows you to tailor the appearance of the Markdown text to match your application’s design.

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
  };

  return (
    <View style={styles.container}>
      <Markdown text={TEST} styles={customStyles} />
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
The library allows you to override the rendering methods for specific Markdown elements using the rules prop. This is useful if you want to change how certain elements are displayed or to add additional functionality.

### Example: Custom Renderers

```javascript
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Markdown from 'react-native-awesome-markdown';

export default function App() {
  const customRules = {
    link: (children, props) => (
      <Text {...props} style={{ color: 'orange' }} onPress={() => alert('Link pressed!')}>
        {children}
      </Text>
    ),
    h1: (children, props) => (
      <Text {...props} style={{ fontSize: 30, color: 'blue' }}>
        {children}
      </Text>
    ),
  };

  return (
    <View style={styles.container}>
      <Markdown text={TEST} rules={customRules} />
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
