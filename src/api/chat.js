import { api, unwrap } from './client.js'
export const sendChat = (body) => api.post('/api/v1/chat', body, { timeout: 60000 }).then(unwrap)
