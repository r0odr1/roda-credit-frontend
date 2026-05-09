import {
  Bike,
  Zap,
  ChevronRight,
  AlertCircle,
  Inbox,
  RefreshCw,
} from 'lucide-react'
import { formatCOP } from '../../utils/format'
import useApplications from './useApplications'
import styles from './ApplicationsList.module.css'

function ApplicationCard({ application, onSelect }) {
  const Icon = application.vehicle_type === 'bicycle' ? Bike : Zap
  const vehicleLabel = application.vehicle_type === 'bicycle' ? 'Bicicleta' : 'Moto'

  const date = new Date(application.created_at).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <button onClick={() => onSelect(application.id)} className={styles.card}>
      <div className={styles.cardInner}>
        <div className={styles.iconWrap}>
          <Icon size={20} strokeWidth={1.75} />
        </div>

        <div className={styles.body}>
          <div className={styles.bodyHead}>
            <p className={styles.name}>
              {application.first_name} {application.last_name}
            </p>
            <span className={styles.id}>
              #{String(application.id).padStart(3, '0')}
            </span>
          </div>

          <p className={styles.date}>{date}</p>

          <div className={styles.meta}>
            <span className={styles.metaInfo}>
              {vehicleLabel} · {formatCOP(application.vehicle_value)}
            </span>
            <span className={styles.metaPayment}>
              {formatCOP(application.monthly_payment)}/mes
            </span>
            <span className={styles.metaTerm}>
              {application.term_months} meses
            </span>
          </div>
        </div>

        <ChevronRight size={16} className={styles.chevron} />
      </div>
    </button>
  )
}

export default function ApplicationsList({ onSelect }) {
  const { applications, loading, error, reload } = useApplications()

  if (loading) {
    return (
      <div className={styles.stateBox}>
        <RefreshCw size={24} className={styles.spinIcon} />
        <p className={styles.stateText}>Cargando solicitudes…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.errorBox}>
        <AlertCircle size={20} className={styles.errorIcon} />
        <div>
          <p className={styles.errorTitle}>No pudimos cargar las solicitudes</p>
          <p className={styles.errorMessage}>{error}</p>
          <button onClick={reload} className={styles.errorRetry}>
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  if (applications.length === 0) {
    return (
      <div className={`${styles.emptyBox} animate-fade-up`}>
        <div className={styles.emptyIconWrap}>
          <Inbox size={28} strokeWidth={1.5} className={styles.emptyIcon} />
        </div>
        <p className={styles.emptyTitle}>
          Aún no hay solicitudes registradas
        </p>
        <p className={styles.emptyMessage}>
          Cuando alguien complete una simulación y registre sus datos, aparecerá aquí.
        </p>
      </div>
    )
  }

  return (
    <div className={`${styles.list} animate-fade-up`}>
      <div className={styles.listHead}>
        <h2 className={styles.listTitle}>Solicitudes registradas</h2>
        <button
          onClick={reload}
          className={styles.refreshBtn}
          aria-label="Actualizar lista"
        >
          <RefreshCw size={14} />
          {applications.length} {applications.length === 1 ? 'registro' : 'registros'}
        </button>
      </div>

      <div className={styles.cards}>
        {applications.map((app) => (
          <ApplicationCard key={app.id} application={app} onSelect={onSelect} />
        ))}
      </div>
    </div>
  )
}
