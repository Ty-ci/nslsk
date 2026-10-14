'use client'

// The browser half of the password gate: remembers entered passwords in
// localStorage, and decides per path whether to show the page (or allow
// changes), check a stored password with the server, or ask for one. The look
// is up to each site — see the `AccessGate` components of the infoweb and the
// archive, and the infoweb's `EditGate`.

import { useEffect, useState } from 'react'

import { verifyAccess } from '@/lib/access/actions'
import { accessFor, type AccessKey, editAccessFor } from '@/lib/navigation'

const storageKey = (key: AccessKey) => `nslsk:access:${key}`

// Kept in memory too: localStorage can be blocked (private windows, strict
// settings), and the session should still work then — just not persist.
const remembered = new Map<AccessKey, string>()

/** Keys the server has confirmed during this page load, so client-side
 * navigation between locked pages doesn't ask the server again. */
const confirmed = new Set<AccessKey>()

/** The stored password for `key`, or `''` when there is none. */
export const storedPassword = (key: AccessKey | null): string => {
  if (key === null) {
    return ''
  }

  try {
    return remembered.get(key) ?? window.localStorage.getItem(storageKey(key)) ?? ''
  } catch {
    return ''
  }
}

const remember = (key: AccessKey, password: string) => {
  remembered.set(key, password)
  confirmed.add(key)
  try {
    window.localStorage.setItem(storageKey(key), password)
  } catch {
    // Storage unavailable: the in-memory copy carries this visit.
  }
}

const forget = (key: AccessKey) => {
  remembered.delete(key)
  confirmed.delete(key)
  try {
    window.localStorage.removeItem(storageKey(key))
  } catch {
    // Nothing stored, nothing to remove.
  }
}

/** The stored password for the key that guards `pathname`. */
export const passwordFor = (pathname: string): string => storedPassword(accessFor(pathname))

/** The stored password for the key that allows changes at `pathname`. */
export const editPasswordFor = (pathname: string): string => storedPassword(editAccessFor(pathname))

export type AccessState = 'checking' | 'open' | 'locked'

/**
 * Whether `key` is unlocked in this browser. `null` (public) is open at once;
 * a key starts as `checking` (on the server, too, so hydration matches), then
 * opens if a stored password still works, or turns `locked` and waits for
 * `unlock`. A stored password that stopped working is dropped.
 */
const useKey = (key: AccessKey | null) => {
  // What this browser has found out so far, tagged with the key it was about
  // — so moving to a page behind another key starts over at `checking`.
  const [outcome, setOutcome] = useState<{ key: AccessKey; granted: boolean } | null>(null)

  let state: AccessState = 'checking'
  if (key === null || confirmed.has(key)) {
    state = 'open'
  } else if (outcome?.key === key) {
    state = outcome.granted ? 'open' : 'locked'
  }

  useEffect(() => {
    if (key === null || confirmed.has(key)) {
      return undefined
    }

    let isActive = true
    const password = storedPassword(key)
    const settle = (granted: boolean) => {
      if (!isActive) {
        return
      }
      if (granted) {
        remember(key, password)
      } else {
        forget(key)
      }
      setOutcome({ key, granted })
    }

    // No stored password settles as "locked" without asking the server;
    // offline or a server failure does too — better ask again than show.
    ;(password ? verifyAccess(key, password) : Promise.resolve(false)).then(settle, () =>
      settle(false),
    )

    return () => {
      isActive = false
    }
  }, [key])

  /** Tries a password; on success it is stored and the page opens. */
  const unlock = async (password: string): Promise<boolean> => {
    if (key === null) {
      return true
    }

    const granted = await verifyAccess(key, password)
    if (granted) {
      remember(key, password)
      setOutcome({ key, granted })
    }

    return granted
  }

  return { state, unlock }
}

/** Whether the page at `pathname` may be shown. */
export const useAccess = (pathname: string) => useKey(accessFor(pathname))

/** Whether what the page at `pathname` shows may be changed from this browser. */
export const useEditAccess = (pathname: string) => useKey(editAccessFor(pathname))
