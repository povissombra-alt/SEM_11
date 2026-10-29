import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFinance } from '../context/FinanceContext';
import Avatar from '../components/Avatar';
import Icon from '../components/Icon';

function InfoRow({ icon, label, value }) {
  return (
    <div className="info-row">
      <span className="info-row-icon">
        <Icon name={icon} size={17} />
      </span>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

export default function Profile() {
  const {
    profile,
    updateProfile,
    transactions,
    goals,
    notify,
    formatCurrency,
  } = useFinance();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(profile);

  const activeGoals = goals.filter((goal) => goal.saved < goal.target).length;
  const savedInGoals = goals.reduce((total, goal) => total + goal.saved, 0);

  const update = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updateProfile(form);
    notify('Perfil actualizado correctamente.');
    setEditing(false);
  };

  const cancelEditing = () => {
    setForm(profile);
    setEditing(false);
  };

  return (
    <div className="profile-page">
      <section className="page-intro">
        <div>
          <span className="eyebrow">
            <span className="live-dot" />
            Cuenta personal
          </span>
          <h2>Tu perfil</h2>
          <p>
            Tus datos, tus preferencias y el contexto de tu cuenta en un vistazo.
          </p>
        </div>
        <div className="page-actions">
          {!editing ? (
            <button
              type="button"
              className="button button-primary"
              onClick={() => setEditing(true)}
            >
              <Icon name="edit" size={17} />
              Editar perfil
            </button>
          ) : (
            <>
              <button
                type="button"
                className="button button-ghost"
                onClick={cancelEditing}
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="profile-form"
                className="button button-primary"
              >
                <Icon name="check" size={17} />
                Guardar cambios
              </button>
            </>
          )}
        </div>
      </section>

      <section className="profile-hero-card">
        <div className="profile-cover">
          <span className="profile-cover-grid" aria-hidden="true" />
        </div>
        <div className="profile-hero-content">
          <div className="profile-avatar-wrap">
            <Avatar name={profile.name} size="xl" online />
            {editing && (
              <button
                type="button"
                className="avatar-edit"
                aria-label="Cambiar foto de perfil"
                onClick={() =>
                  notify('La subida de foto es simulada en esta demo.', 'info')
                }
              >
                <Icon name="edit" size={14} />
              </button>
            )}
          </div>

          <div className="profile-identity">
            <div className="profile-name-row">
              <h3>{profile.name}</h3>
              <span className="verified-pill">
                <Icon name="check" size={12} />
                Verificada
              </span>
            </div>
            <p>{profile.role}</p>
            <div className="profile-meta">
              <span>
                <Icon name="mail" size={14} />
                {profile.email}
              </span>
              <span>
                <Icon name="pin" size={14} />
                {profile.location}
              </span>
              <span>
                <Icon name="calendar" size={14} />
                Miembro desde {profile.memberSince}
              </span>
            </div>
          </div>

          <div className="profile-completion">
            <div>
              <span>Perfil completado</span>
              <strong>100 %</strong>
            </div>
            <div className="progress-track">
              <span style={{ width: '100%' }} />
            </div>
          </div>
        </div>
      </section>

      <section className="profile-stats">
        <div>
          <span className="profile-stat-icon tone-green">
            <Icon name="movements" size={18} />
          </span>
          <div>
            <strong>{transactions.length}</strong>
            <span>movimientos registrados</span>
          </div>
        </div>
        <div>
          <span className="profile-stat-icon tone-blue">
            <Icon name="target" size={18} />
          </span>
          <div>
            <strong>{activeGoals}</strong>
            <span>metas de ahorro activas</span>
          </div>
        </div>
        <div>
          <span className="profile-stat-icon tone-amber">
            <Icon name="piggy" size={18} />
          </span>
          <div>
            <strong>{formatCurrency(savedInGoals, { maximumFractionDigits: 0 })}</strong>
            <span>ahorrados en metas</span>
          </div>
        </div>
      </section>

      <section className="profile-grid">
        <article className="card profile-form-card">
          <header className="card-header">
            <div>
              <span className="card-kicker">Información personal</span>
              <h2>Datos de la cuenta</h2>
            </div>
            {editing && <span className="edit-pill">Editando</span>}
          </header>

          <form id="profile-form" className="form-stack" onSubmit={handleSubmit}>
            <div className="form-grid">
              <label className="field">
                <span>Nombre completo</span>
                <div className="input-with-icon">
                  <Icon name="user" size={17} />
                  <input
                    type="text"
                    value={form.name}
                    onChange={update('name')}
                    disabled={!editing}
                    required
                  />
                </div>
              </label>
              <label className="field">
                <span>Ocupación</span>
                <div className="input-with-icon">
                  <Icon name="target" size={17} />
                  <input
                    type="text"
                    value={form.role}
                    onChange={update('role')}
                    disabled={!editing}
                  />
                </div>
              </label>
            </div>

            <div className="form-grid">
              <label className="field">
                <span>Correo electrónico</span>
                <div className="input-with-icon">
                  <Icon name="mail" size={17} />
                  <input
                    type="email"
                    value={form.email}
                    onChange={update('email')}
                    disabled={!editing}
                    required
                  />
                </div>
              </label>
              <label className="field">
                <span>Teléfono</span>
                <div className="input-with-icon">
                  <Icon name="phone" size={17} />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={update('phone')}
                    disabled={!editing}
                  />
                </div>
              </label>
            </div>

            <label className="field">
              <span>Ubicación</span>
              <div className="input-with-icon">
                <Icon name="pin" size={17} />
                <input
                  type="text"
                  value={form.location}
                  onChange={update('location')}
                  disabled={!editing}
                />
              </div>
            </label>

            <label className="field">
              <span>Sobre mí</span>
              <textarea
                rows="4"
                value={form.bio}
                onChange={update('bio')}
                disabled={!editing}
                placeholder="Cuéntanos un poco sobre ti…"
              />
            </label>

            {!editing && (
              <p className="form-hint">
                <Icon name="lock" size={14} />
                Pulsa “Editar perfil” para modificar tus datos.
              </p>
            )}
          </form>
        </article>

        <div className="profile-side">
          <article className="card profile-side-card">
            <header className="card-header">
              <div>
                <span className="card-kicker">Suscripción</span>
                <h2>Plan Personal</h2>
              </div>
              <span className="plan-badge">Activo</span>
            </header>
            <div className="plan-price">
              <strong>Gratis</strong>
              <span>para siempre</span>
            </div>
            <div className="plan-features">
              <span>
                <Icon name="check" size={14} />
                Movimientos ilimitados
              </span>
              <span>
                <Icon name="check" size={14} />
                Metas de ahorro
              </span>
              <span>
                <Icon name="check" size={14} />
                Informes mensuales
              </span>
            </div>
            <button
              type="button"
              className="button button-soft button-block"
              onClick={() =>
                notify('El plan Plus llegará pronto a esta demo.', 'info')
              }
            >
              Conocer el plan Plus
              <Icon name="arrowUpRight" size={16} />
            </button>
          </article>

          <article className="card profile-side-card">
            <header className="card-header">
              <div>
                <span className="card-kicker">Protección</span>
                <h2>Seguridad</h2>
              </div>
              <span className="security-icon">
                <Icon name="shield" size={20} />
              </span>
            </header>
            <div className="profile-info-list">
              <InfoRow
                icon="lock"
                label="Contraseña"
                value="Actualizada hace 2 meses"
              />
              <InfoRow
                icon="phone"
                label="Verificación en dos pasos"
                value="Activada"
              />
              <InfoRow
                icon="clock"
                label="Último acceso"
                value="Hoy, 09:42 · Madrid"
              />
            </div>
            <button
              type="button"
              className="text-link profile-security-link"
              onClick={() =>
                notify('La gestión de seguridad es una simulación.', 'info')
              }
            >
              Gestionar seguridad
              <Icon name="arrowRight" size={15} />
            </button>
          </article>

          <Link to="/ajustes" className="profile-settings-link">
            <span>
              <Icon name="settings" size={19} />
            </span>
            <div>
              <strong>Preferencias de la app</strong>
              <small>Moneda, privacidad y notificaciones</small>
            </div>
            <Icon name="chevronRight" size={17} />
          </Link>
        </div>
      </section>
    </div>
  );
}
