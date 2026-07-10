// Flat spot-ink system for the poster/ballot look. Instead of a pastel rainbow
// with soft tints, everything is drawn from three flat inks — near-black,
// terracotta and a rare approval green — the way a two-to-three colour riso job
// would. Class strings are spelled out in full so Tailwind detects them.

export type Ink = 'ink' | 'brand' | 'forest'

export type InkStyle = {
  /** Solid flood fill (initial blocks, stamps). */
  solid: string
  /** Legible text colour to sit on top of `solid`. */
  onSolid: string
  /** Spot text colour on the paper background. */
  text: string
  /** Rule / border colour. */
  border: string
}

// Red leads and bookends the cycle; ink and green punctuate it.
export const inkCycle: Ink[] = ['brand', 'ink', 'forest']

export const inkStyles: Record<Ink, InkStyle> = {
  ink: { solid: 'bg-ink', onSolid: 'text-cream', text: 'text-ink', border: 'border-ink' },
  brand: { solid: 'bg-brand', onSolid: 'text-cream', text: 'text-brand', border: 'border-brand' },
  forest: {
    solid: 'bg-forest',
    onSolid: 'text-cream',
    text: 'text-forest',
    border: 'border-forest',
  },
}

/** Ink for the item at `index`, cycling through the three spot colours. */
export const inkAt = (index: number): InkStyle => inkStyles[inkCycle[index % inkCycle.length]]

/** Hard-offset shadow (no blur) that grows as the card lifts toward you on hover. */
export const offsetCard =
  'border-2 border-ink shadow-[6px_6px_0_0_var(--color-ink)] transition-[transform,box-shadow] duration-150 hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[9px_9px_0_0_var(--color-ink)]'

/** Same look, but fixed — for form/ballot panels that shouldn't react to hover. */
export const offsetStatic = 'border-2 border-ink shadow-[6px_6px_0_0_var(--color-ink)]'
