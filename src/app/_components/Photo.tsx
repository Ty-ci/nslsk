'use client'

import { useState } from 'react'

import { photoUrl } from '@/app/_data/content'
import { type InkStyle, inkStyles } from '@/app/_lib/theme'

type PhotoProps = {
  photoId: string
  /** Alt text — the candidate's name. */
  name: string
  /** Letter shown if the Drive file isn't public (or fails to load). */
  initials: string
  /** Flood fill behind the fallback initial. */
  ink?: InkStyle
  /** Size + placement of the pasted-up portrait, e.g. `w-40`. */
  className?: string
  /** Tilt in degrees. Alternate the sign between photos so a row looks pasted up. */
  tilt?: number
}

// Candidate portrait pulled straight off Google Drive, pasted onto the poster
// slightly askew and printed in one plate: 2px rule, hard offset shadow, no
// rounding. Drive share links are unreliable as image sources (permissions,
// hotlink limits), so a failed load falls back to a flood-filled initial —
// the poster still prints.
const Photo = ({
  photoId,
  name,
  initials,
  ink = inkStyles.ink,
  className = '',
  tilt = -1.5,
}: PhotoProps) => {
  const [failed, setFailed] = useState(false)

  return (
    <div
      className={`relative aspect-4/5 shrink-0 overflow-hidden border-2 border-ink shadow-[6px_6px_0_0_var(--color-ink)] transition-transform duration-150 hover:rotate-0 ${ink.solid} ${className}`}
      style={{ rotate: `${tilt}deg` }}
    >
      {failed ? (
        <span
          className={`absolute inset-0 flex items-center justify-center font-display text-6xl ${ink.onSolid}`}
        >
          {initials}
        </span>
      ) : (
        <img
          src={photoUrl(photoId)}
          alt={name}
          className="size-full object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  )
}

export default Photo
