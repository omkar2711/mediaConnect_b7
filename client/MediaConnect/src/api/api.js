const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const defaultHeaders = () => {
  const token = localStorage.getItem('token')
  return token
    ? {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    : { 'Content-Type': 'application/json' }
}

const handleResponse = async (res) => {
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const message = data?.message || `Request failed (${res.status})`
    throw new Error(message)
  }
  return data
}

// Auth
export const loginUser = async (payload) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return handleResponse(res)
}

export const registerUser = async (payload) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return handleResponse(res)
}

// Users
export const getProfile = async () => {
  const res = await fetch(`${API_URL}/users`, { headers: defaultHeaders() })
  return handleResponse(res)
}

export const updateProfile = async (updates) => {
  const res = await fetch(`${API_URL}/users`, {
    method: 'PUT',
    headers: defaultHeaders(),
    body: JSON.stringify(updates),
  })
  return handleResponse(res)
}

export const getUserPosts = async () => {
  const res = await fetch(`${API_URL}/users/posts`, { headers: defaultHeaders() })
  return handleResponse(res)
}

export const getUserById = async (userId) => {
  const res = await fetch(`${API_URL}/users/${userId}`, { headers: defaultHeaders() })
  return handleResponse(res)
}

// Posts
export const getAllPosts = async () => {
  const res = await fetch(`${API_URL}/posts`, { headers: defaultHeaders() })
  return handleResponse(res)
}

export const createPost = async (payload) => {
  const res = await fetch(`${API_URL}/posts`, {
    method: 'POST',
    headers: defaultHeaders(),
    body: JSON.stringify(payload),
  })
  return handleResponse(res)
}

export const likePost = async (postId) => {
  const res = await fetch(`${API_URL}/posts/${postId}/like`, {
    method: 'POST',
    headers: defaultHeaders(),
  })
  return handleResponse(res)
}

// Comments
export const addComment = async (postId, payload) => {
  const res = await fetch(`${API_URL}/comments/${postId}`, {
    method: 'POST',
    headers: defaultHeaders(),
    body: JSON.stringify(payload),
  })
  return handleResponse(res)
}

