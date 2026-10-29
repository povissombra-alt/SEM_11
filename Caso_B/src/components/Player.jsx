import Cover from './Cover';
import Icon from './Icon';
import { usePlayer } from '../context/PlayerContext';
import { formatTime } from '../utils/format';

export default function Player() {
  const {
    currentTrack,
    queueName,
    isPlaying,
    progress,
    duration,
    volume,
    shuffle,
    repeat,
    error,
    togglePlay,
    next,
    prev,
    seek,
    setVolume,
    isFavorite,
    toggleFavorite,
    toggleShuffle,
    cycleRepeat,
  } = usePlayer();

  const percent = duration > 0 ? Math.min(100, (progress / duration) * 100) : 0;
  const favorite = currentTrack ? isFavorite(currentTrack.id) : false;

  const repeatLabel =
    repeat === 'one' ? 'Repetir una canción' : repeat === 'all' ? 'Repetir cola' : 'Repetir desactivado';

  return (
    <footer className="player">
      <div className="player-track">
        {currentTrack ? (
          <>
            <Cover item={currentTrack} size="sm" />
            <div className="player-meta">
              <span className="player-title">{currentTrack.title}</span>
              <span className="player-artist">
                {currentTrack.artist} · {queueName}
              </span>
              {error && <span className="player-error">{error}</span>}
            </div>
            <button
              type="button"
              className={`icon-btn ${favorite ? 'is-active' : ''}`}
              onClick={() => toggleFavorite(currentTrack.id)}
              aria-label={favorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
            >
              <Icon name={favorite ? 'heart' : 'heart-outline'} size={18} />
            </button>
          </>
        ) : (
          <span className="player-empty">Selecciona una canción para empezar</span>
        )}
      </div>

      <div className="player-center">
        <div className="player-controls">
          <button
            type="button"
            className={`icon-btn ${shuffle ? 'is-active' : ''}`}
            onClick={toggleShuffle}
            aria-label="Aleatorio"
            aria-pressed={shuffle}
          >
            <Icon name="shuffle" size={18} />
          </button>

          <button type="button" className="icon-btn" onClick={prev} aria-label="Anterior">
            <Icon name="prev" size={20} />
          </button>

          <button
            type="button"
            className="play-btn"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
          >
            <Icon name={isPlaying ? 'pause' : 'play'} size={22} />
          </button>

          <button type="button" className="icon-btn" onClick={() => next()} aria-label="Siguiente">
            <Icon name="next" size={20} />
          </button>

          <button
            type="button"
            className={`icon-btn repeat-btn ${repeat !== 'off' ? 'is-active' : ''}`}
            onClick={cycleRepeat}
            aria-label={repeatLabel}
            title={repeatLabel}
          >
            <Icon name="repeat" size={18} />
            {repeat === 'one' && <span className="repeat-one">1</span>}
          </button>
        </div>

        <div className="player-timeline">
          <span className="time">{formatTime(progress)}</span>
          <input
            type="range"
            className="range"
            min="0"
            max="100"
            step="0.1"
            value={percent}
            onChange={(event) => seek(Number(event.target.value))}
            style={{ '--value': `${percent}%` }}
            aria-label="Progreso de la canción"
            disabled={!currentTrack}
          />
          <span className="time">{duration > 0 ? formatTime(duration) : '--:--'}</span>
        </div>
      </div>

      <div className="player-right">
        <Icon name="volume" size={18} />
        <input
          type="range"
          className="range range-sm"
          min="0"
          max="100"
          value={Math.round(volume * 100)}
          onChange={(event) => setVolume(Number(event.target.value) / 100)}
          style={{ '--value': `${Math.round(volume * 100)}%` }}
          aria-label="Volumen"
        />
        <span className="percent-label">{Math.round(volume * 100)}%</span>
      </div>
    </footer>
  );
}
