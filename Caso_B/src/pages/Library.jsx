import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import PlaylistCard from '../components/PlaylistCard';
import SongRow, { SongListHeader } from '../components/SongRow';
import { usePlayer } from '../context/PlayerContext';
import { playlists, songs } from '../data/songs';

export default function Library() {
  const { favorites, playTrack, currentTrack, isPlaying, togglePlay } = usePlayer();
  const [tab, setTab] = useState('songs');

  const favoriteSongs = songs.filter((song) => favorites.includes(song.id));

  const playFavorites = () => {
    if (!favoriteSongs.length) return;
    const alreadyPlaying = favoriteSongs.some((song) => song.id === currentTrack?.id);
    if (alreadyPlaying) {
      togglePlay();
      return;
    }
    playTrack(favoriteSongs[0], favoriteSongs, 'Canciones que te gustan');
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <span className="eyebrow">Biblioteca</span>
          <h1>Tu colección</h1>
          <p className="page-subtitle">
            Guarda canciones con el corazón y vuelve a ellas cuando quieras. Tus datos se
            conservan en este navegador (localStorage).
          </p>
        </div>
        <div className="page-head-art">
          <span className="avatar avatar-lg">AR</span>
        </div>
      </div>

      <div className="tab-row" role="tablist" aria-label="Contenido de la biblioteca">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'songs'}
          className={`tab ${tab === 'songs' ? 'is-active' : ''}`}
          onClick={() => setTab('songs')}
        >
          Canciones que te gustan
          <span className="count-badge">{favoriteSongs.length}</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'playlists'}
          className={`tab ${tab === 'playlists' ? 'is-active' : ''}`}
          onClick={() => setTab('playlists')}
        >
          Playlists
          <span className="count-badge">{playlists.length}</span>
        </button>
      </div>

      {tab === 'songs' ? (
        favoriteSongs.length > 0 ? (
          <section className="section">
            <div className="library-actions">
              <button type="button" className="btn btn-primary" onClick={playFavorites}>
                <Icon name="play" size={18} />
                Reproducir favoritos
              </button>
              <span className="section-hint">{favoriteSongs.length} canciones guardadas</span>
            </div>
            <div className="song-list">
              <SongListHeader />
              {favoriteSongs.map((song) => (
                <SongRow
                  key={song.id}
                  song={song}
                  list={favoriteSongs}
                  listName="Canciones que te gustan"
                />
              ))}
            </div>
          </section>
        ) : (
          <div className="empty-state">
            <span className="empty-emoji">💜</span>
            <h3>Aún no has guardado canciones</h3>
            <p>
              Pulsa el corazón de cualquier canción y aparecerá aquí. También puedes
              empezar por las tendencias.
            </p>
            <Link to="/" className="btn btn-primary">
              Descubrir música
            </Link>
          </div>
        )
      ) : (
        <section className="section">
          <div className="card-grid">
            {playlists.map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
