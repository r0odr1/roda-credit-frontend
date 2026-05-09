import { useEffect, useState } from 'react'
import { getApplication } from '../../services/api'

export default function useApplicationDetail(applicationId) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      const res = await getApplication(applicationId)
      if (cancelled) return
      setLoading(false)
      if (res.ok) setData(res.data)
      else setError(res.error.message)
    }

    load()

    return () => {
      cancelled = true
    }
  }, [applicationId])

  return { data, loading, error }
}
