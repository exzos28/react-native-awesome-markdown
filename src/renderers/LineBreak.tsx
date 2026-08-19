import { Text } from 'react-native';
import type { Token } from 'marked';
import { useMarkdownContext } from '../context';
import Debug from '../Debug';

type Props = {
  token: Token;
  index: number;
};

/** Renders `space` and `br` tokens, both of which just emit a newline. */
export default function LineBreak({ token, index }: Props) {
  const { isDebug } = useMarkdownContext();
  return (
    <Text key={index} style={isDebug && Debug.styles.textContainer}>
      {'\n'}
      {isDebug && <Text style={Debug.styles.type}>{token.type}</Text>}
    </Text>
  );
}
