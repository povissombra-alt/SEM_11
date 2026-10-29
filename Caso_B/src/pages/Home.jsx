import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import Cover from '../components/Cover';
import Icon from '../components/Icon';
import PlaylistCard from '../components/PlaylistCard';
import SongRow, { SongListHeader } from '../components/SongRow';
import { usePlayer } from '../context/PlayerContext';
import { getPlaylistTracks, playlists, songs } from '../data/songs';

function greetingByHour() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 20) return 'Buenas tardes';
  return 'Buenas noches';
}

export default function Home() {
  const { playTrack, currentTrack, isPlaying, togglePlay } = usePlayer();
  const featured = playlists[1];
  const featuredTracks = useMemo(() => getPlaylistTracks(featured), [featured]);
  const trending = songs.slice(0, 6);

  const featuredIsCurrent = featuredTracks.some((track) => track.id === currentTrack?.id);

  const playFeatured = () => {
    if (featuredIsCurrent) {
      togglePlay();
      return;
    }
    playTrack(featuredTracks[0], featuredTracks, featured.name);
  };

  return (
    <div className="page">
      <section className="hero" style={{ '--hero-a': featured.colors[0], '--hero-b': featured.colors[1] }}>
        <div className="hero-copy">
          <span className="eyebrow">Mix del día</span>
          <h1>Tu música no se detiene</h1>
          <p>
            Navega entre Inicio, Buscar y tu Biblioteca mientras el reproductor sigue
            sonando. Todo ocurre en el cliente: una sola carga, muchas vistas.
          </p>
          <div className="hero-actions">
            <button type="button" className="btn btn-primary" onClick={playFeatured}>
              <Icon name={featuredIsCurrent && isPlaying ? 'pause' : 'play'} size={18} />
              {featuredIsCurrent && isPlaying ? 'Pausar mix' : 'Reproducir mix'}
            </button>
            <Link to={`/playlist/${featured.id}`} className="btn btn-ghost">
              Ver playlist
            </Link>
          </div>
        </div>
        <div className="hero-art">
          <Cover item={featured} size="xl" />
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>{greetingByHour()}</h2>
          <span className="section-hint">Acceso rápido</span>
        </div>
        <div className="quick-grid">
          {playlists.map((playlist) => {
            const tracks = getPlaylistTracks(playlist);
            const active = tracks.some((track) => track.id === currentTrack?.id);
            return (
              <Link key={playlist.id} to={`/playlist/${playlist.id}`} className="quick-tile">
                <Cover item={playlist} size="xxs" />
                <span className="quick-name">{playlist.name}</span>
                <button
                  type="button"
                  className="quick-play"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    if (active) {
                      togglePlay();
                    } else {
                      playTrack(tracks[0], tracks, playlist.name);
                    }
                  }}
                  aria-label={`Reproducir ${playlist.name}`}
                >
                  <Icon name={active && isPlaying ? 'pause' : 'play'} size={16} />
                </button>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Hecho para ti</h2>
          <Link to="/biblioteca" className="section-link">
            Ver biblioteca
          </Link>
        </div>
        <div className="card-grid">
          {playlists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Tendencias ahora</h2>
          <Link to="/buscar" className="section-link">
            Explorar más
          </Link>
        </div>
        <div className="song-list">
          <SongListHeader />
          {trending.map((song) => (
            <SongRow
              key={song.id}
              song={song}
              list={trending}
              listName="Tendencias ahora"
            />
          ))}
        </div>
      </section>

      <section className="spa-note">
        <Icon name="play" size={18} />
        <div>
          <strong>Prueba la clave del caso:</strong> pulsa una canción y navega a otra
          sección. El audio sigue reproduciéndose porque <code>&lt;Player /&gt;</code> está
          fuera de <code>&lt;Routes /&gt;</code> y nunca se desmonta.
        </div>
      </section>
    </div>
  );
}
