import { useEffect, useState } from 'react';
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Toasts from './components/Toasts';
import Dashboard from './pages/Dashboard';
import Movimientos from './pages/Movimientos';
import Graficas from './pages/Graficas';
import Perfil from './pages/Perfil';
import Ajustes from './pages/Ajustes';
import Icon from './components/Icons';

function NotFound() {
  return (
    <div className="page-in">
      <section className="card empty" style={{ padding: '70px 20px' }}>
        <span className="empty-icon">
          <Icon name="alert" size={24} />
        </span>
        <strong style={{ fontSize: 20 }}>404 · Ruta no encontrada</strong>
        <p>Esta dirección no existe dentro de la SPA, pero el menú sigue intacto.</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: 14 }}>
          <Icon name="grid" size={17} /> Volver al panel
        </Link>
      </section>
    </div>
  );
}

function Shell() {
  const { pathname } = useLocation();
  const { registerVisit, registerShell } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    registerVisit();
    window.scrollTo(0, 0);
  }, [pathname, registerVisit]);

  useEffect(() => {
    registerShell();
  }, [registerShell]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <div className={`shell ${menuOpen ? 'menu-open' : ''}`}>
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      {menuOpen && <div className="scrim" onClick={() => setMenuOpen(false)} />}

      <div className="shell-main">
        <Topbar onMenu={() => setMenuOpen((value) => !value)} />

        <main className="page">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/movimientos" element={<Movimientos />} />
            <Route path="/graficas" element={<Graficas />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/ajustes" element={<Ajustes />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <footer className="page-foot">
          <span>Fintra · Caso Práctico A — Gestión de Gastos</span>
          <span>SPA con React Router · datos simulados en tiempo real</span>
        </footer>
      </div>

      <Toasts />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Shell />
      </BrowserRouter>
    </AppProvider>
  );
}
