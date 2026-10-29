import { Link, useParams } from 'react-router-dom';
import Cover from '../components/Cover';
import Icon from '../components/Icon';
import SongRow, { SongListHeader } from '../components/SongRow';
import { usePlayer } from '../context/PlayerContext';
import { getPlaylistTracks, playlists } from '../data/songs';
import { formatTime } from '../utils/format';

export default function Playlist() {
  const { id } = useParams();
  const playlist = playlists.find((item) => item.id === id);
  const { playTrack, currentTrack, isPlaying, togglePlay } = usePlayer();

  if (!playlist) {
    return (
      <div className="page">
        <div className="empty-state">
          <span className="empty-emoji">🎧</span>
          <h3>Playlist no encontrada</h3>
          <p>La playlist que buscas no existe o fue movida.</p>
          <Link to="/" className="btn btn-primary">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const tracks = getPlaylistTracks(playlist);
  const totalSeconds = tracks.reduce((sum, song) => sum + song.duration, 0);
  const isCurrent = tracks.some((song) => song.id === currentTrack?.id);

  const handlePlayAll = () => {
    if (!tracks.length) return;
    if (isCurrent) {
      togglePlay();
      return;
    }
    playTrack(tracks[0], tracks, playlist.name);
  };

  return (
    <div className="page playlist-page">
      <header
        className="playlist-header"
        style={{
          background: `linear-gradient(135deg, ${playlist.colors[0]}55, ${playlist.colors[1]}22)`,
        }}
      >
        <Cover item={playlist} size="hero" />
        <div className="playlist-header-info">
          <span className="eyebrow">Playlist</span>
          <h1>{playlist.name}</h1>
          <p>{playlist.description}</p>
          <div className="playlist-meta">
            <span className="avatar avatar-xs">AR</span>
            <span>Alejandro</span>
            <span className="dot">·</span>
            <span>{tracks.length} canciones</span>
            <span className="dot">·</span>
            <span>{formatTime(totalSeconds)}</span>
          </div>
        </div>
      </header>

      <div className="playlist-actions">
        <button type="button" className="play-btn play-btn-lg" onClick={handlePlayAll} aria-label="Reproducir playlist">
          <Icon name={isCurrent && isPlaying ? 'pause' : 'play'} size={26} />
        </button>
        <button
          type="button"
          className="icon-btn"
          onClick={() => {
            if (!tracks.length) return;
            const random = tracks[Math.floor(Math.random() * tracks.length)];
            playTrack(random, tracks, playlist.name);
          }}
          aria-label="Reproducir una canción al azar"
        >
          <Icon name="shuffle" size={22} />
        </button>
        <span className="section-hint">Reproductor persistente: cambia de página y la música sigue.</span>
      </div>

      <div className="song-list">
        <SongListHeader />
        {tracks.map((song) => (
          <SongRow
            key={song.id}
            song={song}
            list={tracks}
            listName={playlist.name}
          />
        ))}
      </div>
    </div>
  );
}
