export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  role: 'admin' | 'developer' | 'viewer' | 'user'
  createdAt: string
  updatedAt: string
  isActive: boolean
}

export interface Application {
  id: string
  name: string
  description?: string
  clientId: string
  clientSecret: string
  redirectUris: string[]
  scopes: string[]
  createdBy: string
  createdAt: string
  updatedAt: string
  isActive: boolean
}

export interface ApiKey {
  id: string
  name: string
  key: string
  applicationId: string
  expiresAt?: string
  createdBy: string
  createdAt: string
  isActive: boolean
  lastUsedAt?: string
}

export interface HydraClient {
  client_id: string
  client_name: string
  client_secret?: string
  redirect_uris: string[]
  grant_types: string[]
  response_types: string[]
  scope: string
  token_endpoint_auth_method: string
  created_at?: string
  updated_at?: string
}

export interface AdminStats {
  totalUsers: number
  totalApplications: number
  totalApiKeys: number
  activeUsers: number
  recentLogins: number
}
