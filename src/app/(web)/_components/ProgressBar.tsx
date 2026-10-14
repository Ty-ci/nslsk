type ProgressBarProps = {
  done: number
  total: number
  /** What is being counted, for screen readers: „Funo — onboarding". */
  label: string
  className?: string
}

// A track with a navy fill, always next to the count in words — the bar alone
// carries nothing a screen reader or a grayscale print can't get from the text.
const ProgressBar = ({ done, total, label, className = '' }: ProgressBarProps) => {
  const percent = total === 0 ? 0 : Math.round((done / total) * 100)

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={done}
        className="h-2 flex-1 overflow-hidden rounded-full bg-line"
      >
        <div
          className="h-full rounded-full bg-navy transition-[width] duration-200 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-sm font-semibold text-navy tabular-nums">
        {done} / {total}
      </span>
    </div>
  )
}

export default ProgressBar
