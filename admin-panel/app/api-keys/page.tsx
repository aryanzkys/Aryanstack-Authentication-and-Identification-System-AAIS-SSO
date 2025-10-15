'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { ApiKey } from '@/types'
import { formatDateTime } from '@/lib/utils'

export default function ApiKeysPage() {
  const router = useRouter()
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      router.push('/login')
      return
    }

    // Mock data for now
    setApiKeys([])
    setLoading(false)
  }, [router])

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
            <h1 className="text-3xl font-bold">API Keys</h1>
            <p className="text-gray-500">Generate and manage API keys for external integrations</p>
          </div>
          <Button>Generate API Key</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All API Keys ({apiKeys.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Key</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Application</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Expires</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Last Used</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {apiKeys.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                        No API keys found. Generate your first API key to get started.
                      </td>
                    </tr>
                  ) : (
                    apiKeys.map((key) => (
                      <tr key={key.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium">{key.name}</td>
                        <td className="px-4 py-3 text-sm font-mono text-xs">
                          {key.key.substring(0, 20)}...
                        </td>
                        <td className="px-4 py-3 text-sm">{key.applicationId}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {key.expiresAt ? formatDateTime(key.expiresAt) : 'Never'}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                            key.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {key.isActive ? 'Active' : 'Revoked'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {key.lastUsedAt ? formatDateTime(key.lastUsedAt) : 'Never'}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <Button variant="ghost" size="sm">View</Button>
                          <Button variant="ghost" size="sm" className="text-red-600">
                            Revoke
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
