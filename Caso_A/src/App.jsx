import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { FinanceProvider } from './context/FinanceContext';
import Dashboard from './pages/Dashboard';
import Movements from './pages/Movements';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import Savings from './pages/Savings';
import Settings from './pages/Settings';

export default function App() {
  return (
    <FinanceProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="movimientos" element={<Movements />} />
          <Route path="ahorros" element={<Savings />} />
          <Route path="graficas" element={<Navigate to="/ahorros" replace />} />
          <Route path="perfil" element={<Profile />} />
          <Route path="ajustes" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </FinanceProvider>
  );
}
