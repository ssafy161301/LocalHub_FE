import { api, unwrap } from './client.js'
export const getLocationStatistics = () =>
  api.get('/api/v1/statistics/locations/categories').then(unwrap)
export const getPostStatistics = () => api.get('/api/v1/statistics/posts/categories').then(unwrap)
