import { useState } from 'react'
import { CheckCircle2, AlertCircle, ListChecks, Calculator, ArrowRight } from 'lucide-react'
import SimulationForm from './components/SimulationForm'
import ResultSummary from './components/ResultSummary'
import AmortizationTable from './components/AmortizationTable'
import ApplicationForm from './components/ApplicationForm'
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
  
  function goToSimulator() {
    setView('simulator')
    setSelectedApplicationId(null)
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
                  onClick={()=> {}}
                  className={`${styles.navItem} ${applicationsTabActive ? styles.navItemActive : ''}`}
              >
                <ListChecks size={14} strokeWidth={2} />
                <span className={styles.navLabel}>Solicitudes</span>
              </button>
            </nav>
            
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

                    {simulationResult && (
                        <>
                          <div className={styles.resultCard}>
                            <ResultSummary summary={simulationResult.summary} />
                          </div>

                          <div className={styles.resultCard}>
                            <AmortizationTable schedule={simulationResult.schedule} />
                          </div>

                          {!showApplicationForm && !applicationSuccess && (
                              <button
                                  onClick={() => setShowApplicationForm(true)}
                                  className={styles.ctaPrimary}
                              >
                                Continuar con la solicitud
                                <ArrowRight size={18} strokeWidth={2.25} />
                              </button>
                          )}

                          {showApplicationForm && !applicationSuccess && (
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
