import type { ReactNode } from 'react';
import { useMarkdownContext } from '../context';
import type { RenderableToken, StyleSheetRecord, TokenKey } from '../types';

type RenderArgs = {
  token: RenderableToken;
  index: number;
  /** Raw inner content, passed through to the override as `children`. */
  children: ReactNode;
  /** Props the default renderer would spread onto its host element. */
  props: Record<string, unknown>;
  /** The fully default-rendered element, used when there's no override. */
  fallback: ReactNode;
};

/**
 * Resolves the style for a token key and lets a user-supplied `components[key]`
 * renderer replace the default output, receiving the raw children and the
 * props the default element would have used.
 */
export function useOverride(key: TokenKey) {
  const { styles, components } = useMarkdownContext();
  const style = styles[key];
  const override = components[key];
  const render = ({
    token,
    index,
    children,
    props,
    fallback,
  }: RenderArgs): ReactNode =>
    override ? override({ token, children, props, key: index }) : fallback;
  return { style, render, hasOverride: !!override } as {
    style: StyleSheetRecord[TokenKey];
    render: typeof render;
    hasOverride: boolean;
  };
}
