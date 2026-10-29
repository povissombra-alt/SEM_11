import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getBalance, getMonthStats } from '../lib/selectors';
import { initials, money, monthYear } from '../lib/format';
import Icon from '../components/Icons';

const toForm = (user) => ({
  name: user.name,
  email: user.email,
  phone: user.phone,
  city: user.city,
  goal: String(user.goal),
});

export default function Perfil() {
  const { user, movements, updateUser, privacy, addToast } = useApp();
  const [form, setForm] = useState(() => toForm(user));

  const balance = useMemo(() => getBalance(movements), [movements]);
  const stats = useMemo(() => getMonthStats(movements), [movements]);

  useEffect(() => {
    setForm(toForm(user));
  }, [user]);

  const current = toForm(user);
  const dirty = Object.keys(current).some((key) => form[key] !== current[key]);
  const progress = Math.min(
    100,
    Math.round((Math.max(stats.saving, 0) / (user.goal || 1)) * 100),
  );

  const setField = (field) => (event) => {
    setForm((value) => ({ ...value, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      addToast({ tone: 'error', title: 'Falta el nombre', message: 'Escribe tu nombre completo.' });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      addToast({
        tone: 'error',
        title: 'Correo no válido',
        message: 'Revisa el formato del correo electrónico.',
      });
      return;
    }

    updateUser({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      city: form.city.trim(),
      goal: Number(form.goal) > 0 ? Number(form.goal) : 0,
    });

    addToast({
      tone: 'success',
      title: 'Perfil actualizado',
      message: 'Los cambios se reflejan al instante en la cabecera y el menú.',
    });
  };

  return (
    <div className="page-in">
      <section className="profile-hero card">
        <span className="avatar avatar-xl">{initials(user.name)}</span>

        <div className="profile-id">
          <h2>{user.name}</h2>
          <p className="muted">{user.email}</p>
          <div className="badges">
            <span className="badge badge-gold">
              <Icon name="sparkles" size={14} /> {user.role}
            </span>
            <span className="badge">
              <Icon name="shield" size={14} /> Cuenta verificada
            </span>
          </div>
        </div>

        <div className="profile-facts">
          <div>
            <span>Miembro desde</span>
            <strong>{monthYear(user.memberSince)}</strong>
          </div>
          <div>
            <span>Movimientos</span>
            <strong>{movements.length}</strong>
          </div>
          <div>
            <span>Saldo actual</span>
            <strong>{money(balance, privacy)}</strong>
          </div>
        </div>
      </section>

      <div className="grid-2">
        <section className="card">
          <header className="card-head">
            <div>
              <h2>Datos personales</h2>
              <p className="muted">Se guardan en el navegador para esta demo</p>
            </div>
            {dirty && <span className="pill pill-warn">Cambios sin guardar</span>}
          </header>

          <form className="form-grid" onSubmit={handleSubmit}>
            <label className="field">
              <span>Nombre completo</span>
              <input type="text" value={form.name} onChange={setField('name')} />
            </label>

            <label className="field">
              <span>Correo electrónico</span>
              <input type="email" value={form.email} onChange={setField('email')} />
            </label>

            <label className="field">
              <span>Teléfono</span>
              <input type="tel" value={form.phone} onChange={setField('phone')} />
            </label>

            <label className="field">
              <span>Ciudad</span>
              <input type="text" value={form.city} onChange={setField('city')} />
            </label>

            <label className="field">
              <span>Meta de ahorro mensual (€)</span>
              <input type="number" min="0" step="50" value={form.goal} onChange={setField('goal')} />
            </label>

            <div className="field field-actions">
              <button type="submit" className="btn btn-primary" disabled={!dirty}>
                <Icon name="check" size={17} /> Guardar cambios
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                disabled={!dirty}
                onClick={() => setForm(toForm(user))}
              >
                Descartar
              </button>
            </div>
          </form>
        </section>

        <section className="card">
          <header className="card-head">
            <div>
              <h2>Resumen de la cuenta</h2>
              <p className="muted">Datos calculados en tiempo real</p>
            </div>
          </header>

          <div className="summary-list">
            <div className="summary-row">
              <span>Saldo disponible</span>
              <strong>{money(balance, privacy)}</strong>
            </div>
            <div className="summary-row">
              <span>Ingresos del mes</span>
              <strong className="pos">{money(stats.income, privacy)}</strong>
            </div>
            <div className="summary-row">
              <span>Gastos del mes</span>
              <strong className="neg">{money(stats.expense, privacy)}</strong>
            </div>
            <div className="summary-row">
              <span>Ahorro del mes</span>
              <strong>{money(stats.saving, privacy)}</strong>
            </div>
          </div>

          <div className="goal-box">
            <div className="side-goal-top">
              <span>Meta de ahorro</span>
              <strong>{progress}%</strong>
            </div>
            <div className="bar">
              <i style={{ width: `${progress}%` }} />
            </div>
            <p className="muted">
              {money(Math.max(stats.saving, 0), privacy)} de {money(user.goal, privacy)}
            </p>
          </div>

          <div className="profile-links">
            <Link to="/graficas" className="btn btn-ghost">
              <Icon name="chart" size={17} /> Ver mis gráficas
            </Link>
            <Link to="/ajustes" className="btn btn-ghost">
              <Icon name="settings" size={17} /> Ir a ajustes
            </Link>
          </div>

          <button
            type="button"
            className="btn btn-ghost logout-btn"
            onClick={() =>
              addToast({
                tone: 'info',
                title: 'Sesión de demostración',
                message: 'Esta demo no tiene backend, así que no hay cierre de sesión real.',
              })
            }
          >
            <Icon name="lock" size={17} /> Cerrar sesión
          </button>
        </section>
      </div>
    </div>
  );
}
