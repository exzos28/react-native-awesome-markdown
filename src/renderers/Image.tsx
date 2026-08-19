import { Image as RNImage, Pressable } from 'react-native';
import type { ImageStyle } from 'react-native';
import type { Tokens, Token } from 'marked';
import { getStyle, getStyleKey } from '../getStyle';
import { useMarkdownContext } from '../context';
import { useOverride } from './useOverride';

type Props = {
  token: Tokens.Image;
  neighbor: Token | undefined;
  index: number;
};

export default function ImageToken({ token, neighbor, index }: Props) {
  const { styles, onImagePress } = useMarkdownContext();
  const { render } = useOverride(getStyleKey(token));
  const style = getStyle(token, neighbor, styles);
  const elementProps = {
    source: { uri: token.href },
    accessibilityLabel: token.text,
    // resizeMode lives in `style` (defaulted in createStyles.ts) rather than
    // as a separate prop, so a user's `styles.image.resizeMode` override
    // actually takes effect instead of being shadowed by a hardcoded prop.
    style: style as ImageStyle,
    onPress: onImagePress ? () => onImagePress(token.href) : undefined,
  };
  const image = (
    <RNImage
      key={index}
      source={elementProps.source}
      accessibilityLabel={elementProps.accessibilityLabel}
      style={elementProps.style}
    />
  );
  // Image itself doesn't fire touch events — pressability needs a wrapper.
  const fallback = elementProps.onPress ? (
    <Pressable key={index} onPress={elementProps.onPress}>
      {image}
    </Pressable>
  ) : (
    image
  );
  return render({
    token,
    index,
    children: null,
    props: elementProps,
    fallback,
  });
}
