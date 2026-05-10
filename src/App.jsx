import { useState } from 'react'
import { CheckCircle2, AlertCircle, ListChecks, Calculator, ArrowRight, RotateCcw } from 'lucide-react'
import SimulationForm from './components/SimulationForm'
import ResultSummary from './components/ResultSummary'
import AmortizationTable from './components/AmortizationTable'
import ApplicationForm from './components/ApplicationForm'
import ApplicationsList from './components/ApplicationsList'
import ApplicationDetail from './components/ApplicationDetail'
import ThemeToggle from './components/ThemeToggle'
import { simulateCredit, createApplication } from './services/api'
import styles from './App.module.css'

export default function App() {
  const [view, setView] = useState('simulator')
  const [selectedApplicationId, setSelectedApplicationId] = useState(null)

  const [simulationInput, setSimulationInput] = useState(null)
  const [simulationResult, setSimulationResult] = useState(null)
  const [simulationLoading, setSimulationLoading] = useState(false)

  const [applicationLoading, setApplicationLoading] = useState(false)
  const [applicationSuccess, setApplicationSuccess] = useState(null)
  const [globalError, setGlobalError] = useState(null)
  const [showApplicationForm, setShowApplicationForm] = useState(false)

  // Cambia para forzar el remount del SimulationForm y limpiarlo
  const [formKey, setFormKey] = useState(0)

  // Cambia para forzar el remount de la lista de solicitudes
  const [listKey, setListKey] = useState(0)

  /**
   * Limpia todo el estado del simulador. Se usa al hacer "Nueva simulacion"
   * o al volver al simulador despues de haber registrado una solicitud.
   */
  function resetSimulator() {
    setSimulationInput(null)
    setSimulationResult(null)
    setApplicationSuccess(null)
    setShowApplicationForm(false)
    setGlobalError(null)
    setFormKey((k) => k + 1)
  }

  function goToSimulator() {
    // Si el usuario ya completo una solicitud y esta volviendo desde otra vista,
    // arrancamos limpio. Si solo había simulacion sin registrar, mantenemos el calculo.
    if (applicationSuccess && view !== 'simulator') {
      resetSimulator()
    }
    setSelectedApplicationId(null)
    setView('simulator')
  }

  function goToApplications() {
    setListKey((k) => k + 1)
    setSelectedApplicationId(null)
    setView('applications')
  }

  function selectApplication(id) {
    setSelectedApplicationId(id)
    setView('application-detail')
  }

  const applicationsTabActive =
    view === 'applications' || view === 'application-detail'

  async function handleSimulate(values) {
    setGlobalError(null)
    setApplicationSuccess(null)
    setSimulationLoading(true)

    const payload = {
      vehicle_type: values.vehicle_type,
      vehicle_value: Number(values.vehicle_value),
      down_payment: Number(values.down_payment),
      term_months: Number(values.term_months),
    }

    const res = await simulateCredit(payload)
    setSimulationLoading(false)

    if (!res.ok) {
      setGlobalError(res.error.message)
      return
    }

    setSimulationInput(payload)
    setSimulationResult(res.data)
    setShowApplicationForm(false)
  }

  async function handleApply(personalData) {
    if (!simulationInput) return
    setGlobalError(null)
    setApplicationLoading(true)

    const payload = { ...simulationInput, ...personalData }
    const res = await createApplication(payload)
    setApplicationLoading(false)

    if (!res.ok) {
      setGlobalError(res.error.message)
      return
    }

    setApplicationSuccess(res.data.application)
    setShowApplicationForm(false)
  }

  return (
    <div className={styles.app}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <button onClick={goToSimulator} className={styles.brand}>
            <span className={styles.brandLogo}>
              R<span className={styles.brandLogoO}>o</span>da
            </span>
          </button>

          <nav className={styles.nav}>
            <button
              onClick={goToSimulator}
              className={`${styles.navItem} ${view === 'simulator' ? styles.navItemActive : ''}`}
            >
              <Calculator size={14} strokeWidth={2} />
              <span className={styles.navLabel}>Simular</span>
            </button>
            <button
              onClick={goToApplications}
              className={`${styles.navItem} ${applicationsTabActive ? styles.navItemActive : ''}`}
            >
              <ListChecks size={14} strokeWidth={2} />
              <span className={styles.navLabel}>Solicitudes</span>
            </button>
          </nav>

          <div className={styles.headerActions}>
            <span className={styles.langTag}>ES</span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Vista simulador */}
      {view === 'simulator' && (
        <>
          <section className={styles.hero}>
            <div className={styles.heroInner}>
              <p className={styles.heroEyebrow}>
                <span className={styles.heroEyebrowDot} />
                Movilidad eléctrica · Financiación inclusiva
              </p>
              <h1 className={styles.heroTitle}>
                Calcula tu cuota.
                <br />
                <span className={styles.heroTitleAccent}>Mueve el cambio.</span>
              </h1>
              <p className={styles.heroLead}>
                Te aprobamos aunque otros no lo hagan. Simula el crédito de tu
                bicicleta o moto eléctrica en segundos —{' '}
                <span className={styles.heroLeadHighlight}>tu futuro vale más que tu historial</span>.
              </p>
            </div>
          </section>

          <main className={styles.main}>
            <div className={styles.layout}>
              <aside className={styles.formColumn}>
                <div className={styles.formCard}>
                  <h2 className={styles.formTitle}>Datos del crédito</h2>
                  <SimulationForm
                    key={formKey}
                    onSubmit={handleSimulate}
                    loading={simulationLoading}
                  />
                </div>
              </aside>

              <section className={styles.resultsColumn}>
                {globalError && (
                  <div className={`${styles.errorAlert} animate-fade-up`}>
                    <AlertCircle size={20} className={styles.errorAlertIcon} />
                    <div>
                      <p className={styles.errorAlertTitle}>
                        No pudimos procesar tu solicitud
                      </p>
                      <p className={styles.errorAlertMsg}>{globalError}</p>
                    </div>
                  </div>
                )}

                {applicationSuccess && (
                  <div className={`${styles.successAlert} animate-fade-up`}>
                    <CheckCircle2 size={24} className={styles.successAlertIcon} />
                    <div className={styles.successAlertBody}>
                      <p className={styles.successAlertTitle}>
                        ¡Solicitud registrada!
                      </p>
                      <p className={styles.successAlertMsg}>
                        Hola {applicationSuccess.first_name}, recibimos tu solicitud{' '}
                        <span className={styles.successAlertId}>
                          #{String(applicationSuccess.id).padStart(3, '0')}
                        </span>
                        . Pronto te contactaremos al correo {applicationSuccess.email}.
                      </p>
                      <div className={styles.successAlertActions}>
                        <button
                          onClick={() => selectApplication(applicationSuccess.id)}
                          className={styles.linkBtn}
                        >
                          Ver detalle de mi solicitud
                          <ArrowRight size={14} strokeWidth={2.25} />
                        </button>
                        <button onClick={goToApplications} className={styles.linkBtn}>
                          <ListChecks size={14} />
                          Todas las solicitudes
                        </button>
                        <button onClick={resetSimulator} className={styles.linkBtn}>
                          <RotateCcw size={14} />
                          Nueva simulación
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {!simulationResult && !applicationSuccess && (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyStateIcon}>
                      <Calculator size={28} strokeWidth={1.5} />
                    </div>
                    <p className={styles.emptyStateTitle}>
                      Tu simulación aparecerá aquí
                    </p>
                    <p className={styles.emptyStateMsg}>
                      Completa el formulario para ver el resumen, las cuotas y el
                      plan de pagos.
                    </p>
                  </div>
                )}

                {simulationResult && !applicationSuccess && (
                  <>
                    <div className={styles.resultCard}>
                      <ResultSummary summary={simulationResult.summary} />
                    </div>

                    <div className={styles.resultCard}>
                      <AmortizationTable schedule={simulationResult.schedule} />
                    </div>

                    {!showApplicationForm && (
                      <button
                        onClick={() => setShowApplicationForm(true)}
                        className={styles.ctaPrimary}
                      >
                        Continuar con la solicitud
                        <ArrowRight size={18} strokeWidth={2.25} />
                      </button>
                    )}

                    {showApplicationForm && (
                      <div className={`${styles.resultCard} animate-fade-up`}>
                        <h2 className={styles.formTitle}>Datos personales</h2>
                        <p className={styles.formSubtitle}>
                          Completa tus datos para registrar la solicitud formal.
                        </p>
                        <ApplicationForm
                          onSubmit={handleApply}
                          loading={applicationLoading}
                        />
                      </div>
                    )}
                  </>
                )}
              </section>
            </div>
          </main>
        </>
      )}

      {/* Vista listado */}
      {view === 'applications' && (
        <>
          <section className={styles.heroSecondary}>
            <div className={styles.heroSecondaryInner}>
              <p className={styles.heroEyebrow}>
                <span className={styles.heroEyebrowDot} />
                Historial · Persistencia en PostgreSQL
              </p>
              <h1 className={styles.heroTitleMd}>
                Solicitudes <span className={styles.heroTitleAccent}>recibidas</span>
              </h1>
              <p className={styles.heroLead}>
                Todas las solicitudes formales registradas en la base de datos. Click
                en una tarjeta para ver el detalle completo.
              </p>
            </div>
          </section>

          <main className={styles.mainNarrow}>
            <ApplicationsList key={listKey} onSelect={selectApplication} />
          </main>
        </>
      )}

      {/* Vista detalle */}
      {view === 'application-detail' && selectedApplicationId !== null && (
        <main className={styles.mainNarrowTop}>
          <ApplicationDetail
            applicationId={selectedApplicationId}
            onBack={goToApplications}
          />
        </main>
      )}

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <p className={styles.footerText}>
            © {new Date().getFullYear()} Roda · Prueba técnica
          </p>
          <p className={styles.footerText}>
            Simulación referencial · No es una oferta vinculante de crédito
          </p>
        </div>
      </footer>
    </div>
  )
}