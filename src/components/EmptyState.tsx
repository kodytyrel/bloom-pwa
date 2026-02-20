interface EmptyStateProps {
  icon: string
  title: string
  subtitle: string
  actionLabel?: string
  onAction?: () => void
  secondaryLabel?: string
  onSecondary?: () => void
}

export default function EmptyState({
  icon,
  title,
  subtitle,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-8 py-16">
      <div className="w-24 h-24 rounded-full bg-forest-100 flex items-center justify-center mb-6">
        <span className="text-5xl">{icon}</span>
      </div>
      <h2 className="text-xl font-bold text-forest-800 mb-2">{title}</h2>
      <p className="text-sm text-forest-400 text-center mb-8">{subtitle}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="w-full max-w-xs h-14 bg-forest-500 text-cream-50 rounded-2xl font-semibold text-base"
        >
          {actionLabel}
        </button>
      )}
      {secondaryLabel && onSecondary && (
        <button
          onClick={onSecondary}
          className="w-full max-w-xs h-12 mt-3 border border-forest-200 text-forest-600 rounded-xl text-sm"
        >
          {secondaryLabel}
        </button>
      )}
    </div>
  )
}
