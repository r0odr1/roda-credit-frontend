/**
 * Formatea un número como pesos colombianos.
 */
export function formatCOP(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return '—'
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * Formato compacto sin decimales (para tablas).
 */
export function formatNumber(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return '—'
  return new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(value)
}

/**
 * Formatea porcentaje (0.18 -> "18%").
 */
export function formatPercent(value) {
  return new Intl.NumberFormat('es-CO', {
    style: 'percent',
    maximumFractionDigits: 2,
  }).format(value)
}
