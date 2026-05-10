# Roda — Frontend (Simulador de crédito)

Aplicación React 19 + Vite 7 que consume la API del simulador de crédito de Roda. El diseño replica la identidad visual de [roda.xyz](https://roda.xyz) e incluye modo claro y oscuro.

## Tecnologías

- **React 19**
- **Vite 7** (build tool)
- **Tailwind CSS 4** (con plugin oficial `@tailwindcss/vite`)
- **CSS Modules** (estilos con scope local por componente)
- **React Hook Form** + **Zod** (formularios y validación)
- **Axios** (cliente HTTP)
- **Lucide React** (iconos)

## Estructura del proyecto

Cada componente vive en su propia carpeta con tres archivos posibles:

- `index.jsx` — la vista (JSX y orquestación)
- `ComponentName.module.css` — los estilos del componente
- `useComponentName.js` — la lógica de estado, cuando aplica

```
frontend/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx                            # Orquestación general
│   ├── App.module.css                     # Estilos del shell
│   ├── main.jsx
│   ├── index.css                          # Estilos globales y de tema
│   │
│   ├── hooks/
│   │   └── useTheme.js                    # Gestiona modo claro/oscuro
│   │
│   ├── components/
│   │   ├── ThemeToggle/                   # Switch sol/luna
│   │   ├── SimulationForm/                # Formulario de simulación
│   │   ├── ResultSummary/                 # Resumen del crédito
│   │   ├── AmortizationTable/             # Plan de pagos
│   │   ├── ApplicationForm/               # Datos personales
│   │   ├── ApplicationsList/              # Historial de solicitudes
│   │   │   └── useApplications.js         # Hook de carga de la lista
│   │   └── ApplicationDetail/             # Detalle individual
│   │       └── useApplicationDetail.js    # Hook de carga del detalle
│   │
│   ├── services/
│   │   └── api.js                         # Cliente Axios
│   └── utils/
│       ├── format.js                      # Formato COP / %
│       └── validation.js                  # Schemas Zod
│
├── index.html
├── vite.config.js
├── package.json
├── eslint.config.js
├── vercel.json
└── .env.example
```

## Variables de entorno

Copia `.env.example` a `.env`:

| Variable | Descripción | Default |
|---|---|---|
| `VITE_API_URL` | URL base del backend | `http://localhost:5000` |

> ⚠️ Vite expone variables al cliente solo si comienzan con `VITE_`.

## Instalación local

### 1. Pre-requisitos

- **Node.js 20+** (`node --version`)
- npm o pnpm

### 2. Instalar dependencias

```bash
cd frontend
npm install
```

### 3. Configurar entorno

```bash
cp .env.example .env
# Si tu backend corre en otro puerto, edítalo aquí
```

### 4. Correr en desarrollo

```bash
npm run dev
```

App disponible en `http://localhost:5173`.

### 5. Build de producción

```bash
npm run build
npm run preview   # opcional: probar el build localmente
```

## Vistas principales

La app tiene tres vistas, navegables desde los tabs del header:

### 1. Simulador (`Simular`)

Vista principal. El usuario llena el formulario (tipo de vehículo, valor, cuota inicial, plazo) y obtiene:

- Resumen del crédito (cuota mensual, total a pagar, intereses, monto financiado)
- Plan de pagos completo (tabla de amortización mes a mes)
- Opción de continuar y registrar una solicitud formal con datos personales

### 2. Historial (`Solicitudes`)

Lista todas las solicitudes registradas en la base de datos, ordenadas por fecha. Cada tarjeta es clickeable y lleva al detalle.

### 3. Detalle individual

Vista completa de una solicitud específica con su plan de pagos reconstruido y los datos del solicitante. Email y teléfono son links clickeables (`mailto:` / `tel:`).

## Flujo de usuario

1. Usuario llena el formulario de simulación → click "Simular crédito" → llamada `POST /api/simulate` → muestra resumen y tabla de amortización.
2. Click "Continuar con la solicitud" → muestra formulario de datos personales → `POST /api/applications` → confirma persistencia con un mensaje de éxito que incluye el ID y dos atajos: "Ver detalle de mi solicitud" y "Ver todas las solicitudes".
3. Desde el detalle, "← Volver al listado" regresa al historial.

## Diseño y estilo visual

El diseño replica la identidad de la página oficial de Roda:

### Paleta de colores

- **Lima `#C7F26C`** — color principal de marca, presente en botones, palabras destacadas en titulares y elementos seleccionados.
- **Lavanda `#C4B5FD`** — acento secundario para bordes de tarjetas y enlaces.
- **Negro tinta `#0A0A0A`** — fondo en modo oscuro y texto en modo claro.
- **Blanco** — fondo en modo claro y texto en modo oscuro.

### Tipografía

- **Bricolage Grotesque** para titulares (con peso bold y letter-spacing cerrado para esa estética compacta de Roda).
- **Geist** para texto general.
- **Geist Mono** para etiquetas técnicas, IDs y porcentajes.

### Patrones visuales

- Botones tipo **pill** completamente redondeados con texto en negro sobre fondo lima.
- **Tarjetas** con borde lavanda sutil y radios generosos.
- **Tabs** del header agrupados en una pill con el activo en negro.
- **Logo "Roda"** tipográfico con la "o" coloreada en lima.
- Microinteracciones suaves al hacer hover en tarjetas y botones.

### Modo claro / oscuro

- Toggle (sol/luna) en el header.
- La preferencia del usuario se guarda en `localStorage` y persiste entre sesiones.
- En la primera visita se respeta la preferencia del sistema operativo (`prefers-color-scheme`).
- Transición suave de 200ms al cambiar entre modos.

## Decisiones técnicas

- **CSS Modules**: cada componente tiene su archivo `.module.css` con estilos de scope local. No hay conflictos entre clases con el mismo nombre en componentes distintos. Permite separar realmente el HTML del CSS sin perder mantenibilidad.
- **Co-location por feature**: cada componente vive en su propia carpeta junto a sus estilos y hooks. Si lo borras, no quedan archivos huérfanos.
- **Hooks personalizados** (`useTheme`, `useApplications`, `useApplicationDetail`): la lógica de estado y efectos vive separada del JSX, lo que la hace reutilizable y más fácil de testear.
- **Validación dual**: Zod en el cliente (UX inmediata) + Pydantic en el servidor (seguridad). El backend siempre revalida.
- **React Hook Form**: minimiza re-renders, integración limpia con Zod a través de `@hookform/resolvers`.
- **Recálculo seguro**: el backend recalcula las cuotas al registrar la solicitud, evitando manipulación desde el cliente.
- **Race condition handling**: el hook `useApplicationDetail` cancela actualizaciones de estado si el componente se desmonta antes de que llegue la respuesta. Esto previene bugs sutiles cuando el usuario navega rápido entre vistas.
- **Estados explícitos**: loading, error, vacío y éxito son props/estados separados, nunca implícitos. Cada vista los maneja con feedback visual claro.