import type { Tokens, Token } from 'marked';
import { getStyleKey } from '../getStyle';
import { useOverride } from './useOverride';

type Props = {
  token: Tokens.HTML;
  index: number;
};

/**
 * Raw HTML has no default renderer (React Native can't render arbitrary HTML).
 * Override via `components.html` to support it, e.g. with a WebView.
 */
export default function Html({ token, index }: Props) {
  const { render, hasOverride } = useOverride(
    getStyleKey(token as unknown as Token)
  );
  if (!hasOverride) {
    console.warn(
      'html token is not rendered by default. Provide `components.html` to handle it.'
    );
  }
  return render({ token, index, children: null, props: {}, fallback: null });
}
