import type { marked } from 'marked';
import type { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import type { ReactNode } from 'react';

export type Token = marked.Token;

export type StyleSheetKey =
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
  StyleSheetKey,
  ViewStyle | TextStyle | ImageStyle
>;

export type PartialStyleSheetRecord = Partial<StyleSheetRecord>;

export type OverriddenProps = {
  globalFontSize?: number;
  styles?: PartialStyleSheetRecord;
  rules?: Partial<
    Record<Token['type'], (key: number, children: ReactNode) => ReactNode>
  >;
};
