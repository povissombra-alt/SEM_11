import { useFinance } from '../context/FinanceContext';
import Icon from '../components/Icon';

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`toggle${checked ? ' is-on' : ''}`}
      onClick={() => onChange(!checked)}
    >
      <span />
    </button>
  );
}

function SettingRow({ icon, title, description, children, tone = 'blue' }) {
  return (
    <div className="setting-row">
      <span className={`setting-icon tone-${tone}`}>
        <Icon name={icon} size={18} />
      </span>
      <div className="setting-copy">
        <strong>{title}</strong>
        <span>{description}</span>
      </div>
      <div className="setting-control">{children}</div>
    </div>
  );
}

export default function Settings() {
  const {
    settings,
    updateSettings,
    notify,
    transactions,
    resetDemo,
  } = useFinance();

  const setSetting = (patch) => updateSettings(patch);

  const handleReset = () => {
    const confirmed = window.confirm(
      '¿Restablecer la demo? Se borrarán los movimientos, metas y cambios de perfil guardados en este navegador.',
    );
    if (confirmed) resetDemo();
  };

  return (
    <div className="settings-page">
      <section className="page-intro">
        <div>
          <span className="eyebrow">
            <span className="live-dot" />
            Todo se guarda en este navegador
          </span>
          <h2>Ajustes</h2>
          <p>
            Personaliza cómo se ve y se comporta Fintra. Los cambios se aplican
            al instante.
          </p>
        </div>
        <span className="autosave-pill">
          <Icon name="check" size={14} />
          Guardado automático
        </span>
      </section>

      <section className="settings-grid">
        <div className="settings-main">
          <article className="card settings-card">
            <header className="card-header">
              <div>
                <span className="card-kicker">General</span>
                <h2>Preferencias de la app</h2>
              </div>
              <span className="settings-header-icon">
                <Icon name="settings" size={19} />
              </span>
            </header>

            <div className="settings-list">
              <SettingRow
                icon="globe"
                title="Moneda principal"
                description="Se usa para mostrar todos los importes."
                tone="green"
              >
                <select
                  className="compact-select"
                  value={settings.currency}
                  onChange={(event) => {
                    setSetting({ currency: event.target.value });
                    notify(
                      `Moneda actualizada a ${event.target.value}.`,
                      'success',
                    );
                  }}
                  aria-label="Moneda principal"
                >
                  <option value="EUR">EUR · Euro</option>
                  <option value="USD">USD · Dólar</option>
                  <option value="MXN">MXN · Peso mexicano</option>
                  <option value="COP">COP · Peso colombiano</option>
                  <option value="ARS">ARS · Peso argentino</option>
                </select>
              </SettingRow>

              <SettingRow
                icon="dashboard"
                title="Vista compacta"
                description="Reduce el espacio entre tarjetas para ver más contenido."
                tone="violet"
              >
                <Toggle
                  label="Activar vista compacta"
                  checked={settings.compactMode}
                  onChange={(value) => setSetting({ compactMode: value })}
                />
              </SettingRow>

              <SettingRow
                icon="eye"
                title="Ocultar importes"
                description="Modo privacidad para mostrar los saldos como puntos."
                tone="amber"
              >
                <Toggle
                  label="Ocultar importes"
                  checked={settings.hideBalances}
                  onChange={(value) => {
                    setSetting({ hideBalances: value });
                    notify(
                      value
                        ? 'Importes ocultos. Modo privacidad activo.'
                        : 'Importes visibles de nuevo.',
                      'info',
                    );
                  }}
                />
              </SettingRow>
            </div>
          </article>

          <article className="card settings-card">
            <header className="card-header">
              <div>
                <span className="card-kicker">Alertas</span>
                <h2>Notificaciones</h2>
              </div>
              <span className="settings-header-icon">
                <Icon name="bell" size={19} />
              </span>
            </header>

            <div className="settings-list">
              <SettingRow
                icon="bell"
                title="Notificaciones push"
                description="Avisos de movimientos, metas y actividad de la cuenta."
                tone="blue"
              >
                <Toggle
                  label="Notificaciones push"
                  checked={settings.notifications}
                  onChange={(value) => setSetting({ notifications: value })}
                />
              </SettingRow>

              <SettingRow
                icon="calendar"
                title="Resumen semanal"
                description="Un correo cada lunes con el estado de tus finanzas."
                tone="green"
              >
                <Toggle
                  label="Resumen semanal"
                  checked={settings.weeklySummary}
                  onChange={(value) => setSetting({ weeklySummary: value })}
                />
              </SettingRow>

              <SettingRow
                icon="alert"
                title="Alertas de presupuesto"
                description="Te avisamos al superar el 80 % de una categoría."
                tone="amber"
              >
                <Toggle
                  label="Alertas de presupuesto"
                  checked={settings.budgetAlerts}
                  onChange={(value) => setSetting({ budgetAlerts: value })}
                />
              </SettingRow>
            </div>
          </article>
        </div>

        <aside className="settings-side">
          <article className="card settings-side-card">
            <header className="card-header">
              <div>
                <span className="card-kicker">Privacidad</span>
                <h2>Tu información</h2>
              </div>
              <span className="settings-header-icon">
                <Icon name="shield" size={19} />
              </span>
            </header>
            <p className="settings-side-copy">
              Esta demo no envía datos a ningún servidor. Todo vive en el
              almacenamiento local de tu navegador.
            </p>
            <div className="local-data-box">
              <span>
                <Icon name="movements" size={16} />
                Movimientos guardados
              </span>
              <strong>{transactions.length}</strong>
            </div>
            <div className="local-data-box">
              <span>
                <Icon name="lock" size={16} />
                Conexión externa
              </span>
              <strong>Ninguna</strong>
            </div>
            <button
              type="button"
              className="text-link settings-side-link"
              onClick={() => notify('Ya no hay más sesiones activas.', 'info')}
            >
              Cerrar otras sesiones
              <Icon name="arrowRight" size={15} />
            </button>
          </article>

          <article className="card settings-side-card danger-card">
            <header className="card-header">
              <div>
                <span className="card-kicker">Zona demo</span>
                <h2>Datos de práctica</h2>
              </div>
              <span className="settings-header-icon">
                <Icon name="refresh" size={19} />
              </span>
            </header>
            <p className="settings-side-copy">
              Vuelve al estado inicial de la demo: movimientos, metas, perfil y
              ajustes originales.
            </p>
            <button
              type="button"
              className="button button-danger-soft button-block"
              onClick={handleReset}
            >
              <Icon name="refresh" size={16} />
              Restablecer demo
            </button>
          </article>

          <div className="spa-note">
            <span className="spa-note-mark">SPA</span>
            <div>
              <strong>Una sola aplicación</strong>
              <p>
                La navegación ocurre en el cliente: el menú lateral nunca se
                recarga y solo cambia el contenido de la ruta.
              </p>
            </div>
          </div>
        </aside>
      </section>

      <footer className="settings-footer">
        <span>Fintra · Caso Práctico A</span>
        <span>React + Vite + React Router · v1.0.0</span>
      </footer>
    </div>
  );
}
