export function StatSkeleton() {
  return (
    <div className="rounded-lg border border-panel-seam bg-panel-surface p-4 sm:p-5">
      <div className="mb-3 h-2.5 w-16 animate-pulse rounded bg-panel-surface2" />
      <div className="h-14 animate-pulse rounded-md bg-panel-surface2" />
    </div>
  );
}

export function RowSkeleton() {
  return (
    <tr>
      {Array.from({ length: 6 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-3 w-full animate-pulse rounded bg-panel-surface2" />
        </td>
      ))}
    </tr>
  );
}

export function ChartSkeleton() {
  return (
    <div className="h-64 animate-pulse rounded-lg border border-panel-seam bg-panel-surface sm:h-80" />
  );
}
