import { View } from 'react-native';
import type { Tokens, Token } from 'marked';
import { getStyle, getStyleKey } from '../getStyle';
import { useMarkdownContext } from '../context';
import { useOverride } from './useOverride';
import ListItem from './ListItem';

type Props = {
  token: Tokens.List;
  neighbor: Token | undefined;
  index: number;
  nested?: boolean;
};

export default function List({ token, neighbor, index, nested }: Props) {
  const { styles } = useMarkdownContext();
  const { render } = useOverride(getStyleKey(token));
  const style = getStyle(token, neighbor, styles);
  // A nested list's vertical margin would double up with its parent
  // list_item's own spacing — in HTML this gets absorbed by parent/child
  // margin collapsing, which RN doesn't do automatically, so we zero it out
  // ourselves. The indent (paddingLeft) is kept.
  const elementProps = {
    style: nested ? [style, { marginTop: 0, marginBottom: 0 }] : style,
  };
  const items = token.items.map((item, itemIndex) => (
    <ListItem
      key={itemIndex}
      token={item}
      index={itemIndex}
      ordered={token.ordered}
      start={typeof token.start === 'number' ? token.start : 1}
    />
  ));
  const fallback = (
    <View key={index} {...elementProps}>
      {items}
    </View>
  );
  return render({
    token,
    index,
    children: items,
    props: elementProps,
    fallback,
  });
}
