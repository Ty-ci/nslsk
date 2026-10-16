import { normalize } from '@/lib/google-sheets/cells'

/** `Predseda Rovnošatovej komisie` → `predseda-rovnosatovej-komisie`: for anchors and `?typ=`. */
export const slug = (value: string): string =>
  normalize(value)
    .replaceAll(/[^a-z0-9]+/g, '-')
    .replaceAll(/(^-+)|(-+$)/g, '')
