import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { duration } from '../lib/format';
import Icon from '../components/Icons';

function Uptime({ start }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return <span className="mono">{duration(now - start)}</span>;
}

function Toggle({ icon, title, description, checked, onChange }) {
  return (
    <div className="pref">
      <span className="pref-icon">
        <Icon name={icon} size={18} />
      </span>
      <div className="pref-text">
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        className="switch"
        onClick={onChange}
      />
    </div>
  );
}

export default function Ajustes() {
  const {
    user,
    updateUser,
    privacy,
    setPrivacy,
    live,
    setLive,
    resetDemo,
    sessionStart,
    visits,
    shellMounts,
    addToast,
  } = useApp();
  const { pathname } = useLocation();
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!confirming) return undefined;
    const timer = window.setTimeout(() => setConfirming(false), 4000);
    return () => window.clearTimeout(timer);
  }, [confirming]);

  const preferences = user.preferences;
  const togglePreference = (key) =>
    updateUser({ preferences: { ...preferences, [key]: !preferences[key] } });

  return (
    <div className="page-in">
      <div className="grid-2">
        <section className="card">
          <header className="card-head">
            <div>
              <h2>Preferencias</h2>
              <p className="muted">Se aplican al instante en toda la aplicación</p>
            </div>
          </header>

          <div className="pref-list">
            <Toggle
              icon="bell"
              title="Notificaciones push"
              description="Avisos de nuevos movimientos y alertas de la cuenta."
              checked={preferences.notifications}
              onChange={() => togglePreference('notifications')}
            />
            <Toggle
              icon="alert"
              title="Alertas de gasto"
              description="Avisar cuando un gasto supere el importe habitual."
              checked={preferences.alerts}
              onChange={() => togglePreference('alerts')}
            />
            <Toggle
              icon="calendar"
              title="Resumen semanal"
              description="Recibe un correo con el balance de la semana."
              checked={preferences.weekly}
              onChange={() => togglePreference('weekly')}
            />
            <Toggle
              icon="eyeOff"
              title="Modo privacidad"
              description="Oculta todos los importes de la interfaz."
              checked={privacy}
              onChange={() => setPrivacy(!privacy)}
            />
            <Toggle
              icon="clock"
              title="Datos en vivo"
              description="Simula la llegada de movimientos bancarios cada 12 segundos."
              checked={live}
              onChange={() => setLive(!live)}
            />
          </div>
        </section>

        <section className="card">
          <header className="card-head">
            <div>
              <h2>Seguridad</h2>
              <p className="muted">Protección de la cuenta</p>
            </div>
          </header>

          <div className="summary-list">
            <div className="summary-row">
              <span>Último acceso</span>
              <strong>Hoy, 09:42</strong>
            </div>
            <div className="summary-row">
              <span>Método</span>
              <strong>Correo + contraseña</strong>
            </div>
            <div className="summary-row">
              <span>Verificación en dos pasos</span>
              <strong className="pos">Activa</strong>
            </div>
            <div className="summary-row">
              <span>Correo de la cuenta</span>
              <strong className="truncate">{user.email}</strong>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-ghost security-btn"
            onClick={() =>
              addToast({
                tone: 'info',
                title: 'Acción simulada',
                message: 'Esta demo no tiene backend para cambiar la contraseña.',
              })
            }
          >
            <Icon name="lock" size={17} /> Cambiar contraseña
          </button>

          <p className="muted small">
            Las acciones de seguridad son simuladas: el objetivo de la práctica es el
            comportamiento de la SPA.
          </p>
        </section>
      </div>

      <section className="card spa-card">
        <div className="spa-head">
          <span className="badge badge-live">
            <span className="live-dot on" /> Modo SPA activo
          </span>
          <h2>El navegador nunca pide una página nueva</h2>
          <p className="muted">
            React Router intercepta la navegación y cambia únicamente el contenido central. El
            menú lateral, la cabecera y el estado global se mantienen intactos.
          </p>
        </div>

        <div className="spa-stats">
          <div>
            <span>Tiempo de sesión</span>
            <strong>
              <Uptime start={sessionStart} />
            </strong>
          </div>
          <div>
            <span>Vistas visitadas</span>
            <strong>{visits}</strong>
          </div>
          <div>
            <span>Montajes del layout</span>
            <strong>{shellMounts}</strong>
          </div>
          <div>
            <span>Recargas de página</span>
            <strong>0</strong>
          </div>
        </div>

        <div className="spa-note">
          <Icon name="sparkles" size={18} />
          <p>
            Ruta actual: <code>{pathname}</code>. Al pulsar otra opción del menú, la URL cambia
            con la History API y solo se vuelve a renderizar la vista de la ruta: no hay petición
            de un HTML nuevo al servidor ni parpadeo en blanco.
          </p>
        </div>

        <div className="spa-actions">
          <button
            type="button"
            className={`btn ${confirming ? 'btn-danger' : 'btn-ghost'}`}
            onClick={() => {
              if (confirming) {
                resetDemo();
                setConfirming(false);
              } else {
                setConfirming(true);
              }
            }}
          >
            <Icon name="reset" size={17} />
            {confirming ? '¿Confirmar restablecimiento?' : 'Restablecer datos de la demo'}
          </button>
          <span className="muted small">
            Vuelve al estado inicial: perfil, movimientos y preferencias.
          </span>
        </div>
      </section>
    </div>
  );
}
