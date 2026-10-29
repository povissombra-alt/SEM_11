import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Icon from '../components/Icon';
import SongRow, { SongListHeader } from '../components/SongRow';
import PlaylistCard from '../components/PlaylistCard';
import { genres, playlists, songs } from '../data/songs';

export default function Search() {
  const [params, setParams] = useSearchParams();
  const queryFromUrl = params.get('q') ?? '';
  const [text, setText] = useState(queryFromUrl);
  const [genre, setGenre] = useState(null);

  useEffect(() => {
    setText(queryFromUrl);
  }, [queryFromUrl]);

  const normalized = text.trim().toLowerCase();

  const results = useMemo(() => {
    return songs.filter((song) => {
      const matchesGenre = !genre || song.genre === genre;
      if (!normalized) return matchesGenre;
      const haystack = `${song.title} ${song.artist} ${song.album} ${song.genre}`.toLowerCase();
      return matchesGenre && haystack.includes(normalized);
    });
  }, [normalized, genre]);

  const playlistResults = useMemo(() => {
    if (!normalized) return [];
    return playlists.filter((playlist) =>
      `${playlist.name} ${playlist.description}`.toLowerCase().includes(normalized)
    );
  }, [normalized]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const value = text.trim();
    setParams(value ? { q: value } : {});
  };

  const clearFilters = () => {
    setText('');
    setGenre(null);
    setParams({});
  };

  const isFiltering = Boolean(normalized || genre);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <span className="eyebrow">Buscar</span>
          <h1>Encuentra tu próxima canción</h1>
        </div>
      </div>

      <form className="search-inline" onSubmit={handleSubmit} role="search">
        <Icon name="search" size={20} />
        <input
          type="search"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Canciones, artistas, álbumes o géneros"
          aria-label="Buscar en el catálogo"
          autoFocus
        />
        {text && (
          <button
            type="button"
            className="icon-btn"
            onClick={() => {
              setText('');
              setParams({});
            }}
            aria-label="Limpiar búsqueda"
          >
            <Icon name="close" size={18} />
          </button>
        )}
        <button type="submit" className="btn btn-primary">
          Buscar
        </button>
      </form>

      <div className="chip-row">
        <button
          type="button"
          className={`chip ${!genre ? 'is-active' : ''}`}
          onClick={() => setGenre(null)}
        >
          Todos
        </button>
        {genres.map((item) => (
          <button
            key={item.name}
            type="button"
            className={`chip ${genre === item.name ? 'is-active' : ''}`}
            onClick={() => setGenre(genre === item.name ? null : item.name)}
          >
            {item.name}
          </button>
        ))}
        {isFiltering && (
          <button type="button" className="chip chip-clear" onClick={clearFilters}>
            Limpiar filtros
          </button>
        )}
      </div>

      {isFiltering ? (
        <>
          <section className="section">
            <div className="section-head">
              <h2>
                Canciones
                <span className="count-badge">{results.length}</span>
              </h2>
              {(normalized || genre) && (
                <span className="section-hint">
                  {normalized ? `Resultados para “${text.trim()}”` : `Género: ${genre}`}
                </span>
              )}
            </div>

            {results.length > 0 ? (
              <div className="song-list">
                <SongListHeader />
                {results.map((song) => (
                  <SongRow
                    key={song.id}
                    song={song}
                    list={results}
                    listName={genre ? `Búsqueda · ${genre}` : 'Resultados de búsqueda'}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <span className="empty-emoji">🔍</span>
                <h3>Sin resultados</h3>
                <p>Prueba con otro título, artista o género.</p>
              </div>
            )}
          </section>

          {playlistResults.length > 0 && (
            <section className="section">
              <div className="section-head">
                <h2>Playlists encontradas</h2>
              </div>
              <div className="card-grid">
                {playlistResults.map((playlist) => (
                  <PlaylistCard key={playlist.id} playlist={playlist} />
                ))}
              </div>
            </section>
          )}
        </>
      ) : (
        <section className="section">
          <div className="section-head">
            <h2>Explora por género</h2>
            <span className="section-hint">Toca para filtrar</span>
          </div>
          <div className="genre-grid">
            {genres.map((item) => (
              <button
                key={item.name}
                type="button"
                className="genre-tile"
                style={{
                  background: `linear-gradient(135deg, ${item.colors[0]}, ${item.colors[1]})`,
                }}
                onClick={() => setGenre(item.name)}
              >
                <span className="genre-name">{item.name}</span>
                <span className="genre-emoji">{item.emoji}</span>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
