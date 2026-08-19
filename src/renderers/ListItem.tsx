import { StyleSheet, Text, View } from 'react-native';
import type { Tokens } from 'marked';
import { getStyleKey } from '../getStyle';
import { useMarkdownContext } from '../context';
import { useOverride } from './useOverride';
import { visibleChildren } from '../visibleChildren';
import {
  CHECKBOX_CHECKED_MARK,
  CHECKBOX_UNCHECKED_MARK,
  UNORDERED_BULLET,
} from '../constants';

type Props = {
  token: Tokens.ListItem;
  index: number;
  ordered: boolean;
  start: number;
};

function Marker({ token, ordered, index, start }: Props) {
  const { styles } = useMarkdownContext();
  const { render } = useOverride('checkbox');
  if (token.task) {
    const mark = token.checked
      ? CHECKBOX_CHECKED_MARK
      : CHECKBOX_UNCHECKED_MARK;
    const elementProps = { style: styles.checkbox };
    const fallback = (
      <Text key={index} {...elementProps}>
        {mark}
      </Text>
    );
    return render({
      token: { type: 'checkbox', checked: !!token.checked },
      index,
      children: mark,
      props: elementProps,
      fallback,
    });
  }
  const label = ordered ? `${start + index}.` : UNORDERED_BULLET;
  return <Text style={localStyles.marker}>{label}</Text>;
}

export default function ListItem({ token, index, ordered, start }: Props) {
  const { styles, renderNode } = useMarkdownContext();
  const { render } = useOverride(getStyleKey(token));
  const children = visibleChildren(token.tokens);
  // When the item ends with a nested list, that nested list's own last item
  // already supplies the trailing gap before the next sibling. Keeping this
  // item's own marginBottom on top of it would double it up.
  const endsWithNestedList = children[children.length - 1]?.type === 'list';
  const elementProps = {
    style: endsWithNestedList
      ? [styles.list_item, { marginBottom: 0 }]
      : styles.list_item,
  };
  const rendered = children.map((child, i) =>
    renderNode(child, children, i, { nested: child.type === 'list' })
  );
  const fallback = (
    <View key={index} {...elementProps}>
      <Marker token={token} index={index} ordered={ordered} start={start} />
      <View style={localStyles.content}>{rendered}</View>
    </View>
  );
  return render({
    token,
    index,
    children: rendered,
    props: elementProps,
    fallback,
  });
}

const localStyles = StyleSheet.create({
  marker: {
    marginRight: 6,
  },
  content: {
    flex: 1,
  },
});
