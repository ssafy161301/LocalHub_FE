import { api, unwrap } from './client.js'
export const getLocations = (params, signal) =>
  api.get('/api/v1/locations', { params, signal }).then(unwrap)
export const getLocation = (id) => api.get(`/api/v1/locations/${id}`).then(unwrap)
export const getLocationCategories = () => api.get('/api/v1/locations/categories').then(unwrap)
