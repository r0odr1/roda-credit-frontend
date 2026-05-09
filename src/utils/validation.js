import { z } from 'zod'

/**
 * Esquema para el formulario de simulación.
 */
export const simulationSchema = z.object({
  vehicle_type: z.enum(['bicycle', 'motorcycle'], {
    errorMap: () => ({ message: 'Selecciona un tipo de vehículo' }),
  }),
  vehicle_value: z.coerce
    .number({ invalid_type_error: 'Debe ser un número' })
    .positive('Debe ser mayor a 0')
    .min(500_000, 'El valor debe ser ≥ $500.000 COP'),
  down_payment: z.coerce
    .number({ invalid_type_error: 'Debe ser un número' })
    .nonnegative('No puede ser negativo'),
  term_months: z.coerce
    .number({ invalid_type_error: 'Debe ser un número' })
    .int('Debe ser un número entero')
    .min(6, 'Mínimo 6 meses')
    .max(60, 'Máximo 60 meses'),
}).refine(
  (data) => data.down_payment < data.vehicle_value,
  {
    message: 'La cuota inicial debe ser menor al valor del vehículo',
    path: ['down_payment'],
  },
)

/**
 * Esquema para los datos personales de la solicitud.
 */
export const applicantSchema = z.object({
  first_name: z.string().trim().min(1, 'Requerido').max(100),
  last_name: z.string().trim().min(1, 'Requerido').max(100),
  email: z.string().trim().email('Correo electrónico inválido'),
  phone: z
    .string()
    .trim()
    .min(7, 'Mínimo 7 dígitos')
    .max(20, 'Máximo 20 dígitos')
    .regex(/^\d+$/, 'Solo números, sin espacios ni signos'),
  city: z.string().trim().min(1, 'Requerido').max(100),
})
