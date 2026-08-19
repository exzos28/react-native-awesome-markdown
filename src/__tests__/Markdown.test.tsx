import { StyleSheet, Text, View } from 'react-native';
import { render, screen, fireEvent } from '@testing-library/react-native';
import Markdown from '../index';
import * as fixtures from '../__fixtures__/markdown';

describe('Markdown', () => {
  it('renders headings with their text content', () => {
    render(<Markdown value={fixtures.HEADINGS} />);
    expect(screen.getByText('H1')).toBeTruthy();
    expect(screen.getByText('H2')).toBeTruthy();
    expect(screen.getByText('H3')).toBeTruthy();
  });

  it('renders inline formatting', () => {
    render(<Markdown value={fixtures.INLINE_FORMATTING} />);
    expect(screen.getByText('italic')).toBeTruthy();
    expect(screen.getByText('bold')).toBeTruthy();
    expect(screen.getByText('strikethrough')).toBeTruthy();
    expect(screen.getByText('inline code')).toBeTruthy();
  });

  it('renders a blockquote', () => {
    render(<Markdown value={fixtures.BLOCKQUOTE} />);
    expect(screen.getByText('A quote')).toBeTruthy();
  });

  it('calls onLinkPress with the href when a link is pressed', () => {
    const onLinkPress = jest.fn();
    render(<Markdown value={fixtures.LINK} onLinkPress={onLinkPress} />);
    fireEvent.press(screen.getByText('example'));
    expect(onLinkPress).toHaveBeenCalledWith('https://example.com');
  });

  it('renders an image with an accessibility label from the alt text', () => {
    render(<Markdown value={fixtures.IMAGE} />);
    expect(screen.getByLabelText('alt text')).toBeTruthy();
  });

  it('lets a custom styles.image.resizeMode override take effect', () => {
    // Regression test: resizeMode used to be hardcoded as a separate prop
    // on <Image>, which always won over whatever resizeMode came through
    // the merged style, silently ignoring this override.
    render(
      <Markdown
        value={fixtures.IMAGE}
        styles={{ image: { resizeMode: 'stretch' } }}
      />
    );
    const flat = StyleSheet.flatten(
      screen.getByLabelText('alt text').props.style
    );
    expect(flat.resizeMode).toBe('stretch');
  });

  it('renders a fenced code block preserving raw text', () => {
    render(<Markdown value={fixtures.CODE_BLOCK} />);
    expect(screen.getByText('const x = 1;')).toBeTruthy();
  });

  it('renders an unordered list with bullet markers', () => {
    render(<Markdown value={fixtures.UNORDERED_LIST} />);
    expect(screen.getAllByText('•')).toHaveLength(3);
    expect(screen.getByText('First')).toBeTruthy();
    expect(screen.getByText('Third')).toBeTruthy();
  });

  it('renders an ordered list with incrementing numbers', () => {
    render(<Markdown value={fixtures.ORDERED_LIST} />);
    expect(screen.getByText('1.')).toBeTruthy();
    expect(screen.getByText('2.')).toBeTruthy();
    expect(screen.getByText('3.')).toBeTruthy();
  });

  it('renders nested lists', () => {
    render(<Markdown value={fixtures.NESTED_LIST} />);
    expect(screen.getByText('Parent')).toBeTruthy();
    expect(screen.getByText('Child A')).toBeTruthy();
    expect(screen.getByText('Child B')).toBeTruthy();
    expect(screen.getByText('Sibling')).toBeTruthy();
  });

  it('does not add extra vertical margin around a nested list', () => {
    // Regression test: a nested `list` token used to keep the same
    // marginTop/marginBottom as a top-level list, blowing up the gap around
    // it. HTML absorbs this via parent/child margin collapsing; RN doesn't
    // do that automatically, so nested lists must have it zeroed manually.
    const result = render(<Markdown value={fixtures.NESTED_LIST} />);
    const views = result.UNSAFE_getAllByType(View);
    const nestedListStyle = views
      .map((instance) => StyleSheet.flatten(instance.props.style))
      .find((flat) => flat && 'paddingLeft' in flat && flat.marginTop === 0);
    expect(nestedListStyle).toBeTruthy();
  });

  it('does not double up the gap after an item that ends with a nested list', () => {
    // Regression test: the "Second item" list_item kept its own
    // marginBottom on top of the nested list's last item marginBottom,
    // doubling the gap before the next top-level item.
    const result = render(<Markdown value={fixtures.NESTED_LIST} />);
    const views = result.UNSAFE_getAllByType(View);
    const listItemMargins = views
      .map((instance) => StyleSheet.flatten(instance.props.style))
      .filter((flat) => flat?.flexDirection === 'row')
      .map((flat) => flat.marginBottom);
    expect(listItemMargins.filter((m) => m === 0)).toHaveLength(1);
    expect(listItemMargins.filter((m) => m > 0).length).toBeGreaterThan(0);
  });

  it('renders task list checkboxes', () => {
    render(<Markdown value={fixtures.TASK_LIST} />);
    expect(screen.getByText('☑')).toBeTruthy();
    expect(screen.getByText('☐')).toBeTruthy();
  });

  it('renders a table with header and body cells', () => {
    render(<Markdown value={fixtures.TABLE} />);
    expect(screen.getByText('Left')).toBeTruthy();
    expect(screen.getByText('Right')).toBeTruthy();
    expect(screen.getByText('a')).toBeTruthy();
    expect(screen.getByText('d')).toBeTruthy();
  });

  it('renders a horizontal rule between paragraphs', () => {
    render(<Markdown value={fixtures.HR} />);
    expect(screen.getByText('above')).toBeTruthy();
    expect(screen.getByText('below')).toBeTruthy();
  });

  it('collapses a soft line break inside a paragraph into a space', () => {
    // Regression test: CommonMark treats a single newline inside a paragraph
    // as a soft break, which renders as a space (the browser default), not
    // a visible line break. RN's <Text> doesn't collapse whitespace on its
    // own, so the raw '\n' must be normalized before rendering.
    render(<Markdown value={fixtures.SOFT_BREAK} />);
    expect(screen.getByText('First line Second line')).toBeTruthy();
  });

  it('does not render the blank line between blocks as an extra newline', () => {
    // Regression test: marked emits a `space` token for every blank line
    // between top-level blocks. Rendering it as a literal '\n' would add
    // visible height on top of the paragraph's own margin.
    const view = render(
      <Markdown value={'First paragraph.\n\nSecond paragraph.'} />
    );
    const texts = view.UNSAFE_getAllByType(Text);
    const standaloneNewlines = texts.filter(
      (instance) => instance.props.children === '\n'
    );
    expect(standaloneNewlines).toHaveLength(0);
  });

  it('collapses the margin between two adjacent paragraphs', () => {
    const view = render(
      <Markdown value={'First paragraph.\n\nSecond paragraph.'} />
    );
    const texts = view.UNSAFE_getAllByType(Text);
    const collapsedMarginTop = texts.some((instance) => {
      const flat = StyleSheet.flatten(instance.props.style);
      return flat?.marginTop === 0;
    });
    expect(collapsedMarginTop).toBe(true);
  });

  it('applies custom styles on top of the defaults', () => {
    const view = render(
      <Markdown value="# Title" styles={{ h1: { color: 'red' } }} />
    );
    const texts = view.UNSAFE_getAllByType(Text);
    const hasRedText = texts.some((instance) => {
      const flat = StyleSheet.flatten(instance.props.style);
      return flat?.color === 'red';
    });
    expect(hasRedText).toBe(true);
  });

  it('passes the default element props through so overrides can extend rather than reimplement them', () => {
    // Regression test: overriding `components.link` must not require
    // rebuilding the default onPress(href) handler from scratch — `props`
    // carries what the default renderer would've spread onto its <Text>
    // (including the working onPress), so the override can just add to it.
    const onLinkPress = jest.fn();
    const onLongPress = jest.fn();
    render(
      <Markdown
        value={fixtures.LINK}
        onLinkPress={onLinkPress}
        components={{
          link: ({ children, key, props }) => (
            <Text key={key} {...props} onLongPress={onLongPress}>
              {children}
            </Text>
          ),
        }}
      />
    );
    fireEvent.press(screen.getByText('example'));
    expect(onLinkPress).toHaveBeenCalledWith('https://example.com');
    fireEvent(screen.getByText('example'), 'longPress');
    expect(onLongPress).toHaveBeenCalled();
  });

  it('lets a custom component override the default renderer', () => {
    render(
      <Markdown
        value="# Title"
        components={{
          h1: ({ children, key }) => (
            <Text key={key} testID="custom-h1">
              {children}
            </Text>
          ),
        }}
      />
    );
    expect(screen.getByTestId('custom-h1')).toBeTruthy();
  });
});
