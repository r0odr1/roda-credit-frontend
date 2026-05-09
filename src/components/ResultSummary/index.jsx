import { TrendingUp, Wallet, Receipt, Coins } from 'lucide-react'
import { formatCOP, formatPercent } from '../../utils/format'
import styles from './ResultSummary.module.css'

function StatCard({ label, value, icon: Icon, accent = false }) {
  return (
    <div className={`${styles.card} ${accent ? styles.cardAccent : ''}`}>
      <div className={styles.cardHeader}>
        <Icon size={16} strokeWidth={1.75} className={styles.cardIcon} />
        <span className={styles.cardLabel}>{label}</span>
      </div>
      <p className={styles.cardValue}>{value}</p>
    </div>
  )
}

export default function ResultSummary({ summary }) {
  if (!summary) return null

  return (
    <div className={`${styles.container} animate-fade-up`}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          Tu crédito en <span className={styles.titleAccent}>Roda</span>
        </h2>
        <span className={styles.rate}>
          Tasa {formatPercent(summary.annual_interest_rate)} EA
        </span>
      </div>

      <div className={styles.grid}>
        <StatCard
          label="Cuota mensual"
          value={formatCOP(summary.monthly_payment)}
          icon={Wallet}
          accent
        />
        <StatCard
          label="Total a pagar"
          value={formatCOP(summary.total_to_pay)}
          icon={Receipt}
        />
        <StatCard
          label="Valor financiado"
          value={formatCOP(summary.financed_amount)}
          icon={Coins}
        />
        <StatCard
          label="Total intereses"
          value={formatCOP(summary.total_interest)}
          icon={TrendingUp}
        />
      </div>

      <div className={styles.details}>
        <span className={styles.detailLabel}>Valor del vehículo</span>
        <span className={styles.detailValue}>{formatCOP(summary.vehicle_value)}</span>
        <span className={styles.detailLabel}>Cuota inicial</span>
        <span className={styles.detailValue}>{formatCOP(summary.down_payment)}</span>
        <span className={styles.detailLabel}>Plazo</span>
        <span className={styles.detailValue}>{summary.term_months} meses</span>
      </div>
    </div>
  )
}
