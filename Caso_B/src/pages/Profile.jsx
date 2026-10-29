import { useState } from 'react';
import Icon from '../components/Icon';
import { usePlayer } from '../context/PlayerContext';
import { readLocal, writeLocal } from '../utils/format';
import { playlists } from '../data/songs';

const defaultProfile = {
  name: 'Alejandro Ramírez',
  email: 'alejandro@sonora.demo',
  plan: 'Premium',
  notifications: true,
};

export default function Profile() {
  const { favorites, queue } = usePlayer();
  const [profile, setProfile] = useState(() => readLocal('cb-profile', defaultProfile));
  const [saved, setSaved] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setProfile((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setSaved(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    writeLocal('cb-profile', profile);
    setSaved(true);
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <span className="eyebrow">Perfil</span>
          <h1>Tu cuenta</h1>
          <p className="page-subtitle">
            Página de ejemplo para demostrar que la navegación interna no recarga el
            documento.
          </p>
        </div>
      </div>

      <div className="profile-layout">
        <section className="panel">
          <div className="profile-identity">
            <span className="avatar avatar-xl">AR</span>
            <div>
              <h2>{profile.name}</h2>
              <p>{profile.email}</p>
              <span className="pill">{profile.plan}</span>
            </div>
          </div>

          <div className="stats-row">
            <div className="stat">
              <strong>{favorites.length}</strong>
              <span>Canciones guardadas</span>
            </div>
            <div className="stat">
              <strong>{playlists.length}</strong>
              <span>Playlists</span>
            </div>
            <div className="stat">
              <strong>{queue.length}</strong>
              <span>En la cola actual</span>
            </div>
          </div>

          <form className="form" onSubmit={handleSubmit}>
            <label className="field">
              <span>Nombre</span>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                required
              />
            </label>

            <label className="field">
              <span>Correo electrónico</span>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                required
              />
            </label>

            <label className="field">
              <span>Plan</span>
              <select name="plan" value={profile.plan} onChange={handleChange}>
                <option value="Gratis">Gratis</option>
                <option value="Premium">Premium</option>
                <option value="Familiar">Familiar</option>
              </select>
            </label>

            <label className="check">
              <input
                type="checkbox"
                name="notifications"
                checked={profile.notifications}
                onChange={handleChange}
              />
              <span>Recibir novedades y recomendaciones por correo</span>
            </label>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Guardar cambios
              </button>
              {saved && (
                <span className="saved-msg">
                  <Icon name="heart" size={16} /> Guardado en este navegador
                </span>
              )}
            </div>
          </form>
        </section>

        <aside className="panel panel-soft">
          <h3>Cómo funciona esta SPA</h3>
          <ul className="info-list">
            <li>
              <Icon name="play" size={16} />
              <span>
                El <code>&lt;audio&gt;</code> vive en <code>PlayerProvider</code>, por encima
                de las rutas.
              </span>
            </li>
            <li>
              <Icon name="search" size={16} />
              <span>
                React Router intercepta los enlaces: el servidor no recibe peticiones de
                HTML al navegar.
              </span>
            </li>
            <li>
              <Icon name="library" size={16} />
              <span>
                El estado se comparte con Context API; favoritos y volumen quedan en
                localStorage.
              </span>
            </li>
            <li>
              <Icon name="heart" size={16} />
              <span>
                Al cambiar de ruta solo se desmonta la página, nunca el reproductor.
              </span>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
