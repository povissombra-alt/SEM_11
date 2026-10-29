# Caso Práctico B — Plataforma de Streaming de Música (SPA)

Clon didáctico de Spotify construido con **React + Vite + React Router**.
El objetivo es demostrar por qué una SPA mantiene la música sonando mientras se navega:
el reproductor vive fuera de las rutas y nunca se desmonta.

## Requisitos

- Node.js 18 o superior
- npm

## Comandos (ejecutar en tu terminal)

```powershell
cd C:\Users\Admin-ETI\Downloads\Caso_B
npm install
npm run dev
```

Luego abre `http://localhost:5173` (Vite también lo abre solo).

Otros comandos útiles:

```powershell
npm run build     # compila para producción en /dist
npm run preview   # sirve la build localmente
```

## Estructura

```
src/
├─ main.jsx                  # BrowserRouter + PlayerProvider
├─ App.jsx                   # Layout y <Routes>; <Player /> queda FUERA de las rutas
├─ index.css                 # Tema oscuro y responsive
├─ context/PlayerContext.jsx # Estado global + elemento <audio> persistente
├─ components/
│  ├─ Sidebar.jsx
│  ├─ Topbar.jsx
│  ├─ Player.jsx             # Barra inferior de reproducción
│  ├─ SongRow.jsx
│  ├─ PlaylistCard.jsx
│  ├─ Cover.jsx
│  └─ Icon.jsx
├─ data/songs.js             # Catálogo y playlists de demo
├─ utils/format.js           # Tiempo y localStorage
└─ pages/
   ├─ Home.jsx
   ├─ Search.jsx
   ├─ Library.jsx
   ├─ Playlist.jsx
   ├─ Profile.jsx
   └─ NotFound.jsx
```

## Puntos clave del caso

1. **Reproductor persistente**: `<audio>` está en `PlayerProvider` y `<Player />` en `App`
   fuera de `<Routes>`. Al cambiar de ruta solo se desmonta la página.
2. **Enrutamiento en el cliente**: React Router intercepta los enlaces; el navegador no
   pide un nuevo HTML al servidor.
3. **Estado compartido**: Context API guarda cola, pista actual, volumen, favoritos,
   aleatorio y repetición.
4. **Persistencia**: favoritos, volumen y perfil se guardan en `localStorage`.
5. **Rutas disponibles**: `/`, `/buscar`, `/biblioteca`, `/playlist/:id`, `/perfil`, `*`.
6. **Atajos**: `Espacio` play/pausa, `Shift + →` siguiente, `Shift + ←` anterior.

## Nota sobre el audio

Los `src` de las canciones apuntan a pistas instrumentales de ejemplo de
`soundhelix.com`, por lo que necesitas conexión a internet para escucharlas.
Puedes reemplazarlas por archivos propios: colócalos en `public/audio/` y cambia
`src` en `src/data/songs.js` por `'/audio/mi-cancion.mp3'`.
