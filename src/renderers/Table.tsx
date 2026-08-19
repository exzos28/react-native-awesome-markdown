import { ScrollView, Text, View } from 'react-native';
import type { Tokens, Token } from 'marked';
import { getStyle, getStyleKey } from '../getStyle';
import { useMarkdownContext } from '../context';
import { useOverride } from './useOverride';
import { visibleChildren } from '../visibleChildren';

type Props = {
  token: Tokens.Table;
  neighbor: Token | undefined;
  index: number;
};

function Cell({
  cell,
  cellIndex,
}: {
  cell: Tokens.TableCell;
  cellIndex: number;
}) {
  const { styles, renderNode } = useMarkdownContext();
  const { render } = useOverride('tableCell');
  const children = visibleChildren(cell.tokens);
  const rendered = children.map((child, i) => renderNode(child, children, i));
  const elementProps = { style: styles.tableCell };
  const fallback = (
    <View key={cellIndex} {...elementProps}>
      <Text style={{ textAlign: cell.align ?? 'left' }}>{rendered}</Text>
    </View>
  );
  return render({
    token: cell,
    index: cellIndex,
    children: rendered,
    props: elementProps,
    fallback,
  });
}

function Row({
  cells,
  rowIndex,
}: {
  cells: Tokens.TableCell[];
  rowIndex: number;
}) {
  const { styles } = useMarkdownContext();
  const { render } = useOverride('tableRow');
  const elementProps = { style: styles.tableRow };
  const cellsRendered = cells.map((cell, cellIndex) => (
    <Cell key={cellIndex} cell={cell} cellIndex={cellIndex} />
  ));
  const fallback = (
    <View key={rowIndex} {...elementProps}>
      {cellsRendered}
    </View>
  );
  return render({
    token: { type: 'tableRow' },
    index: rowIndex,
    children: cellsRendered,
    props: elementProps,
    fallback,
  });
}

export default function Table({ token, neighbor, index }: Props) {
  const { styles } = useMarkdownContext();
  const { render } = useOverride(getStyleKey(token));
  const style = getStyle(token, neighbor, styles);
  const elementProps = { style };
  const rows = [
    <Row key={-1} cells={token.header} rowIndex={-1} />,
    ...token.rows.map((row, rowIndex) => (
      <Row key={rowIndex} cells={row} rowIndex={rowIndex} />
    )),
  ];
  const fallback = (
    <ScrollView key={index} horizontal showsHorizontalScrollIndicator={false}>
      <View {...elementProps}>{rows}</View>
    </ScrollView>
  );
  return render({
    token,
    index,
    children: rows,
    props: elementProps,
    fallback,
  });
}
