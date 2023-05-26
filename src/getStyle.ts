import { StyleSheet, TextStyle } from 'react-native';
import type { StyleSheetRecord, StyleSheetKey, Token } from './types';

function getStyleKey(rootToken: Token) {
  const { type } = rootToken;
  switch (type) {
    case 'heading':
      return ('h' + rootToken.depth) as StyleSheetKey;
    default:
      return rootToken.type as StyleSheetKey;
  }
}

export function getStyle(
  token: Token,
  previousToken: Token | undefined,
  styles: StyleSheetRecord
) {
  const candidateStyle: TextStyle = styles[getStyleKey(token)];
  if (!candidateStyle) {
    console.warn(`Style for token with type ${token.type} not found`);
  }
  if (!previousToken) {
    return candidateStyle;
  }
  const previousStyle =
    StyleSheet.flatten(styles[getStyleKey(previousToken)]) ?? {};
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
