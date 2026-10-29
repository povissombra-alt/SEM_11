import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { initials } from '../lib/format';
import Icon from './Icons';

const TITLES = {
  '/': ['Panel general', 'Tu resumen financiero en tiempo real'],
  '/movimientos': ['Movimientos', 'Historial completo de la cuenta'],
  '/graficas': ['Gráficas', 'Analiza tu ahorro y tus gastos'],
  '/perfil': ['Mi perfil', 'Datos personales de tu cuenta'],
  '/ajustes': ['Ajustes', 'Preferencias, seguridad y modo SPA'],
};

export default function Topbar({ onMenu }) {
  const { pathname } = useLocation();
  const {
    user,
    privacy,
    setPrivacy,
    live,
    setLive,
    notifications,
    unreadCount,
    markAllRead,
  } = useApp();
  const [open, setOpen] = useState(false);
  const [title, subtitle] = TITLES[pathname] || ['Fintra', 'Gestión de gastos'];

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="icon-btn menu-btn"
          onClick={onMenu}
          aria-label="Abrir menú"
        >
          <Icon name="menu" />
        </button>
        <div>
          <h1 className="page-title">{title}</h1>
          <p className="page-sub">{subtitle}</p>
        </div>
      </div>

      <div className="topbar-right">
        <button
          type="button"
          className={`live-pill ${live ? 'is-on' : ''}`}
          onClick={() => setLive((value) => !value)}
          title={live ? 'Pausar datos en vivo' : 'Reanudar datos en vivo'}
        >
          <span className={`live-dot ${live ? 'on' : ''}`} />
          {live ? 'En vivo' : 'Pausado'}
        </button>

        <button
          type="button"
          className="icon-btn"
          onClick={() => setPrivacy((value) => !value)}
          title={privacy ? 'Mostrar importes' : 'Ocultar importes'}
          aria-label="Alternar privacidad"
        >
          <Icon name={privacy ? 'eyeOff' : 'eye'} />
        </button>

        <div className="bell-wrap">
          <button
            type="button"
            className={`icon-btn ${open ? 'is-active' : ''}`}
            onClick={() => setOpen((value) => !value)}
            aria-label="Notificaciones"
            aria-expanded={open}
          >
            <Icon name="bell" />
            {unreadCount > 0 && <span className="bell-dot">{unreadCount}</span>}
          </button>

          {open && (
            <>
              <div className="pop-backdrop" onClick={() => setOpen(false)} />
              <div className="popover">
                <header>
                  <strong>Notificaciones</strong>
                  <button type="button" className="link" onClick={markAllRead}>
                    Marcar leídas
                  </button>
                </header>
                <ul>
                  {notifications.slice(0, 6).map((item) => (
                    <li key={item.id} className={item.unread ? 'unread' : ''}>
                      <span className="pop-icon">
                        <Icon name="bell" size={15} />
                      </span>
                      <div>
                        <strong>{item.title}</strong>
                        <p>{item.body}</p>
                        <time>{item.time}</time>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>

        <Link to="/perfil" className="avatar-chip">
          <span className="avatar">{initials(user.name)}</span>
          <span className="avatar-chip-text">
            <strong>{user.name}</strong>
            <small>{user.role}</small>
          </span>
        </Link>
      </div>
    </header>
  );
}
