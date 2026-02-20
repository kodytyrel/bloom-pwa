import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Papa from 'papaparse'
import { supabase } from '../lib/supabase'

interface ParsedClient {
  name: string
  address: string
  contactName: string
}

export default function ImportCsv() {
  const [parsedClients, setParsedClients] = useState<ParsedClient[]>([])
  const [fileName, setFileName] = useState('')
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<{ success: number; failed: number } | null>(null)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  function findHeaderIndex(headers: string[], ...searchTerms: string[]): number {
    return headers.findIndex((h) => {
      const lower = h.toLowerCase().trim()
      return searchTerms.some((term) => lower.includes(term))
    })
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setResult(null)
    setError('')

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete(results) {
        if (!results.data.length || !results.meta.fields?.length) {
          setError('No data found in CSV')
          return
        }

        const headers = results.meta.fields
        const nameIdx = findHeaderIndex(headers, 'client', 'name', 'project', 'job')
        const addressIdx = findHeaderIndex(headers, 'address', 'location', 'street')
        const contactIdx = findHeaderIndex(headers, 'contact', 'customer', 'owner')

        if (nameIdx === -1) {
          setError('Could not find a name column. Expected: Client Name, Project, Job, or Name')
          return
        }

        const clients: ParsedClient[] = []
        for (const row of results.data as Record<string, string>[]) {
          const values = Object.values(row)
          const name = values[nameIdx]?.trim()
          const address = addressIdx >= 0 ? values[addressIdx]?.trim() : ''
          const contact = contactIdx >= 0 ? values[contactIdx]?.trim() : ''

          if (name) {
            clients.push({ name, address: address || '', contactName: contact || '' })
          }
        }

        setParsedClients(clients)
      },
      error(err) {
        setError(`Failed to parse CSV: ${err.message}`)
      },
    })
  }

  async function handleImport() {
    if (!parsedClients.length || importing) return
    setImporting(true)
    setError('')

    let success = 0
    let failed = 0

    for (const client of parsedClients) {
      const { error } = await supabase.from('clients').insert({
        name: client.name,
        address: client.address,
        contact_name: client.contactName,
      })
      if (error) {
        failed++
      } else {
        success++
      }
    }

    setResult({ success, failed })
    setImporting(false)

    if (failed === 0) {
      setTimeout(() => navigate('/', { replace: true }), 1500)
    }
  }

  function clearFile() {
    setParsedClients([])
    setFileName('')
    setResult(null)
    setError('')
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <div className="bg-forest-500 px-4 pt-12 pb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-white">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-white">Import from CSV</h1>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Instructions */}
        <div className="bg-white rounded-2xl shadow-md p-5">
          <div className="flex items-center gap-3 mb-4">
            <svg className="w-8 h-8 text-forest-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
            </svg>
            <h2 className="text-lg font-bold text-forest-800">Import Clients from CSV</h2>
          </div>
          <p className="text-sm text-forest-600 font-medium mb-2">
            Your CSV file should have headers like:
          </p>
          <div className="bg-forest-50 rounded-lg p-3 space-y-1">
            <p className="text-xs text-forest-700">&bull; Client Name (or Project, Job, Name)</p>
            <p className="text-xs text-forest-700">&bull; Address (or Location, Street)</p>
            <p className="text-xs text-forest-700">&bull; Contact (or Customer, Owner)</p>
          </div>
          <button
            onClick={() => fileRef.current?.click()}
            className="w-full h-14 mt-5 bg-forest-500 text-cream-50 rounded-xl font-semibold flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            Select CSV File
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* File info */}
        {fileName && parsedClients.length > 0 && (
          <div className="bg-forest-50 border border-forest-300 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <svg className="w-6 h-6 text-forest-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-forest-800 truncate">{fileName}</p>
                  <p className="text-xs text-forest-500">{parsedClients.length} clients found</p>
                </div>
              </div>
              <button onClick={clearFile} className="text-forest-500">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <button
              onClick={handleImport}
              disabled={importing}
              className="w-full mt-3 py-3 bg-terracotta-400 text-cream-50 rounded-xl font-semibold text-sm"
            >
              {importing ? 'Importing...' : `Import ${parsedClients.length} Clients`}
            </button>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className={`border rounded-xl p-4 ${
            result.failed === 0
              ? 'bg-forest-100 border-forest-400'
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center gap-3">
              <svg className={`w-7 h-7 ${result.failed === 0 ? 'text-forest-500' : 'text-red-500'}`} fill="currentColor" viewBox="0 0 20 20">
                {result.failed === 0 ? (
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                ) : (
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                )}
              </svg>
              <p className={`text-base font-bold ${result.failed === 0 ? 'text-forest-800' : 'text-red-600'}`}>
                {result.failed === 0 ? 'Import Successful!' : 'Import Partial'}
              </p>
            </div>
            <div className="flex gap-6 mt-3">
              {result.success > 0 && (
                <div>
                  <p className="text-xl font-bold text-forest-600">{result.success}</p>
                  <p className="text-xs text-forest-500">Imported</p>
                </div>
              )}
              {result.failed > 0 && (
                <div>
                  <p className="text-xl font-bold text-red-500">{result.failed}</p>
                  <p className="text-xs text-red-500">Failed</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Preview */}
        {parsedClients.length > 0 && !result && (
          <div>
            <h3 className="text-base font-bold text-forest-800 px-1 mb-2">Preview</h3>
            <div className="space-y-2">
              {parsedClients.slice(0, 10).map((client, i) => (
                <div key={i} className="bg-white rounded-xl p-3">
                  <p className="text-sm font-medium text-forest-800">{client.name}</p>
                  {client.address && (
                    <p className="text-xs text-forest-500 truncate">{client.address}</p>
                  )}
                </div>
              ))}
              {parsedClients.length > 10 && (
                <p className="text-xs text-forest-400 text-center py-2">
                  ... and {parsedClients.length - 10} more clients
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
