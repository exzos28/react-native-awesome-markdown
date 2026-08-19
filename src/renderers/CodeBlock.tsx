import { ScrollView, Text } from 'react-native';
import type { Tokens, Token } from 'marked';
import { getStyle, getStyleKey } from '../getStyle';
import { useMarkdownContext } from '../context';
import { useOverride } from './useOverride';

type Props = {
  token: Tokens.Code;
  neighbor: Token | undefined;
  index: number;
};

/** Renders a fenced code block. Raw text is preserved as-is (no entity decoding). */
export default function CodeBlock({ token, neighbor, index }: Props) {
  const { styles } = useMarkdownContext();
  const { render } = useOverride(getStyleKey(token));
  const style = getStyle(token, neighbor, styles);
  const elementProps = { style };
  const fallback = (
    <ScrollView key={index} horizontal showsHorizontalScrollIndicator={false}>
      <Text {...elementProps}>{token.text}</Text>
    </ScrollView>
  );
  return render({
    token,
    index,
    children: token.text,
    props: elementProps,
    fallback,
  });
}
