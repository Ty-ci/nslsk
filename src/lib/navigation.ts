// Every route of the site, its menu label and the keys that unlock it — the
// one place that decides who may see and who may change what. A key names a
// row in the `keys` tab of the spreadsheet; its `Value` there is the password.
//
// Safe for the browser: it holds key *names* only, never a password.

/** Rows of the `keys` tab the site uses. Add a name here before using it below. */
export const accessKeys = ['whole-web-view', 'whole-web-edit'] as const

export type AccessKey = (typeof accessKeys)[number]

type Route = {
  path: string
  label: string
  /** Shown in the infoweb's header menu. */
  inNav: boolean
  /** The key to unlock the route and everything under it; `null` is public. */
  access: AccessKey | null
  /** The key to change what the route shows (tick a box, …), asked on top of `access`. */
  edit: AccessKey
}

export const ROUTES: Route[] = [
  { path: '/', label: 'Domov', inNav: true, access: null, edit: 'whole-web-edit' },
  {
    path: '/onboarding',
    label: 'Onboarding',
    inNav: true,
    access: 'whole-web-view',
    edit: 'whole-web-edit',
  },
  {
    path: '/vyzvy',
    label: 'Otvorené výzvy',
    inNav: true,
    access: 'whole-web-view',
    edit: 'whole-web-edit',
  },
  {
    path: '/archiv/kandidatka2026',
    label: 'Archív',
    inNav: false,
    access: 'whole-web-view',
    edit: 'whole-web-edit',
  },
]

/**
 * Any path not listed above — a 404, a page added without an entry here — is
 * locked too. Forgetting a route here hides it rather than exposing it.
 */
const defaultAccess: AccessKey = 'whole-web-view'
const defaultEdit: AccessKey = 'whole-web-edit'

export const navRoutes = ROUTES.filter((route) => route.inNav)

export const isAccessKey = (value: unknown): value is AccessKey =>
  accessKeys.some((key) => key === value)

/** The most specific route matching a path, if any. */
const routeFor = (pathname: string): Route | undefined =>
  ROUTES.filter(
    ({ path }) => pathname === path || (path !== '/' && pathname.startsWith(`${path}/`)),
  )
    .sort((a, b) => b.path.length - a.path.length)
    .at(0)

/** The key a path needs to be seen: its route's, or the default. */
export const accessFor = (pathname: string): AccessKey | null => {
  const match = routeFor(pathname)

  return match ? match.access : defaultAccess
}

/** The key a path needs for changes: its route's, or the default. */
export const editAccessFor = (pathname: string): AccessKey =>
  routeFor(pathname)?.edit ?? defaultEdit
