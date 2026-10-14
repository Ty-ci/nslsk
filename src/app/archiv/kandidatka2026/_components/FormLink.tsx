type FormLinkProps = {
  href: string
  /** Whose form it is — always announced to assistive tech. */
  name: string
  /** Second line. Defaults to a description of the file. */
  subtitle?: string
  className?: string
}

// The candidacy forms are the most substantive thing on the site — the full
// documents the snem actually saw — so they get a real target instead of a
// footnote link: an attachment slip, boxed and offset like everything else on
// the poster, sized to be clicked.
const FormLink = ({ href, name, subtitle, className = '' }: FormLinkProps) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className={`group flex w-fit items-center gap-3 border-2 border-ink bg-cream-light px-4 py-3 shadow-[4px_4px_0_0_var(--color-ink)] transition-[transform,box-shadow,background-color] duration-100 hover:translate-0.5 hover:bg-brand/10 hover:shadow-[2px_2px_0_0_var(--color-ink)] ${className}`}
  >
    {/* Paperclip: an attachment, drawn rather than emoji'd. */}
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-5 shrink-0 text-brand"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
    >
      <path d="M15.5 6.5 8 14a3 3 0 0 0 4.2 4.2l7.3-7.3a5 5 0 0 0-7-7l-7.6 7.5a7 7 0 0 0 9.9 9.9l3.7-3.6" />
    </svg>

    <span className="flex-1">
      <span className="block label text-ink">Kandidačný formulár - {name}</span>
      {subtitle ? (
        <span className="mt-1 block font-mono text-[11px] text-ink/55 uppercase">{subtitle}</span>
      ) : null}
    </span>
  </a>
)

export default FormLink
