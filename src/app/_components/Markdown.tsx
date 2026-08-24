import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'

type MarkdownProps = {
  /** Markdown source, as typed into the spreadsheet. */
  children: string
  /** Type size for the whole block; the elements below inherit it. */
  size?: 'base' | 'sm'
  className?: string
}

// Sheet-authored text — answers to questions, descriptions of meetings — is
// written as Markdown, mostly for the odd `[text](url)` link. Raw HTML is not
// enabled, so what the sheet can produce is limited to these elements, each
// mapped onto the poster's own typography instead of browser defaults.
const components: Components = {
  p: ({ children }) => <p className="mt-3 text-ink/80 first:mt-0">{children}</p>,

  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-ink underline decoration-brand decoration-2 underline-offset-4 hover:text-brand"
    >
      {children}
    </a>
  ),

  strong: ({ children }) => <strong className="font-bold text-ink">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,

  ul: ({ children }) => (
    <ul className="mt-3 list-disc space-y-1.5 pl-5 text-ink/80 marker:text-brand first:mt-0">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-ink/80 marker:text-brand first:mt-0">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="pl-1">{children}</li>,

  // Headings in sheet text are rare, and never the page's own heading level —
  // they all print as the same condensed run-in head.
  h1: ({ children }) => (
    <h4 className="mt-5 font-heading text-xl leading-none font-bold text-ink uppercase first:mt-0">
      {children}
    </h4>
  ),
  h2: ({ children }) => (
    <h4 className="mt-5 font-heading text-xl leading-none font-bold text-ink uppercase first:mt-0">
      {children}
    </h4>
  ),
  h3: ({ children }) => (
    <h4 className="mt-5 font-heading text-xl leading-none font-bold text-ink uppercase first:mt-0">
      {children}
    </h4>
  ),

  blockquote: ({ children }) => (
    <blockquote className="mt-3 border-l-4 border-brand pl-4 text-ink/70 first:mt-0">
      {children}
    </blockquote>
  ),

  code: ({ children }) => (
    <code className="bg-ink/6 px-1.5 py-0.5 font-mono text-[0.9em] text-ink">{children}</code>
  ),

  hr: () => <span aria-hidden="true" className="mt-5 block h-0.5 w-24 bg-ink/25" />,
}

const Markdown = ({ children, size = 'base', className = '' }: MarkdownProps) => (
  <div className={`${size === 'sm' ? 'text-sm' : 'text-lg'} ${className}`}>
    <ReactMarkdown components={components} remarkPlugins={[remarkGfm]}>
      {children}
    </ReactMarkdown>
  </div>
)

export default Markdown
