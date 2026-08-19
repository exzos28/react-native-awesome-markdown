import { Text } from 'react-native';
import type { Token } from 'marked';
import { getStyle, getStyleKey } from '../getStyle';
import { useMarkdownContext } from '../context';
import { useOverride } from './useOverride';
import { visibleChildren } from '../visibleChildren';
import Debug from '../Debug';

type Props = {
  token: Token & { tokens?: Token[] };
  neighbor: Token | undefined;
  index: number;
};

/**
 * Renders any block/inline token whose only job is to wrap child tokens in a
 * single <Text>: heading, paragraph, blockquote, strong, em, del.
 */
export default function InlineContainer({ token, neighbor, index }: Props) {
  const { styles, isDebug, renderNode } = useMarkdownContext();
  const { render } = useOverride(getStyleKey(token));
  const style = getStyle(token, neighbor, styles);
  const children = visibleChildren(token.tokens);
  const rendered = children.map((child, i) => renderNode(child, children, i));
  const elementProps = {
    style: [style, isDebug && Debug.styles.rootTextContainer],
  };
  const fallback = (
    <Text key={index} {...elementProps}>
      {rendered}
      {isDebug && <Text style={Debug.styles.rootType}>{token.type}</Text>}
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
