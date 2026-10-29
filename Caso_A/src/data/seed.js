/**
 * Datos simulados de la demo.
 * Se generan de forma determinista (misma semilla => mismos datos en cada carga)
 * para que las gráficas y las cifras sean estables.
 */

const pad2 = (n) => String(n).padStart(2, '0');

const isoLocal = (date) =>
  `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}T${pad2(
    date.getHours(),
  )}:${pad2(date.getMinutes())}`;

function mulberry32(seed) {
  return function random() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const random = mulberry32(20261029);
const pick = (list) => list[Math.floor(random() * list.length)];
const between = (min, max) => Math.round((min + random() * (max - min)) * 100) / 100;

export const CATEGORIES = {
  Ingresos: { color: '#34d399' },
  Supermercado: { color: '#4ade80' },
  Restaurantes: { color: '#fbbf24' },
  Transporte: { color: '#60a5fa' },
  Vivienda: { color: '#a78bfa' },
  Ocio: { color: '#f472b6' },
  Salud: { color: '#22d3ee' },
  Suscripciones: { color: '#fb7185' },
  Compras: { color: '#f97316' },
  Educación: { color: '#818cf8' },
  Transferencias: { color: '#94a3b8' },
};

const MERCHANTS = {
  Supermercado: ['Mercadona', 'Carrefour', 'Lidl', 'Alcampo', 'Consum'],
  Restaurantes: [
    'Bar El Rincón',
    'Sushi Go',
    'Café Central',
    'Pizzería Napoli',
    'La Tagliatella',
  ],
  Transporte: ['Metro de Madrid', 'Uber', 'Repsol', 'Renfe', 'Cabify'],
  Vivienda: ['Alquiler de vivienda', 'Iberdrola', 'Aguas de Madrid', 'Comunidad de vecinos'],
  Ocio: ['Cines Yelmo', 'Steam', 'Concierto', 'Museo Reina Sofía', 'Bolera'],
  Salud: ['Farmacia', 'Clínica dental', 'Óptica'],
  Suscripciones: ['Netflix', 'Spotify Premium', 'iCloud+', 'Notion'],
  Compras: ['Zara', 'Decathlon', 'Amazon', 'IKEA'],
  Educación: ['Curso online', 'Librería'],
};

let uid = 0;
const movements = [];
const now = new Date();

for (let back = 12; back >= 0; back -= 1) {
  const base = new Date(now.getFullYear(), now.getMonth() - back, 1);
  const year = base.getFullYear();
  const month = base.getMonth();

  const add = (
    day,
    hour,
    description,
    category,
    type,
    amount,
    method,
    status = 'Completado',
  ) => {
    const date = new Date(year, month, day, hour, Math.floor(random() * 60));
    if (date.getTime() > now.getTime()) return;
    uid += 1;
    movements.push({
      id: `mv-${year}${pad2(month + 1)}-${pad2(uid)}`,
      date: isoLocal(date),
      description,
      category,
      type,
      amount: Math.round(amount * 100) / 100,
      method,
      status,
    });
  };

  // Ingresos
  add(1, 9, 'Nómina mensual', 'Ingresos', 'ingreso', 2650, 'Transferencia');
  if (random() > 0.55) {
    add(12, 17, 'Proyecto freelance', 'Ingresos', 'ingreso', between(180, 520), 'Transferencia');
  }
  if (random() > 0.78) {
    add(20, 12, 'Devolución de Hacienda', 'Ingresos', 'ingreso', between(60, 180), 'Transferencia');
  }

  // Vivienda
  add(3, 8, 'Alquiler de vivienda', 'Vivienda', 'gasto', 820, 'Transferencia');
  add(5, 10, 'Factura de electricidad', 'Vivienda', 'gasto', between(48, 92), 'Domiciliación');
  add(6, 10, 'Fibra y móvil', 'Vivienda', 'gasto', 39.9, 'Domiciliación');

  // Suscripciones
  add(4, 7, 'Netflix', 'Suscripciones', 'gasto', 12.99, 'Tarjeta');
  add(7, 7, 'Spotify Premium', 'Suscripciones', 'gasto', 10.99, 'Tarjeta');
  add(9, 7, 'iCloud+ 200 GB', 'Suscripciones', 'gasto', 2.99, 'Tarjeta');

  // Supermercado
  [2, 9, 16, 23, 27].forEach((day) => {
    add(day, 19, pick(MERCHANTS.Supermercado), 'Supermercado', 'gasto', between(24, 96), 'Tarjeta');
  });

  // Restaurantes
  [5, 11, 18, 24].forEach((day) => {
    add(day, 21, pick(MERCHANTS.Restaurantes), 'Restaurantes', 'gasto', between(12, 48), 'Tarjeta');
  });

  // Transporte
  [4, 10, 17, 25].forEach((day) => {
    add(day, 8, pick(MERCHANTS.Transporte), 'Transporte', 'gasto', between(8, 38), 'Bizum');
  });

  // Ocio
  add(14, 20, pick(MERCHANTS.Ocio), 'Ocio', 'gasto', between(12, 55), 'Tarjeta');
  if (random() > 0.5) {
    add(22, 20, pick(MERCHANTS.Ocio), 'Ocio', 'gasto', between(10, 40), 'Tarjeta');
  }

  // Compras y salud
  add(15, 18, pick(MERCHANTS.Compras), 'Compras', 'gasto', between(20, 130), 'Tarjeta');
  if (random() > 0.6) {
    add(19, 11, pick(MERCHANTS.Salud), 'Salud', 'gasto', between(9, 65), 'Tarjeta');
  }
  if (random() > 0.82) {
    add(26, 17, pick(MERCHANTS.Educación), 'Educación', 'gasto', between(15, 60), 'Tarjeta');
  }
}

movements.sort((a, b) => (a.date < b.date ? 1 : -1));

export const SEED_MOVEMENTS = movements;

export const DEFAULT_USER = {
  name: 'Lucía Fernández',
  email: 'lucia.fernandez@fintra.app',
  phone: '+34 612 345 678',
  city: 'Madrid, España',
  role: 'Plan Premium',
  memberSince: '2021-03-14',
  goal: 1500,
  preferences: {
    notifications: true,
    alerts: true,
    weekly: false,
  },
};

/** Movimientos que la simulación "en vivo" va generando cada pocos segundos. */
export const LIVE_POOL = [
  {
    description: 'Café con leche',
    category: 'Restaurantes',
    method: 'Tarjeta',
    min: 2.2,
    max: 4.5,
  },
  {
    description: 'Supermercado express',
    category: 'Supermercado',
    method: 'Tarjeta',
    min: 8,
    max: 34,
  },
  { description: 'Taxi urbano', category: 'Transporte', method: 'Bizum', min: 6, max: 18 },
  {
    description: 'Compra online',
    category: 'Compras',
    method: 'Tarjeta',
    min: 15,
    max: 80,
  },
  {
    description: 'Suscripción mensual',
    category: 'Suscripciones',
    method: 'Domiciliación',
    min: 4.99,
    max: 14.99,
  },
  { description: 'Entradas de cine', category: 'Ocio', method: 'Tarjeta', min: 9, max: 24 },
];
