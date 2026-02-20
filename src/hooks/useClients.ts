import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Client, ClientWithStats, MaterialLogWithItems, MaterialItem } from '../types'

export function useClients() {
  const [clients, setClients] = useState<ClientWithStats[]>([])
  const [loading, setLoading] = useState(true)

  const fetchClients = useCallback(async () => {
    const { data: clientRows, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false })

    if (error || !clientRows) {
      console.error('Error fetching clients:', error)
      setLoading(false)
      return
    }

    // Fetch all logs and items to compute stats
    const { data: logs } = await supabase
      .from('material_logs')
      .select('id, client_id')

    const { data: items } = await supabase
      .from('material_items')
      .select('log_id, name')

    const logsMap = new Map<string, string[]>() // client_id -> log_ids
    for (const log of logs ?? []) {
      const existing = logsMap.get(log.client_id) ?? []
      existing.push(log.id)
      logsMap.set(log.client_id, existing)
    }

    const itemsByLog = new Map<string, string[]>() // log_id -> item names
    for (const item of items ?? []) {
      const existing = itemsByLog.get(item.log_id) ?? []
      existing.push(item.name)
      itemsByLog.set(item.log_id, existing)
    }

    const enriched: ClientWithStats[] = clientRows.map((c) => {
      const clientLogIds = logsMap.get(c.id) ?? []
      const allItemNames: string[] = []
      for (const logId of clientLogIds) {
        const names = itemsByLog.get(logId) ?? []
        allItemNames.push(...names)
      }
      // Get the most recent material names (from last log)
      const lastLogId = clientLogIds[0]
      const recentNames = lastLogId ? (itemsByLog.get(lastLogId) ?? []).slice(0, 2) : []

      return {
        ...c,
        total_logs: clientLogIds.length,
        total_items: allItemNames.length,
        recent_materials: recentNames,
      }
    })

    setClients(enriched)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchClients()

    const channel = supabase
      .channel('clients-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'clients' }, () => fetchClients())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'material_logs' }, () => fetchClients())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'material_items' }, () => fetchClients())
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [fetchClients])

  async function addClient(name: string, address: string, contactName: string) {
    const { error } = await supabase.from('clients').insert({
      name,
      address,
      contact_name: contactName,
    })
    if (error) throw error
  }

  async function deleteClient(id: string) {
    const { error } = await supabase.from('clients').delete().eq('id', id)
    if (error) throw error
  }

  return { clients, loading, addClient, deleteClient, refetch: fetchClients }
}

export function useClient(clientId: string) {
  const [client, setClient] = useState<Client | null>(null)
  const [logs, setLogs] = useState<MaterialLogWithItems[]>([])
  const [loading, setLoading] = useState(true)

  const fetchClient = useCallback(async () => {
    // Fetch client
    const { data: clientData } = await supabase
      .from('clients')
      .select('*')
      .eq('id', clientId)
      .single()

    if (clientData) setClient(clientData)

    // Fetch logs with items
    const { data: logRows } = await supabase
      .from('material_logs')
      .select('*')
      .eq('client_id', clientId)
      .order('date', { ascending: false })

    if (logRows && logRows.length > 0) {
      const logIds = logRows.map((l) => l.id)
      const { data: itemRows } = await supabase
        .from('material_items')
        .select('*')
        .in('log_id', logIds)

      const itemsByLog = new Map<string, MaterialItem[]>()
      for (const item of itemRows ?? []) {
        const existing = itemsByLog.get(item.log_id) ?? []
        existing.push(item)
        itemsByLog.set(item.log_id, existing)
      }

      const logsWithItems: MaterialLogWithItems[] = logRows.map((log) => ({
        ...log,
        material_items: itemsByLog.get(log.id) ?? [],
      }))

      setLogs(logsWithItems)
    } else {
      setLogs([])
    }

    setLoading(false)
  }, [clientId])

  useEffect(() => {
    fetchClient()

    const channel = supabase
      .channel(`client-${clientId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'material_logs',
        filter: `client_id=eq.${clientId}`,
      }, () => fetchClient())
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'material_items',
      }, () => fetchClient())
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [clientId, fetchClient])

  return { client, logs, loading, refetch: fetchClient }
}
