import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight } from 'lucide-react'
import { applicantSchema } from '../../utils/validation'
import styles from './ApplicationForm.module.css'

export default function ApplicationForm({ onSubmit, loading }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(applicantSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      city: '',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="first_name">Nombre</label>
          <input
            id="first_name"
            type="text"
            autoComplete="given-name"
            className={styles.input}
            placeholder="Juan"
            {...register('first_name')}
          />
          {errors.first_name && <p className={styles.error}>{errors.first_name.message}</p>}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="last_name">Apellido</label>
          <input
            id="last_name"
            type="text"
            autoComplete="family-name"
            className={styles.input}
            placeholder="Pérez"
            {...register('last_name')}
          />
          {errors.last_name && <p className={styles.error}>{errors.last_name.message}</p>}
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="email">Correo electrónico</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className={styles.input}
          placeholder="juan@example.com"
          {...register('email')}
        />
        {errors.email && <p className={styles.error}>{errors.email.message}</p>}
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="phone">Teléfono</label>
          <input
            id="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            className={styles.input}
            placeholder="3001234567"
            {...register('phone')}
          />
          {errors.phone && <p className={styles.error}>{errors.phone.message}</p>}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="city">Ciudad</label>
          <input
            id="city"
            type="text"
            autoComplete="address-level2"
            className={styles.input}
            placeholder="Bogotá"
            {...register('city')}
          />
          {errors.city && <p className={styles.error}>{errors.city.message}</p>}
        </div>
      </div>

      <button type="submit" disabled={loading} className={styles.submit}>
        {loading ? 'Enviando solicitud…' : 'Registrar solicitud'}
        {!loading && <ArrowRight size={18} strokeWidth={2.25} />}
      </button>
    </form>
  )
}
