'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ssoApi } from '@/lib/api'
import type { Application } from '@/types'
import { formatDateTime } from '@/lib/utils'

export default function ApplicationsPage() {
  const router = useRouter()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      router.push('/login')
      return
    }

    fetchApplications()
  }, [router])

  const fetchApplications = async () => {
    try {
      const response = await ssoApi.get('/admin/applications')
      setApplications(response.data.applications || [])
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch applications:', error)
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
            <h1 className="text-3xl font-bold">Applications</h1>
            <p className="text-gray-500">Manage OAuth2 applications and client credentials</p>
          </div>
          <Button onClick={() => setShowModal(true)}>Register Application</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Applications ({applications.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Client ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Redirect URIs</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Created</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                        No applications found. Register your first application to get started.
                      </td>
                    </tr>
                  ) : (
                    applications.map((app) => (
                      <tr key={app.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium">{app.name}</td>
                        <td className="px-4 py-3 text-sm font-mono text-xs">{app.clientId}</td>
                        <td className="px-4 py-3 text-sm">
                          {app.redirectUris?.slice(0, 2).join(', ')}
                          {app.redirectUris?.length > 2 && '...'}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                            app.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {app.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {formatDateTime(app.createdAt)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <Button variant="ghost" size="sm">View</Button>
                          <Button variant="ghost" size="sm">Edit</Button>
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
