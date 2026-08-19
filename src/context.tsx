import { createContext, useContext } from 'react';
import type { Token } from 'marked';
import type { ReactNode } from 'react';
import type { StyleSheetRecord, TokenKey, TokenRenderer } from './types';

export type MarkdownContextValue = {
  styles: StyleSheetRecord;
  isDebug: boolean;
  onLinkPress(href: string): void;
  onImagePress?(href: string): void;
  components: Partial<Record<TokenKey, TokenRenderer>>;
  renderNode(
    token: Token,
    siblings: Token[],
    index: number,
    meta?: RenderMeta
  ): ReactNode;
};

/** Extra context threaded to a renderer alongside the token itself. */
export type RenderMeta = {
  /** True when this token is a `list` nested inside a `list_item`. */
  nested?: boolean;
};

export const MarkdownContext = createContext<MarkdownContextValue | null>(null);

export function useMarkdownContext(): MarkdownContextValue {
  const context = useContext(MarkdownContext);
  if (!context) {
    throw new Error(
      'Markdown renderers must be used within a <Markdown /> component'
    );
  }
  return context;
}
