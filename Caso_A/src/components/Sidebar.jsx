import { Link, NavLink } from 'react-router-dom';
import { useFinance } from '../context/FinanceContext';
import Avatar from './Avatar';
import Icon from './Icon';

const primaryNav = [
  { to: '/', label: 'Resumen', icon: 'dashboard', end: true },
  { to: '/movimientos', label: 'Movimientos', icon: 'movements' },
  { to: '/ahorros', label: 'Ahorros', icon: 'piggy' },
];

const accountNav = [
  { to: '/perfil', label: 'Perfil', icon: 'user' },
  { to: '/ajustes', label: 'Ajustes', icon: 'settings' },
];

export default function Sidebar({ open, onClose }) {
  const { goals, profile, transactions, formatCurrency, notify } = useFinance();
  const activeGoal =
    [...goals].sort(
      (a, b) => b.saved / b.target - a.saved / a.target,
    ).find((goal) => goal.saved < goal.target) || goals[0];

  const goalProgress = activeGoal
    ? Math.min(100, (activeGoal.saved / activeGoal.target) * 100)
    : 0;

  const navClass = ({ isActive }) =>
    `nav-link${isActive ? ' is-active' : ''}`;

  return (
    <aside id="sidebar" className={`sidebar${open ? ' is-open' : ''}`}>
      <div className="sidebar-top">
        <Link className="brand" to="/" onClick={onClose}>
          <span className="brand-mark">
            <Icon name="trendUp" size={21} strokeWidth={2.2} />
          </span>
          <span className="brand-copy">
            <strong>Fintra</strong>
            <small>finanzas personales</small>
          </span>
        </Link>
        <button
          type="button"
          className="icon-button sidebar-close"
          onClick={onClose}
          aria-label="Cerrar menú"
        >
          <Icon name="close" size={19} />
        </button>
      </div>

      <nav className="sidebar-nav" aria-label="Navegación principal">
        <p className="nav-label">Tu espacio</p>
        {primaryNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={navClass}
            onClick={onClose}
          >
            <Icon name={item.icon} size={19} />
            <span>{item.label}</span>
            {item.to === '/movimientos' && (
              <span className="nav-count">{transactions.length}</span>
            )}
          </NavLink>
        ))}

        <p className="nav-label nav-label-spaced">Cuenta</p>
        {accountNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={navClass}
            onClick={onClose}
          >
            <Icon name={item.icon} size={19} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {activeGoal && (
        <div className="sidebar-goal">
          <div className="sidebar-goal-head">
            <span className="sidebar-goal-icon">
              <Icon name={activeGoal.icon} size={17} />
            </span>
            <div>
              <small>Meta destacada</small>
              <strong>{activeGoal.name}</strong>
            </div>
          </div>
          <div className="sidebar-goal-values">
            <span>{formatCurrency(activeGoal.saved, { maximumFractionDigits: 0 })}</span>
            <span>{Math.round(goalProgress)}%</span>
          </div>
          <div className="progress-track progress-track-sm">
            <span style={{ width: `${goalProgress}%` }} />
          </div>
          <Link to="/ahorros" className="sidebar-goal-link" onClick={onClose}>
            Ver mis ahorros
            <Icon name="arrowRight" size={15} />
          </Link>
        </div>
      )}

      <div className="sidebar-footer">
        <Link to="/perfil" className="sidebar-user" onClick={onClose}>
          <Avatar name={profile.name} size="sm" online />
          <span className="sidebar-user-copy">
            <strong>{profile.name}</strong>
            <small>Plan Personal</small>
          </span>
          <Icon name="chevronRight" size={16} />
        </Link>
        <div className="sidebar-footer-row">
          <span className="demo-pill">
            <span />
            Demo local
          </span>
          <button
            type="button"
            className="icon-button icon-button-sm"
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
            onClick={() => notify('Sesión de demo: no hay nada que cerrar 🙂', 'info')}
          >
            <Icon name="logout" size={17} />
          </button>
        </div>
      </div>
    </aside>
  );
}
