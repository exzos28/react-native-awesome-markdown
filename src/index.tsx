import React, { useCallback, useMemo } from 'react';
import { marked } from 'marked';
import { Text, View } from 'react-native';
import { getStyle } from './getStyle';
import type {
  OverriddenProps,
  PartialStyleSheetRecord,
  StyleSheetKey,
  StyleSheetRecord,
  Token,
} from './types';
import createStyles, { mergeNamedStyles } from './createStyles';
import * as entities from 'entities';

export type MarkdownProps = {
  text: string;
  onLinkPress?: (href: string) => void;
  overridden?: OverriddenProps;
};

export {
  mergeNamedStyles,
  StyleSheetKey,
  StyleSheetRecord,
  PartialStyleSheetRecord,
  OverriddenProps,
};

export default function Markdown({
  text,
  overridden,
  onLinkPress,
}: MarkdownProps) {
  const { rules = {} } = overridden ?? {};
  const styles = createStyles(overridden);
  const _renderToken = useCallback(
    (rootToken: Token, rootTokens: Token[], rootIndex: number) => {
      const previousRootToken = rootTokens[rootIndex - 1];
      const { type } = rootToken;
      const rule = rules[type];
      switch (type) {
        case 'heading':
        case 'strong':
        case 'em':
        case 'paragraph':
        case 'del':
        case 'blockquote':
          const children = (
            <Text
              key={rootIndex}
              style={getStyle(rootToken, previousRootToken, styles)}
            >
              {rootToken.tokens.map((_, index) =>
                _renderToken(_, rootToken.tokens, index)
              )}
            </Text>
          );
          if (rule) {
            return rule(rootIndex, children);
          }
          return children;
        case 'link':
          const linkChildren = (
            <Text
              onPress={() => onLinkPress?.(rootToken.href)}
              key={rootIndex}
              style={getStyle(rootToken, previousRootToken, styles)}
            >
              {rootToken.tokens.map((_, index) =>
                _renderToken(_, rootToken.tokens, index)
              )}
            </Text>
          );

          if (rule) {
            return rule(rootIndex, linkChildren);
          }

          return linkChildren;
        case 'text':
        case 'codespan':
          const textChildren = (
            <Text
              style={getStyle(rootToken, previousRootToken, styles)}
              key={rootIndex}
            >
              {entities.decodeHTML(rootToken.text)}
            </Text>
          );

          if (rule) {
            return rule(rootIndex, textChildren);
          }

          return textChildren;
        case 'space':
          return <Text key={rootIndex}>{'\n'}</Text>;
        default:
          console.warn(`${rootToken.type} type is not supported yet`);
          return null;
      }
    },
    [onLinkPress, rules, styles]
  );
  const tokens = useMemo(
    () =>
      marked.lexer(text, {
        sanitize: false,
      }),
    [text]
  );
  return (
    <View>
      {tokens.map((token, index) => _renderToken(token, tokens, index))}
    </View>
  );
}
