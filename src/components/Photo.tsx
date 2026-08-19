import { useState } from 'react'

import { photoUrl } from '../content.ts'
import type { InkStyle } from '../theme.ts'

type PhotoProps = {
  photoId: string
  /** Alt text — the candidate's name. */
  name: string
  /** Letter shown if the Drive file isn't public (or fails to load). */
  initials: string
  ink: InkStyle
  className?: string
}

// Candidate portrait pulled straight off Google Drive. Drive share links are
// unreliable as image sources (permissions, hotlink limits), so a failed load
// falls back to a flood-filled initial block — the poster still prints.
const Photo = ({ photoId, name, initials, ink, className = '' }: PhotoProps) => {
  const [failed, setFailed] = useState(false)

  return (
    <div
      className={`relative aspect-square overflow-hidden border-2 border-ink ${ink.solid} ${className}`}
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
          loading="lazy"
          // Grayscale so four portraits from four cameras read as one print run;
          // colour returns on hover.
          className="size-full object-cover grayscale transition-[filter] duration-200 hover:grayscale-0"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  )
}

export default Photo
