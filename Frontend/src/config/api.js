// api config: deployment-time frontend configuration values.
import axios from 'axios'

// Central API base URL used by all browser-side network clients.
// Set VITE_API_URL in production; the fallback keeps local development simple.
export const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:5000'

// OAuth configuration is colocated with API config because both are deploy-time env values.
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

axios.defaults.timeout = 15000
axios.defaults.withCredentials = true


