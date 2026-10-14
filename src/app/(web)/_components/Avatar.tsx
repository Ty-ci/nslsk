// Initials in a circle — until there are photos (DESIGN_SPECS.md §6.14).
// `Biely Medveď` → `BM`, `Funo` → `FU`.
const initials = (name: string): string => {
  const words = name.split(/\s+/).filter(Boolean)

  return (words.length > 1 ? words.map((word) => word[0]).join('') : name.slice(0, 2))
    .slice(0, 2)
    .toUpperCase()
}

const Avatar = ({ name, className = '' }: { name: string; className?: string }) => (
  <span
    aria-hidden="true"
    className={`inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-tint text-sm font-bold text-navy ${className}`}
  >
    {initials(name)}
  </span>
)

export default Avatar
