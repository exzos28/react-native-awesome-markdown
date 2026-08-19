import type { Token, Tokens } from 'marked';
import InlineContainer from './InlineContainer';
import TextToken from './TextToken';
import Link from './Link';
import ImageToken from './Image';
import CodeBlock from './CodeBlock';
import Hr from './Hr';
import List from './List';
import Table from './Table';
import LineBreak from './LineBreak';
import Html from './Html';

type Props = {
  token: Token;
  neighbor: Token | undefined;
  index: number;
  /** True when this token is a `list` nested inside a `list_item`. */
  nested?: boolean;
};

/** Dispatches a single marked token to its renderer component. */
export default function Node({ token, neighbor, index, nested }: Props) {
  switch (token.type) {
    case 'heading':
    case 'strong':
    case 'em':
    case 'paragraph':
    case 'del':
    case 'blockquote':
      return (
        <InlineContainer token={token} neighbor={neighbor} index={index} />
      );
    case 'text':
    case 'codespan':
      return (
        <TextToken
          token={token as Tokens.Text | Tokens.Codespan}
          neighbor={neighbor}
          index={index}
        />
      );
    case 'link':
      return (
        <Link token={token as Tokens.Link} neighbor={neighbor} index={index} />
      );
    case 'image':
      return (
        <ImageToken
          token={token as Tokens.Image}
          neighbor={neighbor}
          index={index}
        />
      );
    case 'code':
      return (
        <CodeBlock
          token={token as Tokens.Code}
          neighbor={neighbor}
          index={index}
        />
      );
    case 'hr':
      return (
        <Hr token={token as Tokens.Hr} neighbor={neighbor} index={index} />
      );
    case 'list':
      return (
        <List
          token={token as Tokens.List}
          neighbor={neighbor}
          index={index}
          nested={nested}
        />
      );
    case 'table':
      return (
        <Table
          token={token as Tokens.Table}
          neighbor={neighbor}
          index={index}
        />
      );
    case 'br':
      return <LineBreak token={token} index={index} />;
    case 'space':
      // Inter-block blank-line noise; visibleChildren() filters these out
      // before they reach here. The gap between blocks comes from margin
      // collapsing (getStyle.ts), not from rendering this as a newline.
      return null;
    case 'html':
      return <Html token={token as Tokens.HTML} index={index} />;
    default:
      console.warn(`${token.type} type is not supported yet`);
      return null;
  }
}
