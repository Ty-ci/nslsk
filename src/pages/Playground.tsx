import { useState } from 'react'

const Playground = () => {
  const [count, setCount] = useState(0)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Playground</h1>
      <p className="text-slate-600">
        The interactive half of the mix of both. This is ordinary React with client-side state — the
        same code you would write in Next.js.
      </p>

      <div className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-6">
        <button
          onClick={() => setCount((c) => c - 1)}
          className="size-10 rounded-md bg-slate-100 text-lg font-medium hover:bg-slate-200"
        >
          −
        </button>
        <span className="min-w-[3ch] text-center text-2xl font-semibold tabular-nums">{count}</span>
        <button
          onClick={() => setCount((c) => c + 1)}
          className="size-10 rounded-md bg-slate-900 text-lg font-medium text-white hover:bg-slate-700"
        >
          +
        </button>
      </div>
    </div>
  )
}

export default Playground
