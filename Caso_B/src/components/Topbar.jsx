import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import Icon from './Icon';

export default function Topbar() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [text, setText] = useState(params.get('q') ?? '');

  useEffect(() => {
    setText(params.get('q') ?? '');
  }, [params]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const query = text.trim();
    navigate(query ? `/buscar?q=${encodeURIComponent(query)}` : '/buscar');
  };

  return (
    <header className="topbar">
      <div className="topbar-history">
        <button
          type="button"
          className="icon-btn topbar-arrow"
          onClick={() => navigate(-1)}
          aria-label="Atrás"
        >
          <Icon name="back" size={20} />
        </button>
        <button
          type="button"
          className="icon-btn topbar-arrow"
          onClick={() => navigate(1)}
          aria-label="Adelante"
        >
          <Icon name="forward" size={20} />
        </button>
      </div>

      <form className="topbar-search" onSubmit={handleSubmit} role="search">
        <Icon name="search" size={18} />
        <input
          type="search"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="¿Qué quieres escuchar?"
          aria-label="Buscar canciones, artistas o géneros"
        />
      </form>

      <Link to="/perfil" className="profile-pill">
        <span className="avatar">AR</span>
        <span className="profile-pill-name">Alejandro</span>
      </Link>
    </header>
  );
}
