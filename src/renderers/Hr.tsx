import { View } from 'react-native';
import type { Tokens, Token } from 'marked';
import { getStyle, getStyleKey } from '../getStyle';
import { useMarkdownContext } from '../context';
import { useOverride } from './useOverride';

type Props = {
  token: Tokens.Hr;
  neighbor: Token | undefined;
  index: number;
};

export default function Hr({ token, neighbor, index }: Props) {
  const { styles } = useMarkdownContext();
  const { render } = useOverride(getStyleKey(token));
  const style = getStyle(token, neighbor, styles);
  const elementProps = { style };
  const fallback = <View key={index} {...elementProps} />;
  return render({
    token,
    index,
    children: null,
    props: elementProps,
    fallback,
  });
}
