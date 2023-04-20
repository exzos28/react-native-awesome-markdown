import { Platform, StyleSheet } from 'react-native';
import type { OverriddenProps, StyleSheetRecord } from './types';
import { GLOBAL_FONT_SIZE } from './constants';

import NamedStyles = StyleSheet.NamedStyles;

export default function createStyles(
  props?: OverriddenProps
): NamedStyles<StyleSheetRecord> {
  const { globalFontSize = GLOBAL_FONT_SIZE, styles } = props ?? {};
  const em = (value: number, contextFontSize = globalFontSize) =>
    contextFontSize * value;
  const defaultStyles: StyleSheetRecord = StyleSheet.create({
    h1: {
      fontSize: em(2),
      marginTop: em(0.67, em(2)),
      marginBottom: em(0.67, em(2)),
      marginLeft: 0,
      marginRight: 0,
      fontWeight: 'bold',
    },
    h2: {
      fontSize: em(1.5),
      marginTop: em(0.83, em(1.5)),
      marginBottom: em(0.83, em(1.5)),
      marginLeft: 0,
      marginRight: 0,
      fontWeight: 'bold',
    },
    h3: {
      fontSize: em(1.17),
      marginTop: em(1, em(1.17)),
      marginBottom: em(1, em(1.17)),
      marginLeft: 0,
      marginRight: 0,
      fontWeight: 'bold',
    },
    h4: {
      fontSize: em(1),
      marginTop: em(1.33, em(1)),
      marginBottom: em(1.33, em(1)),
      marginLeft: 0,
      marginRight: 0,
      fontWeight: 'bold',
    },
    h5: {
      fontSize: em(0.83),
      marginTop: em(1.67, em(0.83)),
      marginBottom: em(1.67, em(0.83)),
      marginLeft: 0,
      marginRight: 0,
      fontWeight: 'bold',
    },
    h6: {
      fontSize: em(0.67),
      marginTop: em(2.33, em(0.67)),
      marginBottom: em(2.33, em(0.67)),
      marginLeft: 0,
      marginRight: 0,
      fontWeight: 'bold',
    },
    del: {
      textDecorationLine: 'line-through',
    },
    strong: {
      fontWeight: 'bold',
    },
    em: {
      fontStyle: 'italic',
    },
    link: {
      color: 'blue',
      textDecorationLine: 'underline',
      ...Platform.select({
        web: {
          cursor: 'auto',
        },
        default: {},
      }),
    },
    codespan: {
      ...Platform.select({
        ios: {
          fontFamily: 'Menlo',
        },
        android: {
          fontFamily: 'monospace',
        },
        web: {
          fontFamily: 'monospace',
        },
      }),
    },
    paragraph: {
      fontSize: em(1),
      marginTop: em(1),
      marginBottom: em(1),
      marginLeft: 0,
      marginRight: 0,
    },
    blockquote: {
      marginTop: em(1),
      marginBottom: em(1),
      marginLeft: 40,
      marginRight: 40,
    },
    space: {},
    text: {},
  });

  return mergeNamedStyles<StyleSheetRecord>(defaultStyles, styles);
}

export function mergeNamedStyles<T extends NamedStyles<T>>(
  styles1: T,
  styles2?: Partial<T>
): NamedStyles<T> {
  const merged: NamedStyles<T> = { ...styles1 };
  for (const key in styles2) {
    const style = styles2[key];
    if (merged.hasOwnProperty(key)) {
      merged[key] = { ...merged[key], ...style };
    } else if (style) {
      merged[key] = style;
    }
  }
  return merged;
}
