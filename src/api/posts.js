import { api, unwrap } from './client.js'
export const getPosts = (params, signal) =>
  api.get('/api/v1/posts', { params, signal }).then(unwrap)
export const getPost = (id) => api.get(`/api/v1/posts/${id}`).then(unwrap)
export const createPost = (body) => api.post('/api/v1/posts', body).then(unwrap)
export const updatePost = (id, body) => api.put(`/api/v1/posts/${id}`, body).then(unwrap)
export const verifyPostPassword = (id, password) =>
  api.post(`/api/v1/posts/${id}/verify-password`, { password }).then(unwrap)
export const deletePost = (id, password) =>
  api.delete(`/api/v1/posts/${id}`, { data: { password } })
