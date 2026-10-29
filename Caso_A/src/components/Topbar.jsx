import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useFinance } from '../context/FinanceContext';
import { monthLabel } from '../data';
import Avatar from './Avatar';
import Icon from './Icon';

const pageMeta = {
  '/': { title: 'Resumen', eyebrow: 'Vista general' },
  '/movimientos': { title: 'Movimientos', eyebrow: 'Actividad de la cuenta' },
  '/ahorros': { title: 'Ahorros', eyebrow: 'Tus metas en marcha' },
  '/perfil': { title: 'Perfil', eyebrow: 'Tu cuenta' },
  '/ajustes': { title: 'Ajustes', eyebrow: 'Preferencias' },
};

const notifications = [
  {
    id: 1,
    icon: 'alert',
    tone: 'amber',
    title: 'Presupuesto de Comida al 73 %',
    text: 'Te quedan 94,00 € para terminar el mes.',
    time: 'Hace 12 min',
  },
  {
    id: 2,
    icon: 'piggy',
    tone: 'green',
    title: 'Aporte automático completado',
    text: 'Se destinaron 400,00 € a tus ahorros.',
    time: 'Hace 2 h',
  },
  {
    id: 3,
    icon: 'sparkles',
    tone: 'blue',
    title: 'Nuevo informe mensual',
    text: 'Tu resumen de finanzas ya está disponible.',
    time: 'Ayer',
  },
];

export default function Topbar({ onMenu }) {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    profile,
    openTransactionModal,
    notify,
  } = useFinance();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationRef = useRef(null);

  const meta = pageMeta[location.pathname] || {
    title: 'Fintra',
    eyebrow: 'Gestión de gastos',
  };

  useEffect(() => {
    if (!notificationsOpen) return undefined;

    const handleClick = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [notificationsOpen]);

  useEffect(() => {
    setNotificationsOpen(false);
  }, [location.pathname]);

  const goToSearch = () => {
    navigate('/movimientos');
    window.setTimeout(() => {
      document.querySelector('.search-field input')?.focus();
    }, 120);
  };

  useEffect(() => {
    const handleShortcut = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        goToSearch();
      }
    };

    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="icon-button menu-button"
          onClick={onMenu}
          aria-label="Abrir menú"
        >
          <Icon name="menu" size={20} />
        </button>
        <div className="topbar-title">
          <span>{meta.eyebrow}</span>
          <h1>{meta.title}</h1>
        </div>
      </div>

      <div className="topbar-right">
        <button
          type="button"
          className="topbar-search"
          onClick={goToSearch}
        >
          <Icon name="search" size={17} />
          <span>Buscar movimientos</span>
          <kbd>⌘ K</kbd>
        </button>

        <span className="topbar-date">
          <Icon name="calendar" size={16} />
          <span>{monthLabel}</span>
        </span>

        <div className="notifications-wrap" ref={notificationRef}>
          <button
            type="button"
            className={`icon-button bell-button${
              notificationsOpen ? ' is-active' : ''
            }`}
            onClick={() => setNotificationsOpen((open) => !open)}
            aria-label="Notificaciones"
            aria-expanded={notificationsOpen}
          >
            <Icon name="bell" size={19} />
            <i className="notification-dot" />
          </button>

          {notificationsOpen && (
            <div className="notifications-popover">
              <header>
                <div>
                  <strong>Notificaciones</strong>
                  <span>3 nuevas</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setNotificationsOpen(false);
                    notify('Notificaciones marcadas como leídas.', 'info');
                  }}
                >
                  Marcar leídas
                </button>
              </header>
              <div className="notification-list">
                {notifications.map((item) => (
                  <button
                    type="button"
                    className="notification-item"
                    key={item.id}
                    onClick={() => {
                      setNotificationsOpen(false);
                      navigate(item.id === 2 ? '/ahorros' : '/movimientos');
                    }}
                  >
                    <span className={`notification-icon tone-${item.tone}`}>
                      <Icon name={item.icon} size={17} />
                    </span>
                    <span className="notification-copy">
                      <strong>{item.title}</strong>
                      <small>{item.text}</small>
                      <em>{item.time}</em>
                    </span>
                  </button>
                ))}
              </div>
              <Link
                to="/movimientos"
                className="notifications-footer"
                onClick={() => setNotificationsOpen(false)}
              >
                Ver toda la actividad
                <Icon name="arrowRight" size={15} />
              </Link>
            </div>
          )}
        </div>

        <button
          type="button"
          className="button button-primary topbar-add"
          onClick={openTransactionModal}
        >
          <Icon name="plus" size={18} />
          <span>Nuevo movimiento</span>
        </button>

        <Link to="/perfil" className="topbar-avatar" aria-label="Abrir perfil">
          <Avatar name={profile.name} size="sm" />
        </Link>
      </div>
    </header>
  );
}
