// Muted accent palette shared across sections. Cards, stats and badges cycle
// through these so the page feels playful without leaning on the red brand
// colour. Class strings are written out in full so Tailwind can detect them.

export type Accent = 'brand' | 'forest' | 'gold' | 'sky'

export type AccentStyle = {
  /** Solid fill with legible white text (avatars, badges). */
  solid: string
  /** Soft tinted background for chips and icon bubbles. */
  soft: string
  /** Accent text colour on light backgrounds. */
  text: string
  /** Border colour (e.g. stat top-rules on dark backgrounds). */
  border: string
}

export const accentCycle: Accent[] = ['brand', 'forest', 'gold', 'sky']

export const accentStyles: Record<Accent, AccentStyle> = {
  brand: { solid: 'bg-brand', soft: 'bg-brand/10', text: 'text-brand', border: 'border-brand' },
  forest: {
    solid: 'bg-forest',
    soft: 'bg-forest/10',
    text: 'text-forest',
    border: 'border-forest',
  },
  gold: {
    solid: 'bg-gold-dark',
    soft: 'bg-gold/20',
    text: 'text-gold-dark',
    border: 'border-gold',
  },
  sky: { solid: 'bg-sky-dark', soft: 'bg-sky/20', text: 'text-sky-dark', border: 'border-sky' },
}

/** Accent for the item at `index`, cycling through the palette. */
export const accentAt = (index: number): AccentStyle =>
  accentStyles[accentCycle[index % accentCycle.length]]
