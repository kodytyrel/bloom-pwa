import { useState } from 'react'
import type { MaterialLogWithItems } from '../types'
import { deleteMaterialLog, updateMaterialLogDate } from '../hooks/useMaterials'

interface MaterialLogCardProps {
  log: MaterialLogWithItems
  onDeleted: () => void
}

export default function MaterialLogCard({ log, onDeleted }: MaterialLogCardProps) {
  const [editingDate, setEditingDate] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const date = new Date(log.date)
  const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

  async function handleDelete() {
    if (!confirm('Delete this material log?')) return
    setDeleting(true)
    try {
      await deleteMaterialLog(log.id)
      onDeleted()
    } catch (err) {
      console.error('Failed to delete log:', err)
      setDeleting(false)
    }
  }

  async function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newDate = new Date(e.target.value).toISOString()
    try {
      await updateMaterialLogDate(log.id, newDate)
      setEditingDate(false)
      onDeleted() // refetch
    } catch (err) {
      console.error('Failed to update date:', err)
    }
  }

  // Format for datetime-local input
  const inputDate = new Date(log.date)
  const localDateStr = new Date(inputDate.getTime() - inputDate.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16)

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4">
      {/* Timestamp */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-forest-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-xs text-forest-400">{dateStr}</p>
            <p className="text-sm font-bold text-forest-800">{timeStr}</p>
          </div>
        </div>
        <button
          onClick={() => setEditingDate(!editingDate)}
          className="w-9 h-9 rounded-full bg-forest-50 flex items-center justify-center"
        >
          <svg className="w-4 h-4 text-forest-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
      </div>

      {/* Date editor */}
      {editingDate && (
        <div className="mt-2">
          <input
            type="datetime-local"
            defaultValue={localDateStr}
            onChange={handleDateChange}
            className="w-full px-3 py-2 border border-forest-200 rounded-xl text-sm"
          />
        </div>
      )}

      {/* Divider */}
      <div className="h-px bg-forest-50 my-3" />

      {/* Material items */}
      <div className="space-y-2">
        {log.material_items.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-terracotta-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
              </svg>
              <span className="text-sm font-medium text-forest-800">{item.name}</span>
            </div>
            <span className="text-xs font-bold text-terracotta-500 bg-terracotta-50 px-2 py-1 rounded-xl">
              {item.quantity} {item.unit}
            </span>
          </div>
        ))}
      </div>

      {/* Notes */}
      {log.notes && (
        <>
          <div className="h-px bg-forest-50 my-3" />
          <div className="flex items-start gap-2">
            <svg className="w-3.5 h-3.5 text-forest-400 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
            </svg>
            <p className="text-xs text-forest-500">{log.notes}</p>
          </div>
        </>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-2 mt-3">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="w-9 h-9 rounded-full flex items-center justify-center text-red-500 hover:bg-red-50"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  )
}
