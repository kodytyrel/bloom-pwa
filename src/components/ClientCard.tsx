import type { ClientWithStats } from '../types'

interface ClientCardProps {
  client: ClientWithStats
  onClick: () => void
}

export default function ClientCard({ client, onClick }: ClientCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-md p-4 cursor-pointer active:shadow-lg transition-shadow"
    >
      {/* Top section */}
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-forest-800 truncate">
            {client.name}
          </h3>
          {client.contact_name && (
            <p className="text-sm text-forest-400 truncate">{client.contact_name}</p>
          )}
          <div className="flex items-center gap-1 mt-1">
            <svg className="w-3.5 h-3.5 text-forest-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <p className="text-xs text-forest-400 truncate">{client.address}</p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-forest-50 my-3" />

      {/* Bottom section */}
      <div>
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-terracotta-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
          </svg>
          <span className="text-sm text-forest-600">
            {client.total_items} item{client.total_items !== 1 ? 's' : ''} in {client.total_logs} log{client.total_logs !== 1 ? 's' : ''}
          </span>
        </div>
        {client.recent_materials.length > 0 && (
          <p className="text-xs text-forest-400 mt-1 truncate">
            Last: {client.recent_materials.join(', ')}
          </p>
        )}
      </div>
    </div>
  )
}
