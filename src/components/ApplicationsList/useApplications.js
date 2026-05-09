import { useEffect, useState, useCallback } from 'react'
import { getApplications } from '../../services/api'

export default function useApplications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    const res = await getApplications()
    setLoading(false)
    if (res.ok) setApplications(res.data)
    else setError(res.error.message)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { applications, loading, error, reload: load }
}
