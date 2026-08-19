import type { Token } from 'marked';

/**
 * `marked` emits an explicit `space` token for every blank line between
 * sibling block tokens (e.g. between two paragraphs, or inside a blockquote
 * between two nested paragraphs). It carries no visual meaning on its own —
 * the gap between blocks is produced by margin collapsing (see getStyle.ts).
 * Rendering it as a literal newline would double that gap, and leaving it in
 * the array would also break neighbor lookups used for margin collapsing.
 */
export function visibleChildren<T extends Pick<Token, 'type'>>(
  tokens: T[] | undefined
): T[] {
  return (tokens ?? []).filter((token) => token.type !== 'space');
}
