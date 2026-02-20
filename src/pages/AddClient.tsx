import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useClients } from '../hooks/useClients'
import { useGeolocation } from '../hooks/useGeolocation'

export default function AddClient() {
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [contactName, setContactName] = useState('')
  const [saving, setSaving] = useState(false)
  const { addClient } = useClients()
  const { getAddress, loading: gpsLoading } = useGeolocation()
  const navigate = useNavigate()

  const isValid = name.trim() && address.trim()

  async function handleGps() {
    try {
      const addr = await getAddress()
      setAddress(addr)
    } catch {
      // Error is handled in the hook
    }
  }

  async function handleSave() {
    if (!isValid || saving) return
    setSaving(true)
    try {
      await addClient(name.trim(), address.trim(), contactName.trim())
      navigate('/', { replace: true })
    } catch (err) {
      console.error('Failed to add client:', err)
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <div className="bg-forest-500 px-4 pt-12 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-white">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-white">New Client</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={!isValid || saving}
          className="text-white font-semibold text-sm disabled:opacity-40"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {/* Form */}
      <div className="px-5 py-6 space-y-5">
        {/* Client Name */}
        <div>
          <label className="block text-sm font-medium text-forest-600 mb-1.5">
            Client Name *
          </label>
          <div className="relative">
            <svg className="absolute left-3 top-3.5 w-5 h-5 text-forest-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4z" clipRule="evenodd" />
            </svg>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Johnson Residence"
              autoCapitalize="words"
              className="w-full pl-10 pr-4 py-3 border border-forest-200 rounded-xl text-sm focus:outline-none focus:border-forest-400 bg-white"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-forest-600">Address *</label>
            <button
              onClick={handleGps}
              disabled={gpsLoading}
              className="flex items-center gap-1 px-3 py-1 bg-terracotta-50 rounded-full text-xs text-terracotta-400"
            >
              {gpsLoading ? (
                <div className="w-3.5 h-3.5 border-2 border-terracotta-200 border-t-terracotta-400 rounded-full animate-spin" />
              ) : (
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              )}
              Use GPS
            </button>
          </div>
          <div className="relative">
            <svg className="absolute left-3 top-3.5 w-5 h-5 text-forest-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Main St, City, State"
              rows={2}
              className="w-full pl-10 pr-4 py-3 border border-forest-200 rounded-xl text-sm focus:outline-none focus:border-forest-400 bg-white resize-none"
            />
          </div>
        </div>

        {/* Contact Name */}
        <div>
          <label className="block text-sm font-medium text-forest-600 mb-1.5">
            Contact Name
          </label>
          <div className="relative">
            <svg className="absolute left-3 top-3.5 w-5 h-5 text-forest-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <input
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Optional"
              autoCapitalize="words"
              className="w-full pl-10 pr-4 py-3 border border-forest-200 rounded-xl text-sm focus:outline-none focus:border-forest-400 bg-white"
            />
          </div>
        </div>

        {/* Create Button */}
        <button
          onClick={handleSave}
          disabled={!isValid || saving}
          className={`w-full h-14 rounded-2xl font-semibold text-base ${
            isValid
              ? 'bg-forest-500 text-cream-50'
              : 'bg-forest-200 text-forest-400'
          }`}
        >
          {saving ? 'Creating...' : 'Create Client'}
        </button>
      </div>
    </div>
  )
}
