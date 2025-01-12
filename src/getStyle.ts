import { StyleSheet, type TextStyle } from 'react-native';
import type { StyleSheetRecord, TokenKey } from './types';
import type { Token } from 'marked';

function getStyleKey(rootToken: Token) {
  const { type } = rootToken;
  switch (type) {
    case 'heading':
      return ('h' + rootToken.depth) as TokenKey;
    default:
      return rootToken.type as TokenKey;
  }
}

export function getStyle(
  token: Token,
  topNeighbor: Token | undefined,
  styles: StyleSheetRecord
) {
  const candidateStyle: TextStyle = styles[getStyleKey(token)];
  if (!candidateStyle) {
    console.warn(`Style for token with type ${token.type} not found`);
  }
  if (!topNeighbor) {
    return candidateStyle;
  }
  const previousStyle =
    StyleSheet.flatten(styles[getStyleKey(topNeighbor)]) ?? {};
  const previousMarginBottom = previousStyle.marginBottom;
  if (!previousMarginBottom) {
    return candidateStyle;
  }
  if (typeof previousMarginBottom !== 'number') {
    console.warn('Collapsing margin calculation is only available for numeric');
    return candidateStyle;
  }
  const currentMarginTop = candidateStyle.marginTop;
  if (!currentMarginTop) {
    return candidateStyle;
  }
  if (typeof currentMarginTop !== 'number') {
    console.warn('Collapsing margin calculation is only available for numeric');
    return candidateStyle;
  }
  if (currentMarginTop > 0) {
    const newMarginTop =
      previousMarginBottom > currentMarginTop
        ? 0
        : currentMarginTop - previousMarginBottom;
    const newStyle: TextStyle = StyleSheet.flatten([
      candidateStyle,
      { marginTop: newMarginTop },
    ]);
    return newStyle;
  }
  return candidateStyle;
}
