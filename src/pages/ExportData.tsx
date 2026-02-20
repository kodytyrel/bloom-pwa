import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Papa from 'papaparse'
import { supabase } from '../lib/supabase'
import type { Client, MaterialLog, MaterialItem } from '../types'

export default function ExportData() {
  const navigate = useNavigate()
  const [clients, setClients] = useState<Client[]>([])
  const [logs, setLogs] = useState<MaterialLog[]>([])
  const [items, setItems] = useState<MaterialItem[]>([])
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [exportResult, setExportResult] = useState<'success' | 'error' | null>(null)

  useEffect(() => {
    async function fetchAll() {
      const [c, l, i] = await Promise.all([
        supabase.from('clients').select('*').order('created_at', { ascending: false }),
        supabase.from('material_logs').select('*'),
        supabase.from('material_items').select('*'),
      ])
      if (c.data) setClients(c.data)
      if (l.data) setLogs(l.data)
      if (i.data) setItems(i.data)
      setLoading(false)
    }
    fetchAll()
  }, [])

  const totalLogs = logs.length
  const totalItems = items.length

  function handleExport() {
    setExporting(true)
    setExportResult(null)

    try {
      // Build CSV rows: one row per material item, with client and log context
      const rows: Record<string, string>[] = []

      for (const client of clients) {
        const clientLogs = logs.filter((l) => l.client_id === client.id)

        if (clientLogs.length === 0) {
          // Include clients with no logs
          rows.push({
            'Client Name': client.name,
            'Contact': client.contact_name,
            'Address': client.address,
            'Date': '',
            'Material': '',
            'Quantity': '',
            'Unit': '',
            'Notes': '',
          })
        }

        for (const log of clientLogs) {
          const logItems = items.filter((i) => i.log_id === log.id)
          const dateStr = new Date(log.date).toLocaleDateString('en-US')

          if (logItems.length === 0) {
            rows.push({
              'Client Name': client.name,
              'Contact': client.contact_name,
              'Address': client.address,
              'Date': dateStr,
              'Material': '',
              'Quantity': '',
              'Unit': '',
              'Notes': log.notes ?? '',
            })
          }

          for (const item of logItems) {
            rows.push({
              'Client Name': client.name,
              'Contact': client.contact_name,
              'Address': client.address,
              'Date': dateStr,
              'Material': item.name,
              'Quantity': String(item.quantity),
              'Unit': item.unit,
              'Notes': log.notes ?? '',
            })
          }
        }
      }

      const csv = Papa.unparse(rows)
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const now = new Date()
      const filename = `bloom_export_${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}.csv`

      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.click()
      URL.revokeObjectURL(url)

      setExportResult('success')
    } catch (err) {
      console.error('Export failed:', err)
      setExportResult('error')
    } finally {
      setExporting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-forest-200 border-t-forest-500 rounded-full animate-spin" />
      </div>
    )
  }

  const hasData = clients.length > 0

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <div className="bg-forest-500 px-4 pt-12 pb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-white">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-white">Export Data</h1>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Stats Card */}
        <div className={`rounded-2xl p-5 ${hasData ? 'bg-forest-500' : 'bg-gray-400'}`}>
          <div className="flex items-center gap-3 mb-5">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
            <h2 className="text-xl font-bold text-white">
              {hasData ? 'Your Data' : 'No Data'}
            </h2>
          </div>
          {hasData && (
            <div className="flex justify-around">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{clients.length}</p>
                <p className="text-sm text-forest-100">Clients</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{totalLogs}</p>
                <p className="text-sm text-forest-100">Logs</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{totalItems}</p>
                <p className="text-sm text-forest-100">Items</p>
              </div>
            </div>
          )}
        </div>

        {/* Export Button */}
        <div className="bg-white rounded-2xl p-4">
          <h3 className="text-base font-bold text-forest-800 mb-3">Export Options</h3>
          <button
            onClick={handleExport}
            disabled={!hasData || exporting}
            className={`w-full h-14 rounded-xl font-semibold flex items-center justify-center gap-2 ${
              hasData ? 'bg-terracotta-400 text-white' : 'bg-gray-300 text-gray-500'
            }`}
          >
            {exporting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating Export...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Export as CSV
              </>
            )}
          </button>
          {!hasData && (
            <p className="text-xs text-forest-400 mt-2">Add clients and materials before exporting</p>
          )}
        </div>

        {/* Export Result */}
        {exportResult && (
          <div className={`border rounded-xl p-4 ${
            exportResult === 'success'
              ? 'bg-forest-100 border-forest-400'
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center gap-3">
              <svg className={`w-7 h-7 ${exportResult === 'success' ? 'text-forest-500' : 'text-red-500'}`} fill="currentColor" viewBox="0 0 20 20">
                {exportResult === 'success' ? (
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                ) : (
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                )}
              </svg>
              <p className={`font-bold ${exportResult === 'success' ? 'text-forest-800' : 'text-red-600'}`}>
                {exportResult === 'success' ? 'Export Downloaded!' : 'Export Failed'}
              </p>
            </div>
          </div>
        )}

        {/* Data Preview */}
        {hasData && (
          <div>
            <h3 className="text-base font-bold text-forest-800 px-1 mb-2">Data Preview</h3>
            <div className="space-y-2">
              {clients.slice(0, 5).map((client) => (
                <div key={client.id} className="bg-white rounded-xl p-3">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium text-forest-800">{client.name}</p>
                    <p className="text-xs text-forest-500">
                      {logs.filter((l) => l.client_id === client.id).length} logs
                    </p>
                  </div>
                  <p className="text-xs text-forest-400 truncate">{client.address}</p>
                </div>
              ))}
              {clients.length > 5 && (
                <div className="bg-forest-50 rounded-xl p-3 text-center">
                  <p className="text-sm text-forest-600">... and {clients.length - 5} more clients</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
