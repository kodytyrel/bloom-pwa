import type { QuickSelectMaterial } from '../types'

interface MaterialChipProps {
  material: QuickSelectMaterial
  selected: boolean
  onToggle: () => void
  onRemove?: () => void
}

export default function MaterialChip({ material, selected, onToggle, onRemove }: MaterialChipProps) {
  return (
    <div
      onClick={onToggle}
      className={`relative rounded-xl p-3 cursor-pointer border-2 transition-colors ${
        selected
          ? 'bg-forest-100 border-forest-500'
          : 'bg-white border-forest-200'
      }`}
    >
      {/* Selection indicator */}
      {selected && (
        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-forest-500 flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}

      {/* Material name */}
      <p className="text-sm font-medium text-forest-800 line-clamp-2 pr-5">
        {material.name}
      </p>

      {/* Unit badge */}
      <span className={`inline-block mt-1.5 text-xs px-2 py-0.5 rounded-lg ${
        selected
          ? 'bg-forest-200 text-forest-600'
          : 'bg-terracotta-50 text-terracotta-500'
      }`}>
        {material.unit}
      </span>

      {/* Remove button for custom materials */}
      {!material.is_default && onRemove && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove() }}
          className="absolute top-1 left-1 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center"
        >
          <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  )
}
