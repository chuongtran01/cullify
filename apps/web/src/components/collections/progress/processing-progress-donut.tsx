type ProcessingProgressDonutProps = {
  progress: number;
};

export function ProcessingProgressDonut({
  progress,
}: ProcessingProgressDonutProps) {
  const processed = Math.min(Math.max(progress, 0), 100);
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (processed / 100) * circumference;

  return (
    <div
      className="relative mx-auto grid size-40 place-items-center sm:mx-0"
      role="img"
      aria-label={`${processed}% complete`}
    >
      <svg
        aria-hidden
        className="absolute inset-0 size-40 -rotate-90"
        viewBox="0 0 160 160"
      >
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="10"
        />
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="white"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          strokeWidth="10"
        />
      </svg>
      <div className="text-center">
        <div className="text-4xl font-normal leading-none text-white">
          {processed}%
        </div>
        <div className="mt-1 text-xs text-white/50">complete</div>
      </div>
    </div>
  );
}
