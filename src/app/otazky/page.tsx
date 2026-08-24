import type { Metadata } from 'next'

import OtazkyContent from '@/app/otazky/_components/OtazkyContent'

// The Q&A page: a subpage rather than a section of the one-pager, because it
// grows over time and is the thing people will link to on its own. The entries
// themselves come from the sheet in the browser, so the page body is a client
// component and only the head is rendered here.
export const metadata: Metadata = {
  title: 'Otázky a odpovede',
}

const Otazky = () => <OtazkyContent />

export default Otazky
