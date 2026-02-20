import type { SelectedMaterial } from '../types'

interface MaterialQuantityEditorProps {
  item: SelectedMaterial
  onChange: (updated: SelectedMaterial) => void
}

export default function MaterialQuantityEditor({ item, onChange }: MaterialQuantityEditorProps) {
  function decrement() {
    const newQty = Math.max(0.5, item.quantity - 0.5)
    onChange({ ...item, quantity: newQty })
  }

  function increment() {
    onChange({ ...item, quantity: item.quantity + 0.5 })
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const val = parseFloat(e.target.value)
    if (!isNaN(val) && val >= 0) {
      onChange({ ...item, quantity: val })
    }
  }

  return (
    <div className="bg-forest-50 rounded-xl p-3">
      <p className="text-sm font-medium text-forest-800 mb-2">{item.name}</p>
      <div className="flex items-center gap-2">
        <button
          onClick={decrement}
          className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-forest-500 shadow-sm"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>
        <input
          type="number"
          value={item.quantity}
          onChange={handleInput}
          step="0.5"
          min="0"
          className="w-20 text-center bg-white border border-forest-200 rounded-lg py-1.5 text-sm font-medium text-forest-800"
        />
        <button
          onClick={increment}
          className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-forest-500 shadow-sm"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </button>
        <span className="text-sm text-forest-500 ml-1">{item.unit}</span>
      </div>
    </div>
  )
}
