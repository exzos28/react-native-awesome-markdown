import { Platform, StyleSheet as SS } from 'react-native';
import type { StyleSheetRecord } from './types';
import { GLOBAL_FONT_SIZE } from './constants';

export default function createStyles(
  styles: Partial<StyleSheetRecord> | undefined,
  fontSize: number = GLOBAL_FONT_SIZE
): SS.NamedStyles<StyleSheetRecord> {
  const em = (value: number, context = fontSize) => context * value;
  const defaultStyles: StyleSheetRecord = SS.create({
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
      fontStyle: 'italic',
    },
    space: {},
    text: {},
    list: {},
    list_item: {},
  });

  return mergeNamedStyles(defaultStyles, styles);
}

export function mergeNamedStyles<T extends SS.NamedStyles<T>>(
  styles1: T,
  styles2?: Partial<T>
): SS.NamedStyles<T> {
  const merged: SS.NamedStyles<T> = { ...styles1 };
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
