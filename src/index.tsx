import { useCallback, useMemo } from 'react';
import { marked } from 'marked';
import type { Token } from 'marked';
import { View, Platform, Linking } from 'react-native';
import { MarkdownContext, type RenderMeta } from './context';
import createStyles from './createStyles';
import Node from './renderers/Node';
import { visibleChildren } from './visibleChildren';
import type { StyleSheetRecord, TokenKey, TokenRenderer } from './types';

export type MarkdownProps = {
  value: string;
  onLinkPress?(href: string): void;
  onImagePress?(href: string): void;
  fontSize?: number;
  styles?: Partial<StyleSheetRecord>;
  components?: Partial<Record<TokenKey, TokenRenderer>>;
  debug?: boolean;
};

export type {
  TokenKey,
  StyleSheetRecord,
  TokenRenderer,
  TokenRenderProps,
} from './types';

const openLink = (url: string) => Linking.openURL(url);

export default function Markdown({
  value,
  onLinkPress = openLink,
  onImagePress,
  fontSize,
  styles: stylesOverride,
  components = {},
  debug = false,
}: MarkdownProps) {
  const styles = useMemo(
    () => createStyles(stylesOverride, fontSize),
    [stylesOverride, fontSize]
  );
  const isDebug = debug && Platform.OS === 'web';

  const renderNode = useCallback(
    (token: Token, siblings: Token[], index: number, meta?: RenderMeta) => (
      <Node
        key={index}
        token={token}
        neighbor={siblings[index - 1]}
        index={index}
        nested={meta?.nested}
      />
    ),
    []
  );

  const contextValue = useMemo(
    () => ({
      styles,
      isDebug,
      onLinkPress,
      onImagePress,
      components,
      renderNode,
    }),
    [styles, isDebug, onLinkPress, onImagePress, components, renderNode]
  );

  const tokens = useMemo(() => visibleChildren(marked.lexer(value)), [value]);

  return (
    <MarkdownContext.Provider value={contextValue}>
      <View>
        {tokens.map((token, index) => renderNode(token, tokens, index))}
      </View>
    </MarkdownContext.Provider>
  );
}
