import { Text } from 'react-native';
import * as entities from 'entities';
import type { Tokens } from 'marked';
import { getStyle, getStyleKey } from '../getStyle';
import { useMarkdownContext } from '../context';
import { useOverride } from './useOverride';
import Debug from '../Debug';

type Props = {
  token: Tokens.Text | Tokens.Codespan;
  neighbor: import('marked').Token | undefined;
  index: number;
};

/** Renders a leaf text token: `text` or `codespan`. */
export default function TextToken({ token, neighbor, index }: Props) {
  const { styles, isDebug } = useMarkdownContext();
  const { render } = useOverride(getStyleKey(token));
  const style = getStyle(token, neighbor, styles);
  // A soft line break (single newline within a paragraph, without a hard
  // `br`) is CommonMark syntax, not visible content — it should collapse to
  // a single space, same as a browser does. Unlike HTML, RN's <Text> doesn't
  // collapse whitespace on its own, so a raw '\n' here would render as a
  // real line break.
  const text = entities.decodeHTML(token.text).replace(/\n/g, ' ');
  const elementProps = {
    style: [style, isDebug && Debug.styles.textContainer],
  };
  const fallback = (
    <Text key={index} {...elementProps}>
      {text}
      {isDebug && <Text style={Debug.styles.type}>{token.type}</Text>}
    </Text>
  );
  return render({
    token,
    index,
    children: text,
    props: elementProps,
    fallback,
  });
}
