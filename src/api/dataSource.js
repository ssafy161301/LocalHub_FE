import { api, unwrap } from './client.js'
export const getDataSource = () => api.get('/api/v1/data-source').then(unwrap)
