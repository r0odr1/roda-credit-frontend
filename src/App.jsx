import { useState } from 'react'
import { CheckCircle2, AlertCircle, ListChecks, Calculator, ArrowRight } from 'lucide-react'
import styles from './App.module.css'

export default function App() {
  const [view, setView] = useState('simulator')

  const applicationsTabActive =
    view === 'applications' || view === 'application-detail'

  return (
    <div className={styles.app}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <button onClick={() => {}} className={styles.brand}>
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
              onClick={() => {}}
              className={`${styles.navItem} ${applicationsTabActive ? styles.navItemActive : ''}`}
            >
              <ListChecks size={14} strokeWidth={2} />
              <span className={styles.navLabel}>Solicitudes</span>
            </button>
          </nav>

          <div className={styles.headerActions}>
            <span className={styles.langTag}>ES</span>
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

                {simulationResult && (
                  <>
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
