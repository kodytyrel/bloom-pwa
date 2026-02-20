import { useParams, useNavigate } from 'react-router-dom'
import { useClient } from '../hooks/useClients'
import MaterialLogCard from '../components/MaterialLogCard'
import EmptyState from '../components/EmptyState'

export default function ClientDetail() {
  const { id } = useParams<{ id: string }>()
  const { client, logs, loading, refetch } = useClient(id!)
  const navigate = useNavigate()

  if (loading || !client) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-forest-200 border-t-forest-500 rounded-full animate-spin" />
      </div>
    )
  }

  const totalItems = logs.reduce((sum, log) => sum + log.material_items.length, 0)

  return (
    <div className="min-h-screen bg-cream-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-b from-forest-500 to-forest-600 px-5 pt-12 pb-6">
        {/* Nav bar */}
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/')} className="text-white">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-white">Client Details</h1>
        </div>

        {/* Client info */}
        <h2 className="text-2xl font-bold text-white">{client.name}</h2>
        {client.contact_name && (
          <div className="flex items-center gap-2 mt-2">
            <svg className="w-4 h-4 text-forest-100" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-forest-100">{client.contact_name}</p>
          </div>
        )}
        <div className="flex items-center gap-2 mt-1">
          <svg className="w-4 h-4 text-forest-100 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-forest-100 line-clamp-2">{client.address}</p>
        </div>

        {/* Stats */}
        <div className="flex gap-3 mt-4">
          <div className="flex-1 bg-white/15 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-4 h-4 text-forest-100" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
              </svg>
              <span className="text-xs text-forest-100">Total Items</span>
            </div>
            <p className="text-lg font-bold text-white">{totalItems}</p>
          </div>
          <div className="flex-1 bg-white/15 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-4 h-4 text-forest-100" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <span className="text-xs text-forest-100">Total Logs</span>
            </div>
            <p className="text-lg font-bold text-white">{logs.length}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      {logs.length === 0 ? (
        <EmptyState
          icon="📦"
          title="No Materials Yet"
          subtitle="Start logging materials for this client."
          actionLabel="Log First Material"
          onAction={() => navigate(`/clients/${id}/add-material`)}
        />
      ) : (
        <div className="px-4 pt-4 space-y-3">
          {logs.map((log) => (
            <MaterialLogCard key={log.id} log={log} onDeleted={refetch} />
          ))}
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => navigate(`/clients/${id}/add-material`)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-terracotta-400 text-cream-50 rounded-full shadow-lg flex items-center justify-center"
      >
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  )
}
