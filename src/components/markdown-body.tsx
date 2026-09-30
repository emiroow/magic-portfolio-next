import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import ReactMarkdown, { type Components } from 'react-markdown';

/**
 * Body headings are shifted one level down: the page itself owns the single
 * `<h1>`, so an author writing `# Title` must not create a second one.
 */
const components: Components = {
  h1: ({ node: _node, ...props }) => <h2 {...props} />,
  h2: ({ node: _node, ...props }) => <h3 {...props} />,
  h3: ({ node: _node, ...props }) => <h4 {...props} />,
  h4: ({ node: _node, ...props }) => <h5 {...props} />,
  h5: ({ node: _node, ...props }) => <h6 {...props} />,
  h6: ({ node: _node, ...props }) => <h6 {...props} />,
};

/** Long-form Markdown body (blog posts, project details) with site typography. */
export function MarkdownBody({ content }: { content?: string }) {
  return (
    <div className="prose-article">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]]} components={components}>
        {content || ''}
      </ReactMarkdown>
    </div>
  );
}
