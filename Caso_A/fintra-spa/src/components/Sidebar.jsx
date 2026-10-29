import { useMemo } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getMonthStats } from '../lib/selectors';
import { initials, money } from '../lib/format';
import Icon from './Icons';

const SECTIONS = [
  {
    label: 'Principal',
    items: [
      { to: '/', label: 'Panel general', icon: 'grid', end: true },
      { to: '/movimientos', label: 'Movimientos', icon: 'swap' },
      { to: '/graficas', label: 'Gráficas', icon: 'chart' },
    ],
  },
  {
    label: 'Cuenta',
    items: [
      { to: '/perfil', label: 'Mi perfil', icon: 'user' },
      { to: '/ajustes', label: 'Ajustes', icon: 'settings' },
    ],
  },
];

export default function Sidebar({ open, onClose }) {
  const { user, movements, privacy, live } = useApp();
  const stats = useMemo(() => getMonthStats(movements), [movements]);
  const progress = Math.min(
    100,
    Math.round((Math.max(stats.saving, 0) / (user.goal || 1)) * 100),
  );

  return (
    <aside className={`sidebar ${open ? 'is-open' : ''}`}>
      <div className="brand-row">
        <Link to="/" className="brand" onClick={onClose}>
          <span className="brand-mark">
            <Icon name="chart" size={22} />
          </span>
          <span className="brand-text">
            <strong>Fintra</strong>
            <small>Gestión de gastos</small>
          </span>
        </Link>
        <button
          type="button"
          className="icon-btn side-close"
          onClick={onClose}
          aria-label="Cerrar menú"
        >
          <Icon name="close" />
        </button>
      </div>

      <nav className="nav" aria-label="Navegación principal">
        {SECTIONS.map((section) => (
          <div className="nav-group" key={section.label}>
            <span className="nav-label">{section.label}</span>
            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <Icon name={item.icon} size={19} />
                <span>{item.label}</span>
                {item.to === '/movimientos' && (
                  <span className="nav-count">{movements.length}</span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="side-goal">
        <div className="side-goal-top">
          <span>Meta de ahorro</span>
          <strong>{progress}%</strong>
        </div>
        <div className="bar">
          <i style={{ width: `${progress}%` }} />
        </div>
        <p>
          {money(stats.saving, privacy)} de {money(user.goal, privacy)} este mes
        </p>
      </div>

      <div className="side-live">
        <span className={`live-dot ${live ? 'on' : ''}`} />
        <span>{live ? 'Sincronización activa' : 'Sincronización en pausa'}</span>
      </div>

      <Link to="/perfil" className="side-user" onClick={onClose}>
        <span className="avatar">{initials(user.name)}</span>
        <span className="side-user-info">
          <strong>{user.name}</strong>
          <small>{user.role}</small>
        </span>
        <Icon name="chevronRight" size={16} />
      </Link>
    </aside>
  );
}
