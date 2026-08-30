export default function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-high-deep/40 bg-high-dim/40 px-6 py-10 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-high/50 bg-panel-bg">
        <span className="font-mono text-lg text-high-soft">!</span>
      </div>
      <div>
        <p className="font-display text-sm font-semibold text-high-soft">
          Signal lost
        </p>
        <p className="mt-1 max-w-sm font-body text-sm text-panel-muted">
          {message}
        </p>
      </div>
      <button
        onClick={onRetry}
        className="mt-1 rounded-md border border-panel-seam bg-panel-surface px-4 py-2 font-mono text-xs uppercase tracking-wide text-panel-text transition-colors hover:border-grain hover:text-grain-soft"
      >
        Retry
      </button>
    </div>
  );
}
