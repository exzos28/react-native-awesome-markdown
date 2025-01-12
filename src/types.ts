import type { ImageStyle, TextStyle, ViewStyle } from 'react-native';

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
  | 'codespan'
  | 'paragraph'
  | 'blockquote'
  | 'space'
  | 'text';

export type StyleSheetRecord = Record<
  TokenKey,
  ViewStyle | TextStyle | ImageStyle
>;
