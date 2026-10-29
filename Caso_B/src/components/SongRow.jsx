import Cover from './Cover';
import Icon from './Icon';
import { usePlayer } from '../context/PlayerContext';
import { formatTime } from '../utils/format';

export default function SongRow({
  song,
  list,
  listName,
  showAlbum = true,
  showGenre = true,
}) {
  const { currentTrack, isPlaying, playTrack, togglePlay, isFavorite, toggleFavorite } =
    usePlayer();
  const isCurrent = currentTrack?.id === song.id;
  const favorite = isFavorite(song.id);

  const handlePlay = () => {
    if (isCurrent) {
      togglePlay();
    } else {
      playTrack(song, list, listName);
    }
  };

  return (
    <div className={`song-row ${isCurrent ? 'is-current' : ''}`}>
      <button
        type="button"
        className="row-play"
        onClick={handlePlay}
        aria-label={isCurrent && isPlaying ? `Pausar ${song.title}` : `Reproducir ${song.title}`}
      >
        {isCurrent && isPlaying ? (
          <Icon name="pause" size={14} />
        ) : (
          <Icon name="play" size={14} />
        )}
      </button>

      <div className="row-song">
        <Cover item={song} size="xs" />
        <div className="row-info">
          <span className="row-title">{song.title}</span>
          <span className="row-artist">{song.artist}</span>
        </div>
      </div>

      {showAlbum && <span className="row-album">{song.album}</span>}
      {showGenre && <span className="row-genre">{song.genre}</span>}

      <span className="row-duration">{formatTime(song.duration)}</span>

      <button
        type="button"
        className={`icon-btn row-fav ${favorite ? 'is-active' : ''}`}
        onClick={() => toggleFavorite(song.id)}
        aria-label={favorite ? `Quitar ${song.title} de favoritos` : `Guardar ${song.title} en favoritos`}
      >
        <Icon name={favorite ? 'heart' : 'heart-outline'} size={17} />
      </button>
    </div>
  );
}

export function SongListHeader({ showAlbum = true, showGenre = true }) {
  return (
    <div className="song-list-header">
      <span className="row-play">#</span>
      <span>Título</span>
      {showAlbum && <span>Álbum</span>}
      {showGenre && <span>Género</span>}
      <span className="row-duration">
        <Icon name="clock" size={15} />
      </span>
      <span />
    </div>
  );
}
