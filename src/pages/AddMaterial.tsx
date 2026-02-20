import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuickSelectMaterials, addMaterialLog } from '../hooks/useMaterials'
import type { SelectedMaterial } from '../types'
import MaterialChip from '../components/MaterialChip'
import MaterialQuantityEditor from '../components/MaterialQuantityEditor'

export default function AddMaterial() {
  const { id: clientId } = useParams<{ id: string }>()
  const { materials, addQuickSelectMaterial, removeQuickSelectMaterial } = useQuickSelectMaterials()
  const navigate = useNavigate()

  const [selectedItems, setSelectedItems] = useState<SelectedMaterial[]>([])
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  // Custom material dialog state
  const [showDialog, setShowDialog] = useState(false)
  const [customName, setCustomName] = useState('')
  const [customUnit, setCustomUnit] = useState('')

  const isValid = selectedItems.length > 0 && selectedItems.every((i) => i.quantity > 0)

  function toggleMaterial(name: string, unit: string) {
    const exists = selectedItems.find((i) => i.name === name)
    if (exists) {
      setSelectedItems(selectedItems.filter((i) => i.name !== name))
    } else {
      setSelectedItems([...selectedItems, { name, unit, quantity: 1 }])
    }
  }

  function updateItem(updated: SelectedMaterial) {
    setSelectedItems(selectedItems.map((i) => (i.name === updated.name ? updated : i)))
  }

  async function handleSave() {
    if (!isValid || saving || !clientId) return
    setSaving(true)
    try {
      await addMaterialLog(clientId, selectedItems, notes.trim() || null)
      navigate(`/clients/${clientId}`, { replace: true })
    } catch (err) {
      console.error('Failed to save material log:', err)
      setSaving(false)
    }
  }

  async function handleAddCustom() {
    if (!customName.trim() || !customUnit.trim()) return
    try {
      await addQuickSelectMaterial(customName.trim(), customUnit.trim())
      setShowDialog(false)
      setCustomName('')
      setCustomUnit('')
    } catch (err) {
      console.error('Failed to add custom material:', err)
    }
  }

  async function handleRemoveMaterial(id: string) {
    if (!confirm('Remove this custom material?')) return
    try {
      await removeQuickSelectMaterial(id)
      // Also remove from selected if selected
      setSelectedItems(selectedItems.filter((i) => {
        const mat = materials.find((m) => m.id === id)
        return mat ? i.name !== mat.name : true
      }))
    } catch (err) {
      console.error('Failed to remove material:', err)
    }
  }

  return (
    <div className="min-h-screen bg-cream-50 pb-8">
      {/* Header */}
      <div className="bg-terracotta-400 px-4 pt-12 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-cream-50">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-cream-50">Log Materials</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={!isValid || saving}
          className="text-cream-50 font-semibold text-sm disabled:opacity-40"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Selected Materials */}
        {selectedItems.length > 0 && (
          <div className="bg-white rounded-2xl p-4">
            <h3 className="text-base font-bold text-forest-800 mb-3">Selected Materials</h3>
            <div className="space-y-2">
              {selectedItems.map((item) => (
                <MaterialQuantityEditor key={item.name} item={item} onChange={updateItem} />
              ))}
            </div>
          </div>
        )}

        {/* Material Selection */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-bold text-forest-800">Select Materials</h3>
              <p className="text-xs text-forest-400">Tap to add, tap again to remove</p>
            </div>
            <button
              onClick={() => setShowDialog(true)}
              className="flex items-center gap-1 text-terracotta-400 text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Custom
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {materials.map((mat) => (
              <MaterialChip
                key={mat.id}
                material={mat}
                selected={!!selectedItems.find((i) => i.name === mat.name)}
                onToggle={() => toggleMaterial(mat.name, mat.unit)}
                onRemove={!mat.is_default ? () => handleRemoveMaterial(mat.id) : undefined}
              />
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-forest-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
            </svg>
            <h3 className="text-base font-bold text-forest-800">Notes (Optional)</h3>
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes about this material entry..."
            rows={3}
            className="w-full px-3 py-2 border border-forest-200 rounded-xl text-sm bg-forest-50 focus:outline-none focus:border-forest-400 resize-none"
          />
        </div>
      </div>

      {/* Custom Material Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-base font-bold text-forest-800 mb-4">Add Quick-Select Material</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-forest-600 mb-1">Material Name *</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g., Red Mulch"
                  className="w-full px-3 py-2.5 border border-forest-200 rounded-lg text-sm focus:outline-none focus:border-forest-400"
                />
              </div>
              <div>
                <label className="block text-sm text-forest-600 mb-1">Unit *</label>
                <input
                  type="text"
                  value={customUnit}
                  onChange={(e) => setCustomUnit(e.target.value)}
                  placeholder="e.g., cubic yards, bags"
                  className="w-full px-3 py-2.5 border border-forest-200 rounded-lg text-sm focus:outline-none focus:border-forest-400"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowDialog(false); setCustomName(''); setCustomUnit('') }}
                className="flex-1 py-2.5 text-sm text-forest-500 border border-forest-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustom}
                disabled={!customName.trim() || !customUnit.trim()}
                className="flex-1 py-2.5 text-sm text-cream-50 bg-forest-500 rounded-xl disabled:bg-forest-200 disabled:text-forest-400"
              >
                Add Material
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
