// The one-pager is parked while the content is being written: `/` is just the
// scout lily, turning. The real page — header, sections, colophon — lives at
// `/dev` (see `(pages)/dev/`) until it is ready to move back here.
const Home = () => (
  <div className="flex min-h-screen items-center justify-center p-6">
    <img
      src="/favicon.svg"
      alt="Skautská ľalia"
      // Sized in the markup rather than left to the SVG's own 134px, since the
      // lily is the whole page.
      width={224}
      height={219}
      className="w-40 animate-spin-slow md:w-56"
    />
  </div>
)

export default Home
