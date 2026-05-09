import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { formatCOP } from '../../utils/format'
import styles from './AmortizationTable.module.css'

export default function AmortizationTable({ schedule }) {
  const [expanded, setExpanded] = useState(false)

  if (!schedule || schedule.length === 0) return null

  const visibleRows = expanded ? schedule : schedule.slice(0, 6)
  const canCollapse = schedule.length > 6

  return (
    <div className={`${styles.container} animate-fade-up`}>
      <div className={styles.header}>
        <h3 className={styles.title}>Plan de pagos</h3>
        <span className={styles.count}>{schedule.length} cuotas</span>
      </div>

      <div className={styles.tableWrapper}>
        <div className={styles.scrollX}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.theadRow}>
                <th className={styles.th}>#</th>
                <th className={`${styles.th} ${styles.thRight}`}>Cuota</th>
                <th className={`${styles.th} ${styles.thRight}`}>Interés</th>
                <th className={`${styles.th} ${styles.thRight}`}>Capital</th>
                <th className={`${styles.th} ${styles.thRight}`}>Saldo</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row) => (
                <tr key={row.number} className={styles.tr}>
                  <td className={styles.tdIndex}>
                    {String(row.number).padStart(2, '0')}
                  </td>
                  <td className={`${styles.td} ${styles.tdRight} ${styles.tdMedium}`}>
                    {formatCOP(row.payment)}
                  </td>
                  <td className={`${styles.td} ${styles.tdRight} ${styles.tdMuted}`}>
                    {formatCOP(row.interest)}
                  </td>
                  <td className={`${styles.td} ${styles.tdRight} ${styles.tdMuted}`}>
                    {formatCOP(row.principal)}
                  </td>
                  <td className={`${styles.td} ${styles.tdRight} ${styles.tdBalance}`}>
                    {formatCOP(row.balance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {canCollapse && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className={styles.toggle}
          >
            {expanded ? (
              <>
                <ChevronUp size={16} />
                Mostrar menos
              </>
            ) : (
              <>
                <ChevronDown size={16} />
                Ver las {schedule.length - 6} cuotas restantes
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
