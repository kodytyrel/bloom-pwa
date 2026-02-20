// Database row types (match Supabase tables exactly)

export interface Client {
  id: string
  name: string
  address: string
  contact_name: string
  created_at: string
}

export interface MaterialLog {
  id: string
  client_id: string
  date: string
  notes: string | null
  created_at: string
}

export interface MaterialItem {
  id: string
  log_id: string
  name: string
  quantity: number
  unit: string
}

export interface QuickSelectMaterial {
  id: string
  name: string
  unit: string
  is_default: boolean
  created_at: string
}

// Joined types for display
export interface ClientWithStats extends Client {
  total_logs: number
  total_items: number
  recent_materials: string[]
}

export interface MaterialLogWithItems extends MaterialLog {
  material_items: MaterialItem[]
}

// Form types
export interface SelectedMaterial {
  name: string
  unit: string
  quantity: number
}
