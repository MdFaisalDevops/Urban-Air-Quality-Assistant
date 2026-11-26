import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SafeMarkdownRenderer, renderInlineMarkdown } from '../utils/markdownParser';

describe('SafeMarkdownRenderer & Markdown Security', () => {
  it('safely renders inline bold, italic, and code spans without innerHTML', () => {
    const { container } = render(<div>{renderInlineMarkdown('Text with **bold**, *italic*, and `code`')}</div>);

    expect(screen.getByText('bold')).toHaveClass('font-bold');
    expect(screen.getByText('italic')).toHaveClass('italic');
    expect(screen.getByText('code')).toHaveClass('font-mono');
    expect(container.innerHTML).not.toContain('<script');
  });

  it('renders markdown headers H3 (###) and H4 (####)', () => {
    render(<SafeMarkdownRenderer content={'### Major Advisory\n#### Implementation Steps'} />);

    const h3 = screen.getByRole('heading', { level: 3 });
    expect(h3).toHaveTextContent('Major Advisory');

    const h4 = screen.getByRole('heading', { level: 4 });
    expect(h4).toHaveTextContent('Implementation Steps');
  });

  it('renders bullet lists and numbered lists cleanly', () => {
    render(
      <SafeMarkdownRenderer
        content={'- First bullet item\n- Second bullet item\n1. Step one\n2. Step two'}
      />
    );

    expect(screen.getByText('First bullet item')).toBeInTheDocument();
    expect(screen.getByText('Second bullet item')).toBeInTheDocument();
    expect(screen.getByText('Step one')).toBeInTheDocument();
    expect(screen.getByText('Step two')).toBeInTheDocument();
  });

  it('safely neutralizes potential script injection in content', () => {
    const malicious = '<script>window.pwned=true</script><img src=x onerror=alert(1)>';
    const { container } = render(<SafeMarkdownRenderer content={malicious} />);

    // Since it renders as pure React text elements, raw HTML is not parsed as DOM nodes
    expect(container.querySelector('script')).toBeNull();
    expect(container.querySelector('img')).toBeNull();
    expect(container.textContent).toContain('<script>window.pwned=true</script>');
  });
});
