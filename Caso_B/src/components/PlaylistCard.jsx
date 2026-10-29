import { Link } from 'react-router-dom';
import Cover from './Cover';
import Icon from './Icon';
import { usePlayer } from '../context/PlayerContext';
import { getPlaylistTracks } from '../data/songs';

export default function PlaylistCard({ playlist }) {
  const { playTrack, currentTrack, isPlaying, togglePlay } = usePlayer();
  const tracks = getPlaylistTracks(playlist);
  const isCurrent = tracks.some((track) => track.id === currentTrack?.id);

  const handlePlay = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!tracks.length) return;
    if (isCurrent) {
      togglePlay();
    } else {
      playTrack(tracks[0], tracks, playlist.name);
    }
  };

  return (
    <Link to={`/playlist/${playlist.id}`} className="card">
      <div className="card-cover">
        <Cover item={playlist} size="lg" />
        <button
          type="button"
          className="card-play"
          onClick={handlePlay}
          aria-label={isCurrent && isPlaying ? `Pausar ${playlist.name}` : `Reproducir ${playlist.name}`}
        >
          <Icon name={isCurrent && isPlaying ? 'pause' : 'play'} size={20} />
        </button>
      </div>
      <h3 className="card-title">{playlist.name}</h3>
      <p className="card-text">{playlist.description}</p>
    </Link>
  );
}
