import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

/**
 * Normaliza errores de Axios a un objeto - message, details, status.
 */
function parseError(error) {
  if (error.response?.data) {
    const data = error.response.data
    return {
      message: data.message || data.error || 'Error en la solicitud',
      details: data.details || null,
      status: error.response.status,
    }
  }
  if (error.code === 'ECONNABORTED') {
    return { message: 'Tiempo de espera agotado', details: null }
  }
  return { message: 'No se pudo conectar con el servidor', details: null }
}

export async function simulateCredit(payload) {
  try {
    const { data } = await api.post('/api/simulate', payload)
    return { ok: true, data }
  } catch (error) {
    return { ok: false, error: parseError(error) }
  }
}

export async function createApplication(payload) {
  try {
    const { data } = await api.post('/api/applications', payload)
    return { ok: true, data }
  } catch (error) {
    return { ok: false, error: parseError(error) }
  }
}

export async function getApplications() {
  try {
    const { data } = await api.get('/api/applications')
    return { ok: true, data }
  } catch (error) {
    return { ok: false, error: parseError(error) }
  }
}

export async function getApplication(id) {
  try {
    const { data } = await api.get(`/api/applications/${id}`)
    return { ok: true, data }
  } catch (error) {
    return { ok: false, error: parseError(error) }
  }
}

export default api
