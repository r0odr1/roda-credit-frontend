import {
  ArrowLeft,
  Bike,
  Zap,
  Mail,
  Phone,
  MapPin,
  Calendar,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'
import ResultSummary from '../ResultSummary'
import AmortizationTable from '../AmortizationTable'
import useApplicationDetail from './useApplicationDetail'
import styles from './ApplicationDetail.module.css'

function BackButton({ onBack }) {
  return (
    <button onClick={onBack} className={styles.backBtn}>
      <ArrowLeft size={16} />
      Volver al listado
    </button>
  )
}

export default function ApplicationDetail({ applicationId, onBack }) {
  const { data, loading, error } = useApplicationDetail(applicationId)

  if (loading) {
    return (
      <div className={styles.container}>
        <BackButton onBack={onBack} />
        <div className={styles.stateBox}>
          <RefreshCw size={24} className={styles.spinIcon} />
          <p className={styles.stateText}>Cargando solicitud…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <BackButton onBack={onBack} />
        <div className={styles.errorBox}>
          <AlertCircle size={20} className={styles.errorIcon} />
          <div>
            <p className={styles.errorTitle}>No pudimos cargar esta solicitud</p>
            <p className={styles.errorMessage}>{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!data) return null

  const { application, schedule } = data
  const Icon = application.vehicle_type === 'bicycle' ? Bike : Zap
  const vehicleLabel =
    application.vehicle_type === 'bicycle' ? 'Bicicleta eléctrica' : 'Moto eléctrica'

  const date = new Date(application.created_at).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className={`${styles.container} animate-fade-up`}>
      <BackButton onBack={onBack} />

      <div className={styles.headerCard}>
        <div className={styles.headerTop}>
          <div className={styles.iconWrap}>
            <Icon size={24} strokeWidth={1.75} />
          </div>
          <div className={styles.headerTitle}>
            <p className={styles.headerLabel}>
              Solicitud #{String(application.id).padStart(3, '0')}
            </p>
            <h1 className={styles.headerName}>
              {application.first_name} {application.last_name}
            </h1>
          </div>
        </div>

        <div className={styles.headerMeta}>
          <span className={styles.headerVehicle}>{vehicleLabel}</span>
          <span className={styles.headerSep}>·</span>
          <span>{application.term_months} meses</span>
          <span className={styles.headerSep}>·</span>
          <span className={styles.headerDate}>
            <Calendar size={14} />
            {date}
          </span>
        </div>
      </div>

      <div className={styles.section}>
        <ResultSummary summary={application} />
      </div>

      <div className={styles.section}>
        <AmortizationTable schedule={schedule} />
      </div>

      <div className={styles.section}>
        <h2 className={styles.contactTitle}>Datos del solicitante</h2>
        <div className={styles.contactList}>
          <div className={styles.contactItem}>
            <Mail size={16} className={styles.contactIcon} />
            <a href={`mailto:${application.email}`} className={styles.contactLink}>
              {application.email}
            </a>
          </div>
          <div className={styles.contactItem}>
            <Phone size={16} className={styles.contactIcon} />
            <a href={`tel:${application.phone}`} className={styles.contactLink}>
              {application.phone}
            </a>
          </div>
          <div className={styles.contactItem}>
            <MapPin size={16} className={styles.contactIcon} />
            <span>{application.city}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
