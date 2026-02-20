import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { QuickSelectMaterial, SelectedMaterial } from '../types'

export function useQuickSelectMaterials() {
  const [materials, setMaterials] = useState<QuickSelectMaterial[]>([])
  const [loading, setLoading] = useState(true)

  const fetchMaterials = useCallback(async () => {
    const { data, error } = await supabase
      .from('quick_select_materials')
      .select('*')
      .order('name', { ascending: true })

    if (!error && data) setMaterials(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchMaterials()

    const channel = supabase
      .channel('quick-select-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'quick_select_materials' }, () => fetchMaterials())
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [fetchMaterials])

  async function addQuickSelectMaterial(name: string, unit: string) {
    const { error } = await supabase
      .from('quick_select_materials')
      .insert({ name, unit, is_default: false })
    if (error) throw error
  }

  async function removeQuickSelectMaterial(id: string) {
    const { error } = await supabase
      .from('quick_select_materials')
      .delete()
      .eq('id', id)
    if (error) throw error
  }

  return { materials, loading, addQuickSelectMaterial, removeQuickSelectMaterial }
}

export async function addMaterialLog(
  clientId: string,
  items: SelectedMaterial[],
  notes: string | null
) {
  // Insert the log
  const { data: log, error: logError } = await supabase
    .from('material_logs')
    .insert({ client_id: clientId, notes })
    .select('id')
    .single()

  if (logError || !log) throw logError ?? new Error('Failed to create log')

  // Insert all items
  const itemRows = items.map((item) => ({
    log_id: log.id,
    name: item.name,
    quantity: item.quantity,
    unit: item.unit,
  }))

  const { error: itemsError } = await supabase
    .from('material_items')
    .insert(itemRows)

  if (itemsError) throw itemsError
}

export async function deleteMaterialLog(logId: string) {
  const { error } = await supabase
    .from('material_logs')
    .delete()
    .eq('id', logId)
  if (error) throw error
}

export async function updateMaterialLogDate(logId: string, newDate: string) {
  const { error } = await supabase
    .from('material_logs')
    .update({ date: newDate })
    .eq('id', logId)
  if (error) throw error
}
