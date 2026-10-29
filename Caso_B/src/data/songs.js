// Catálogo de demostración.
// Los audios son pistas instrumentales de SoundHelix usadas como ejemplo público.
// Puedes reemplazar "src" por archivos locales en /public/audio.
export const songs = [
  {
    id: 's01',
    title: 'Noches de Neón',
    artist: 'Lúmina',
    album: 'Ciudad Eléctrica',
    genre: 'Synthwave',
    emoji: '🌆',
    colors: ['#7c3aed', '#06b6d4'],
    duration: 372,
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: 's02',
    title: 'Café y Lluvia',
    artist: 'Nube Baja',
    album: 'Rutina Suave',
    genre: 'Lo-Fi',
    emoji: '☕',
    colors: ['#f59e0b', '#db2777'],
    duration: 275,
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: 's03',
    title: 'Corazón de Cristal',
    artist: 'Marina Sol',
    album: 'Reflejos',
    genre: 'Pop',
    emoji: '💎',
    colors: ['#ec4899', '#8b5cf6'],
    duration: 208,
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
  {
    id: 's04',
    title: 'Ruta 66',
    artist: 'Los Fugaces',
    album: 'Kilómetros',
    genre: 'Rock',
    emoji: '🛣️',
    colors: ['#dc2626', '#f97316'],
    duration: 242,
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  },
  {
    id: 's05',
    title: 'Pulso Digital',
    artist: 'Kairo',
    album: 'Circuito Abierto',
    genre: 'Electrónica',
    emoji: '🛰️',
    colors: ['#0ea5e9', '#22d3ee'],
    duration: 310,
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
  },
  {
    id: 's06',
    title: 'Marea Baja',
    artist: 'Arena Norte',
    album: 'Costa Serena',
    genre: 'Chill',
    emoji: '🌊',
    colors: ['#14b8a6', '#0ea5e9'],
    duration: 236,
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
  },
  {
    id: 's07',
    title: 'Cartas Sin Enviar',
    artist: 'Vera Índigo',
    album: 'Buzón Vacío',
    genre: 'Indie',
    emoji: '✉️',
    colors: ['#8b5cf6', '#6366f1'],
    duration: 261,
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
  },
  {
    id: 's08',
    title: 'Medianoche Azul',
    artist: 'Trío Cardamomo',
    album: 'Sesión Nocturna',
    genre: 'Jazz',
    emoji: '🌙',
    colors: ['#1e3a8a', '#7c3aed'],
    duration: 344,
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
  },
  {
    id: 's09',
    title: 'Última Órbita',
    artist: 'Neón Perdido',
    album: 'Gravedad',
    genre: 'Synthwave',
    emoji: '🪐',
    colors: ['#a855f7', '#ec4899'],
    duration: 365,
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
  },
  {
    id: 's10',
    title: 'Verano Infinito',
    artist: 'Danna Ruiz',
    album: 'Postal de Julio',
    genre: 'Pop',
    emoji: '🌴',
    colors: ['#f43f5e', '#f59e0b'],
    duration: 198,
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
  },
  {
    id: 's11',
    title: 'Té de Jazmín',
    artist: 'Nube Baja',
    album: 'Rutina Suave',
    genre: 'Lo-Fi',
    emoji: '🍵',
    colors: ['#84cc16', '#14b8a6'],
    duration: 178,
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
  },
  {
    id: 's12',
    title: 'Gravedad Cero',
    artist: 'Kairo',
    album: 'Circuito Abierto',
    genre: 'Electrónica',
    emoji: '⚡',
    colors: ['#6366f1', '#22d3ee'],
    duration: 287,
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
  },
];

export const playlists = [
  {
    id: 'p1',
    name: 'Foco Total',
    description: 'Lo-fi y chill para trabajar sin distracciones.',
    emoji: '🎯',
    colors: ['#84cc16', '#0ea5e9'],
    trackIds: ['s02', 's11', 's06', 's08'],
  },
  {
    id: 'p2',
    name: 'Éxitos del Momento',
    description: 'Pop y electrónica que no dejan de sonar.',
    emoji: '🔥',
    colors: ['#f43f5e', '#f59e0b'],
    trackIds: ['s03', 's10', 's05', 's12'],
  },
  {
    id: 'p3',
    name: 'Noche de Neón',
    description: 'Synthwave para conducir sin destino.',
    emoji: '🌃',
    colors: ['#a855f7', '#06b6d4'],
    trackIds: ['s01', 's09', 's05', 's07'],
  },
  {
    id: 'p4',
    name: 'Café de Domingo',
    description: 'Jazz, indie y calma para empezar el día.',
    emoji: '☕',
    colors: ['#1e3a8a', '#14b8a6'],
    trackIds: ['s08', 's02', 's07', 's06'],
  },
];

export const genres = [
  { name: 'Synthwave', emoji: '🌆', colors: ['#7c3aed', '#06b6d4'] },
  { name: 'Lo-Fi', emoji: '☕', colors: ['#f59e0b', '#db2777'] },
  { name: 'Pop', emoji: '💎', colors: ['#ec4899', '#8b5cf6'] },
  { name: 'Rock', emoji: '🛣️', colors: ['#dc2626', '#f97316'] },
  { name: 'Electrónica', emoji: '🛰️', colors: ['#0ea5e9', '#22d3ee'] },
  { name: 'Chill', emoji: '🌊', colors: ['#14b8a6', '#0ea5e9'] },
  { name: 'Indie', emoji: '✉️', colors: ['#8b5cf6', '#6366f1'] },
  { name: 'Jazz', emoji: '🌙', colors: ['#1e3a8a', '#7c3aed'] },
];

export function getPlaylistTracks(playlist) {
  if (!playlist) return [];
  return playlist.trackIds
    .map((id) => songs.find((song) => song.id === id))
    .filter(Boolean);
}

export function getSongById(id) {
  return songs.find((song) => song.id === id) ?? null;
}
