import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'

// Types
export const ArticleSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  summary: z.string().optional(),
  url: z.string(),
  publishedAt: z.string(),
  source: z.string(),
  category: z.string().optional(),
})

export type Article = z.infer<typeof ArticleSchema>

export const UserSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string().optional(),
})

export type User = z.infer<typeof UserSchema>

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// API functions
const api = {
  // Articles
  getArticles: async (page = 1, limit = 20): Promise<{ articles: Article[]; total: number }> => {
    const response = await fetch(`${API_BASE_URL}/api/articles?page=${page}&limit=${limit}`)
    if (!response.ok) throw new Error('Failed to fetch articles')
    return response.json()
  },

  getArticle: async (id: string): Promise<Article> => {
    const response = await fetch(`${API_BASE_URL}/api/articles/${id}`)
    if (!response.ok) throw new Error('Failed to fetch article')
    return response.json()
  },

  searchArticles: async (query: string, page = 1, limit = 20): Promise<{ articles: Article[]; total: number }> => {
    const response = await fetch(`${API_BASE_URL}/api/articles/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`)
    if (!response.ok) throw new Error('Failed to search articles')
    return response.json()
  },

  // Auth
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (!response.ok) throw new Error('Login failed')
    return response.json()
  },

  register: async (email: string, password: string, name?: string): Promise<{ user: User; token: string }> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    })
    if (!response.ok) throw new Error('Registration failed')
    return response.json()
  },

  getCurrentUser: async (token: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!response.ok) throw new Error('Failed to get user')
    return response.json()
  },
}

// Hooks
export const useArticles = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['articles', page, limit],
    queryFn: () => api.getArticles(page, limit),
  })
}

export const useArticle = (id: string) => {
  return useQuery({
    queryKey: ['article', id],
    queryFn: () => api.getArticle(id),
    enabled: !!id,
  })
}

export const useSearchArticles = (query: string, page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['search', query, page, limit],
    queryFn: () => api.searchArticles(query, page, limit),
    enabled: !!query,
  })
}

export const useLogin = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      api.login(email, password),
    onSuccess: (data) => {
      localStorage.setItem('token', data.token)
      queryClient.setQueryData(['user'], data.user)
    },
  })
}

export const useRegister = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ email, password, name }: { email: string; password: string; name?: string }) =>
      api.register(email, password, name),
    onSuccess: (data) => {
      localStorage.setItem('token', data.token)
      queryClient.setQueryData(['user'], data.user)
    },
  })
}

export const useCurrentUser = () => {
  const token = localStorage.getItem('token')
  
  return useQuery({
    queryKey: ['user'],
    queryFn: () => api.getCurrentUser(token!),
    enabled: !!token,
  })
}