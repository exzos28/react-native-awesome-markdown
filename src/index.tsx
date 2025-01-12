import { type Attributes, type ReactNode, useCallback, useMemo } from 'react';
import { marked, type Token } from 'marked';
import type { Tokens } from 'marked';
import { Text, View, Platform, Linking } from 'react-native';
import { getStyle } from './getStyle';
import type { TokenKey, StyleSheetRecord } from './types';
import createStyles from './createStyles';
import * as entities from 'entities';
import Debug from './Debug';

export type MarkdownProps = {
  text: string;
  onLinkPress?(href: string): void;
  fontSize?: number;
  styles?: Partial<StyleSheetRecord>;
  rules?: Partial<
    Record<TokenKey, (children: ReactNode, props: Attributes) => ReactNode>
  >;
  debug?: boolean;
};

export type { TokenKey, StyleSheetRecord };

const openLink = (url: string) => Linking.openURL(url);

export default function Markdown(props: MarkdownProps) {
  const styles = createStyles(props.styles, props.fontSize);
  const { debug, rules = {}, onLinkPress = openLink } = props;
  const isDebug = debug && Platform.OS === 'web';
  const _renderToken = useCallback(
    (root: Token, all: Token[], rootIndex: number) => {
      const neighbor = all[rootIndex - 1];
      const rule = rules[root.type as TokenKey];
      switch (root.type) {
        case 'heading':
        case 'strong':
        case 'em':
        case 'paragraph':
        case 'del':
        case 'blockquote': {
          const style = getStyle(root, neighbor, styles);
          const tokens = root.tokens ?? [];
          const children = (
            <Text
              key={rootIndex}
              style={[style, isDebug && Debug.styles.rootTextContainer]}
            >
              {tokens.map((token, index) => _renderToken(token, tokens, index))}
              {isDebug && (
                <Text style={Debug.styles.rootType}>{root.type}</Text>
              )}
            </Text>
          );
          return rule ? rule(children, { key: rootIndex }) : children;
        }
        case 'list': {
          const style = getStyle(root, neighbor, styles);
          const tokens: Tokens.ListItem[] = root.items ?? [];
          const children = (
            <Text
              key={rootIndex}
              style={[style, isDebug && Debug.styles.rootTextContainer]}
            >
              {tokens.map((token, index) => _renderToken(token, tokens, index))}
              {isDebug && (
                <Text style={Debug.styles.rootType}>{root.type}</Text>
              )}
            </Text>
          );
          return rule ? rule(children, { key: rootIndex }) : children;
        }
        case 'link': {
          const style = getStyle(root, neighbor, styles);
          const tokens = root.tokens ?? [];
          const children = (
            <Text
              key={rootIndex}
              style={[style, isDebug && Debug.styles.textContainer]}
              onPress={() => onLinkPress?.(root.href)}
            >
              {tokens.map((_, index) => _renderToken(_, tokens, index))}
              {isDebug && <Text style={Debug.styles.type}>{root.type}</Text>}
            </Text>
          );
          return rule ? rule(children, { key: rootIndex }) : children;
        }
        case 'text':
        case 'codespan': {
          const style = getStyle(root, neighbor, styles);
          const children = (
            <Text
              style={[style, isDebug && Debug.styles.textContainer]}
              key={rootIndex}
            >
              {entities.decodeHTML(root.text)}
              {isDebug && <Text style={Debug.styles.type}>{root.type}</Text>}
            </Text>
          );
          return rule ? rule(children, { key: rootIndex }) : children;
        }
        case 'list_item': {
          const style = getStyle(root, neighbor, styles);
          const children = (
            <Text
              style={[style, isDebug && Debug.styles.rootTextContainer]}
              key={rootIndex}
            >
              - {entities.decodeHTML(root.text)} {'\n'}
              {isDebug && <Text style={Debug.styles.type}>{root.type}</Text>}
            </Text>
          );
          return rule ? rule(children, { key: rootIndex }) : children;
        }
        case 'space':
          return (
            <Text key={rootIndex} style={isDebug && Debug.styles.textContainer}>
              {'\n'}
              {isDebug && <Text style={Debug.styles.type}>{root.type}</Text>}
            </Text>
          );
        case 'br':
          return (
            <Text key={rootIndex} style={isDebug && Debug.styles.textContainer}>
              {'\n'}
              {isDebug && <Text style={Debug.styles.type}>{root.type}</Text>}
            </Text>
          );
        default:
          console.warn(`${root.type} type is not supported yet`);
          return null;
      }
    },
    [isDebug, onLinkPress, rules, styles]
  );
  const _tokens = useMemo(() => marked.lexer(props.text), [props.text]);
  return (
    <View>
      {_tokens.map((token, index) => _renderToken(token, _tokens, index))}
    </View>
  );
}
