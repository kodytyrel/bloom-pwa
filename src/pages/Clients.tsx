import { useNavigate } from 'react-router-dom'
import { useClients } from '../hooks/useClients'
import { useAuth } from '../hooks/useAuth'
import ClientCard from '../components/ClientCard'
import EmptyState from '../components/EmptyState'

export default function Clients() {
  const { clients, loading } = useClients()
  const { signOut } = useAuth()
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-forest-200 border-t-forest-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-b from-forest-500 to-forest-600 px-4 pt-12 pb-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-forest-100 text-sm">Materials Tracker</p>
            <h1 className="text-3xl font-bold text-white">Clients</h1>
          </div>
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => navigate('/export')}
              className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"
            >
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={() => navigate('/import')}
              className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"
            >
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={signOut}
              className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"
            >
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {clients.length === 0 ? (
        <EmptyState
          icon="🌿"
          title="No Clients Yet"
          subtitle="Start tracking your landscaping materials by adding your first client."
          actionLabel="Add Your First Client"
          onAction={() => navigate('/clients/new')}
          secondaryLabel="Import from CSV"
          onSecondary={() => navigate('/import')}
        />
      ) : (
        <div className="px-4 pt-4">
          <p className="text-sm font-semibold text-forest-600 mb-3">
            {clients.length} Active Client{clients.length !== 1 ? 's' : ''}
          </p>
          <div className="space-y-3">
            {clients.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                onClick={() => navigate(`/clients/${client.id}`)}
              />
            ))}
          </div>
        </div>
      )}

      {/* FAB */}
      {clients.length > 0 && (
        <button
          onClick={() => navigate('/clients/new')}
          className="fixed bottom-6 right-6 w-14 h-14 bg-terracotta-400 text-cream-50 rounded-full shadow-lg flex items-center justify-center"
        >
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  )
}
