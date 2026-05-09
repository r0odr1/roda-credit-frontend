import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Bike, Zap, ArrowRight } from 'lucide-react'
import { simulationSchema } from '../../utils/validation'
import { formatCOP } from '../../utils/format'
import styles from './SimulationForm.module.css'

export default function SimulationForm({ onSubmit, loading, defaultValues }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(simulationSchema),
    defaultValues: defaultValues || {
      vehicle_type: 'bicycle',
      vehicle_value: '',
      down_payment: '',
      term_months: 12,
    },
  })

  const selectedType = watch('vehicle_type')
  const vehicleValue = watch('vehicle_value')
  const downPayment = watch('down_payment')

  const financedPreview =
    Number(vehicleValue) > 0 && Number(downPayment) >= 0
      ? Number(vehicleValue) - Number(downPayment)
      : null

  const vehicleClass = (type) =>
    `${styles.vehicleOption} ${selectedType === type ? styles.vehicleOptionActive : ''}`

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
      <div className={styles.field}>
        <label className={styles.label}>Tipo de vehículo</label>
        <div className={styles.vehicleGrid}>
          <button
            type="button"
            onClick={() => setValue('vehicle_type', 'bicycle', { shouldValidate: true })}
            className={vehicleClass('bicycle')}
          >
            <Bike size={28} strokeWidth={1.75} />
            <span className={styles.vehicleLabel}>Bicicleta</span>
            <span className={styles.vehicleSublabel}>eléctrica</span>
          </button>
          <button
            type="button"
            onClick={() => setValue('vehicle_type', 'motorcycle', { shouldValidate: true })}
            className={vehicleClass('motorcycle')}
          >
            <Zap size={28} strokeWidth={1.75} />
            <span className={styles.vehicleLabel}>Moto</span>
            <span className={styles.vehicleSublabel}>eléctrica</span>
          </button>
        </div>
        <input type="hidden" {...register('vehicle_type')} />
        {errors.vehicle_type && (
          <p className={styles.error}>{errors.vehicle_type.message}</p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="vehicle_value" className={styles.label}>
          Valor del vehículo <span className={styles.labelHint}>COP</span>
        </label>
        <input
          id="vehicle_value"
          type="number"
          inputMode="numeric"
          placeholder="8.000.000"
          className={styles.input}
          {...register('vehicle_value')}
        />
        {errors.vehicle_value && (
          <p className={styles.error}>{errors.vehicle_value.message}</p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="down_payment" className={styles.label}>
          Cuota inicial <span className={styles.labelHint}>COP</span>
        </label>
        <input
          id="down_payment"
          type="number"
          inputMode="numeric"
          placeholder="1.500.000"
          className={styles.input}
          {...register('down_payment')}
        />
        {errors.down_payment && (
          <p className={styles.error}>{errors.down_payment.message}</p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="term_months" className={styles.label}>
          Plazo <span className={styles.labelHint}>meses</span>
        </label>
        <select
          id="term_months"
          className={styles.input}
          {...register('term_months')}
        >
          {[6, 12, 18, 24, 36, 48, 60].map((m) => (
            <option key={m} value={m}>
              {m} meses
            </option>
          ))}
        </select>
        {errors.term_months && (
          <p className={styles.error}>{errors.term_months.message}</p>
        )}
      </div>

      {financedPreview !== null && financedPreview > 0 && (
        <div className={styles.preview}>
          <span className={styles.previewLabel}>Monto a financiar</span>
          <span className={styles.previewValue}>{formatCOP(financedPreview)}</span>
        </div>
      )}

      <button type="submit" disabled={loading} className={styles.submit}>
        {loading ? 'Calculando…' : 'Simular crédito'}
        {!loading && <ArrowRight size={18} strokeWidth={2.25} />}
      </button>
    </form>
  )
}
