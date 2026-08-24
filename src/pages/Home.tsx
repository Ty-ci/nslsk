import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { sections } from '../navigation.ts'

// The hero is pulled out of the loop so an invitation band can sit directly
// under it — first thing after the headline, before anyone has to scroll.
const [hero, ...rest] = sections

const Home = () => {
  const { hash } = useLocation()

  // Arriving from another page as `/#temy` is a router navigation, not a
  // document load, so the browser doesn't scroll to the anchor by itself.
  useEffect(() => {
    if (!hash) {
      return
    }

    document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
  }, [hash])

  return (
    <>
      <section id={hero.id} className="scroll-mt-20">
        <hero.Component />
      </section>

      {rest.map(({ id, Component }) => (
        <section key={id} id={id} className="scroll-mt-20">
          <Component />
        </section>
      ))}
    </>
  )
}

export default Home
