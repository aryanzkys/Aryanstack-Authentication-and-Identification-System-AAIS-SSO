'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { HydraClient } from '@/types'
import axios from 'axios'

export default function HydraClientsPage() {
  const router = useRouter()
  const [clients, setClients] = useState<HydraClient[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      router.push('/login')
      return
    }

    fetchClients()
  }, [router])

  const fetchClients = async () => {
    try {
      // In production, this would call Hydra Admin API via backend
      setClients([])
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch Hydra clients:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div>Loading...</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Ory Hydra Clients</h1>
            <p className="text-gray-500">Manage OAuth2 clients registered in Ory Hydra</p>
          </div>
          <Button>Create Client</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>OAuth2 Clients ({clients.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Client Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Client ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Grant Types</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Scopes</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Redirect URIs</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                        No OAuth2 clients found in Hydra.
                      </td>
                    </tr>
                  ) : (
                    clients.map((client) => (
                      <tr key={client.client_id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium">{client.client_name}</td>
                        <td className="px-4 py-3 text-sm font-mono text-xs">{client.client_id}</td>
                        <td className="px-4 py-3 text-sm">
                          {client.grant_types.join(', ')}
                        </td>
                        <td className="px-4 py-3 text-sm">{client.scope}</td>
                        <td className="px-4 py-3 text-sm">
                          {client.redirect_uris.slice(0, 2).join(', ')}
                          {client.redirect_uris.length > 2 && '...'}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <Button variant="ghost" size="sm">Edit</Button>
                          <Button variant="ghost" size="sm" className="text-red-600">
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
