import { Text } from 'react-native';
import type { Tokens, Token } from 'marked';
import { getStyle, getStyleKey } from '../getStyle';
import { useMarkdownContext } from '../context';
import { useOverride } from './useOverride';
import { visibleChildren } from '../visibleChildren';
import Debug from '../Debug';

type Props = {
  token: Tokens.Link;
  neighbor: Token | undefined;
  index: number;
};

export default function Link({ token, neighbor, index }: Props) {
  const { styles, isDebug, onLinkPress, renderNode } = useMarkdownContext();
  const { render } = useOverride(getStyleKey(token));
  const style = getStyle(token, neighbor, styles);
  const children = visibleChildren(token.tokens);
  const rendered = children.map((child, i) => renderNode(child, children, i));
  const elementProps = {
    style: [style, isDebug && Debug.styles.textContainer],
    onPress: () => onLinkPress(token.href),
  };
  const fallback = (
    <Text key={index} {...elementProps}>
      {rendered}
      {isDebug && <Text style={Debug.styles.type}>{token.type}</Text>}
    </Text>
  );
  return render({
    token,
    index,
    children: rendered,
    props: elementProps,
    fallback,
  });
}
