import { useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Player from './components/Player';
import Home from './pages/Home';
import Search from './pages/Search';
import Library from './pages/Library';
import Playlist from './pages/Playlist';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

export default function App() {
  const location = useLocation();
  const contentRef = useRef(null);

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 });
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <div className="app-body">
        <Sidebar />
        <div className="app-main">
          <Topbar />
          <main className="app-content" ref={contentRef}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/buscar" element={<Search />} />
              <Route path="/biblioteca" element={<Library />} />
              <Route path="/playlist/:id" element={<Playlist />} />
              <Route path="/perfil" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>

      {/*
        Player está FUERA de <Routes>, por lo que nunca se desmonta
        al navegar entre páginas. Esa es la diferencia clave de la SPA.
      */}
      <Player />
    </div>
  );
}
