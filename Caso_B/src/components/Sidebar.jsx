import { NavLink, Link } from 'react-router-dom';
import Icon from './Icon';
import Cover from './Cover';
import { usePlayer } from '../context/PlayerContext';
import { playlists } from '../data/songs';

const navItems = [
  { to: '/', label: 'Inicio', icon: 'home', end: true },
  { to: '/buscar', label: 'Buscar', icon: 'search' },
  { to: '/biblioteca', label: 'Tu biblioteca', icon: 'library' },
];

export default function Sidebar() {
  const { favorites } = usePlayer();

  return (
    <aside className="sidebar">
      <Link to="/" className="brand">
        <span className="brand-mark">
          <Icon name="play" size={16} />
        </span>
        <span className="brand-name">Sonora</span>
      </Link>

      <nav className="sidebar-nav" aria-label="Navegación principal">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}
          >
            <Icon name={item.icon} size={20} />
            <span className="nav-label">{item.label}</span>
            {item.to === '/biblioteca' && favorites.length > 0 && (
              <span className="nav-badge">{favorites.length}</span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-divider" />

      <div className="sidebar-playlists">
        <p className="sidebar-heading">Tus playlists</p>
        {playlists.map((playlist) => (
          <Link key={playlist.id} to={`/playlist/${playlist.id}`} className="sidebar-playlist">
            <Cover item={playlist} size="xxs" />
            <span className="sidebar-playlist-text">
              <span className="sidebar-playlist-name">{playlist.name}</span>
              <span className="sidebar-playlist-meta">Playlist · {playlist.trackIds.length} canciones</span>
            </span>
          </Link>
        ))}
      </div>

      <div className="sidebar-footer">
        <p>Demo académica SPA</p>
        <p className="sidebar-footer-sub">React + React Router</p>
      </div>
    </aside>
  );
}
