import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { songs } from '../data/songs';
import { readLocal, writeLocal } from '../utils/format';

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const audioRef = useRef(null);

  const [queue, setQueue] = useState(songs);
  const [queueName, setQueueName] = useState('Tendencias ahora');
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(() => readLocal('cb-volume', 0.8));
  const [favorites, setFavorites] = useState(() => readLocal('cb-favorites', []));
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState('off'); // 'off' | 'all' | 'one'
  const [error, setError] = useState(null);

  const currentTrack = queue[trackIndex] ?? null;

  // Persistencia sencilla de preferencias
  useEffect(() => writeLocal('cb-volume', volume), [volume]);
  useEffect(() => writeLocal('cb-favorites', favorites), [favorites]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Al cambiar de pista se resetea el progreso y se reproduce si corresponde.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    setProgress(0);
    setDuration(0);
    setError(null);

    if (isPlaying) {
      const attempt = audio.play();
      if (attempt && typeof attempt.catch === 'function') {
        attempt.catch(() => setIsPlaying(false));
      }
    } else {
      audio.pause();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack?.id, isPlaying]);

  const playTrack = useCallback(
    (track, list, listName) => {
      if (!track) return;
      const nextQueue = list && list.length ? list : queue;
      const index = nextQueue.findIndex((item) => item.id === track.id);
      setQueue(nextQueue);
      if (listName) setQueueName(listName);
      setTrackIndex(index >= 0 ? index : 0);
      setIsPlaying(true);
    },
    [queue]
  );

  const togglePlay = useCallback(() => {
    if (!currentTrack) return;
    setIsPlaying((playing) => !playing);
  }, [currentTrack]);

  const next = useCallback(
    (fromEnded = false) => {
      if (!queue.length) return;

      if (fromEnded && repeat === 'one') {
        const audio = audioRef.current;
        if (audio) {
          audio.currentTime = 0;
          audio.play().catch(() => setIsPlaying(false));
        }
        setProgress(0);
        return;
      }

      let nextIndex;
      if (shuffle && queue.length > 1) {
        do {
          nextIndex = Math.floor(Math.random() * queue.length);
        } while (nextIndex === trackIndex);
      } else if (trackIndex < queue.length - 1) {
        nextIndex = trackIndex + 1;
      } else if (repeat === 'all') {
        nextIndex = 0;
      } else {
        setIsPlaying(false);
        return;
      }

      setTrackIndex(nextIndex);
      setIsPlaying(true);
    },
    [queue.length, trackIndex, shuffle, repeat]
  );

  const prev = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !queue.length) return;

    // Si ya avanzó la canción, reinicia; si no, va a la anterior.
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      setProgress(0);
      return;
    }

    const prevIndex = trackIndex > 0 ? trackIndex - 1 : queue.length - 1;
    setTrackIndex(prevIndex);
    setIsPlaying(true);
  }, [queue.length, trackIndex]);

  const seek = useCallback(
    (percent) => {
      const audio = audioRef.current;
      if (!audio || !Number.isFinite(duration) || duration <= 0) return;
      const time = (percent / 100) * duration;
      audio.currentTime = time;
      setProgress(time);
    },
    [duration]
  );

  const setVolume = useCallback((value) => {
    const clamped = Math.min(1, Math.max(0, value));
    setVolumeState(clamped);
    if (audioRef.current) audioRef.current.volume = clamped;
  }, []);

  const toggleFavorite = useCallback((id) => {
    setFavorites((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  }, []);

  const isFavorite = useCallback((id) => favorites.includes(id), [favorites]);

  const toggleShuffle = useCallback(() => setShuffle((value) => !value), []);

  const cycleRepeat = useCallback(() => {
    setRepeat((mode) => (mode === 'off' ? 'all' : mode === 'all' ? 'one' : 'off'));
  }, []);

  // Atajos de teclado: Espacio (play/pausa), Shift + flechas (pista)
  useEffect(() => {
    const onKeyDown = (event) => {
      const tag = event.target.tagName;
      if (
        ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(tag) ||
        event.target.isContentEditable
      ) {
        return;
      }
      if (event.code === 'Space') {
        event.preventDefault();
        togglePlay();
      }
      if (event.shiftKey && event.code === 'ArrowRight') {
        event.preventDefault();
        next();
      }
      if (event.shiftKey && event.code === 'ArrowLeft') {
        event.preventDefault();
        prev();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [togglePlay, next, prev]);

  const value = useMemo(
    () => ({
      currentTrack,
      queue,
      queueName,
      isPlaying,
      progress,
      duration,
      volume,
      favorites,
      shuffle,
      repeat,
      error,
      playTrack,
      togglePlay,
      next,
      prev,
      seek,
      setVolume,
      toggleFavorite,
      isFavorite,
      toggleShuffle,
      cycleRepeat,
    }),
    [
      currentTrack,
      queue,
      queueName,
      isPlaying,
      progress,
      duration,
      volume,
      favorites,
      shuffle,
      repeat,
      error,
      playTrack,
      togglePlay,
      next,
      prev,
      seek,
      setVolume,
      toggleFavorite,
      isFavorite,
      toggleShuffle,
      cycleRepeat,
    ]
  );

  return (
    <PlayerContext.Provider value={value}>
      {children}
      {/*
        El elemento <audio> vive aquí, por encima de las rutas.
        Por eso cambiar de página nunca corta la reproducción.
      */}
      <audio
        ref={audioRef}
        src={currentTrack?.src}
        preload="metadata"
        onTimeUpdate={(event) => setProgress(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) =>
          setDuration(
            Number.isFinite(event.currentTarget.duration) ? event.currentTarget.duration : 0
          )
        }
        onEnded={() => next(true)}
        onError={() => {
          setError('No se pudo cargar el audio de esta canción.');
          setIsPlaying(false);
        }}
      />
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer debe usarse dentro de <PlayerProvider>');
  }
  return context;
}
