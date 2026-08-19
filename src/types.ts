import type { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import type { ReactNode } from 'react';
import type { Token, Tokens } from 'marked';

/**
 * List of supported tokens
 */
export type TokenKey =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'del'
  | 'strong'
  | 'em'
  | 'link'
  | 'image'
  | 'codespan'
  | 'code'
  | 'paragraph'
  | 'blockquote'
  | 'hr'
  | 'list'
  | 'list_item'
  | 'checkbox'
  | 'table'
  | 'tableRow'
  | 'tableCell'
  | 'space'
  | 'text'
  | 'html';

export type StyleSheetRecord = Record<
  TokenKey,
  ViewStyle | TextStyle | ImageStyle
>;

export type RenderableToken =
  | Token
  | Tokens.TableCell
  | { type: 'checkbox'; checked: boolean }
  | { type: 'tableRow' };

export type TokenRenderProps = {
  token: RenderableToken;
  /** The raw, already-rendered inner content — not wrapped in the default host element. */
  children: ReactNode;
  /**
   * Everything the default renderer would spread onto its host element
   * (style, onPress, accessibilityLabel, ...). Spread this onto your own
   * element to keep the default look/behavior and only override what you
   * need: `<Text {...props} onLongPress={...}>{children}</Text>`.
   */
  props: Record<string, unknown>;
  key: number;
};

export type TokenRenderer = (props: TokenRenderProps) => ReactNode;
