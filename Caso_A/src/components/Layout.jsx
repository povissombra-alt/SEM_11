import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useFinance } from '../context/FinanceContext';
import AddTransactionModal from './AddTransactionModal';
import Icon from './Icon';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const toastIcons = {
  success: 'check',
  error: 'alert',
  info: 'info',
};

export default function Layout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { settings, toasts, dismissToast } = useFinance();

  useEffect(() => {
    setSidebarOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    document.body.classList.toggle('sidebar-locked', sidebarOpen);
    return () => document.body.classList.remove('sidebar-locked');
  }, [sidebarOpen]);

  return (
    <div className={`app-shell${settings.compactMode ? ' is-compact' : ''}`}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <button
        type="button"
        className={`sidebar-overlay${sidebarOpen ? ' is-visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-label="Cerrar menú"
        tabIndex={sidebarOpen ? 0 : -1}
      />

      <div className="main-shell">
        <Topbar onMenu={() => setSidebarOpen(true)} />

        <main className="page" key={location.pathname}>
          <Outlet />
        </main>
      </div>

      <AddTransactionModal />

      <div className="toast-viewport" aria-live="polite" aria-atomic="false">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.tone}`}>
            <span className="toast-icon">
              <Icon name={toastIcons[toast.tone] || 'info'} size={17} />
            </span>
            <p>{toast.message}</p>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Cerrar notificación"
            >
              <Icon name="close" size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
