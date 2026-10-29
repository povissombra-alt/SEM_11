const now = new Date();
const pad = (value) => String(value).padStart(2, '0');

const isoDate = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

/** Devuelve una fecha del mes actual, sin superar el día de hoy. */
const thisMonth = (day) => {
  const safeDay = Math.min(day, now.getDate());
  return isoDate(new Date(now.getFullYear(), now.getMonth(), safeDay));
};

export const TODAY = isoDate(now);

export const CATEGORIES = [
  { name: 'Comida', icon: 'food', color: '#34d399', budget: 350 },
  { name: 'Transporte', icon: 'car', color: '#60a5fa', budget: 180 },
  { name: 'Vivienda', icon: 'home', color: '#a78bfa', budget: 1000 },
  { name: 'Servicios', icon: 'zap', color: '#fbbf24', budget: 180 },
  { name: 'Compras', icon: 'bag', color: '#f472b6', budget: 250 },
  { name: 'Entretenimiento', icon: 'play', color: '#22d3ee', budget: 150 },
  { name: 'Salud', icon: 'heart', color: '#fb7185', budget: 100 },
  { name: 'Educación', icon: 'book', color: '#c084fc', budget: 120 },
  { name: 'Ahorro', icon: 'piggy', color: '#5eead4', budget: 400 },
  { name: 'Ingresos', icon: 'banknote', color: '#34d399', budget: 0 },
  { name: 'Otros', icon: 'sparkles', color: '#94a3b8', budget: 0 },
];

export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((category) => [category.name, category]),
);

export const initialTransactions = [
  {
    id: 'tx-01',
    date: thisMonth(28),
    description: 'Compra semanal',
    merchant: 'Mercadona',
    category: 'Comida',
    amount: -64.35,
    method: 'Tarjeta •••• 4821',
    status: 'Completado',
  },
  {
    id: 'tx-02',
    date: thisMonth(27),
    description: 'Suscripción mensual',
    merchant: 'Netflix',
    category: 'Entretenimiento',
    amount: -12.99,
    method: 'Tarjeta •••• 4821',
    status: 'Completado',
  },
  {
    id: 'tx-03',
    date: thisMonth(26),
    description: 'Abono transporte',
    merchant: 'Metro y bus',
    category: 'Transporte',
    amount: -35,
    method: 'Tarjeta •••• 4821',
    status: 'Completado',
  },
  {
    id: 'tx-04',
    date: thisMonth(25),
    description: 'Café con Laura',
    merchant: 'Café Central',
    category: 'Comida',
    amount: -4.8,
    method: 'Tarjeta •••• 4821',
    status: 'Completado',
  },
  {
    id: 'tx-05',
    date: thisMonth(23),
    description: 'Renovación de armario',
    merchant: 'Zara',
    category: 'Compras',
    amount: -79.9,
    method: 'Tarjeta •••• 4821',
    status: 'Completado',
  },
  {
    id: 'tx-06',
    date: thisMonth(21),
    description: 'Medicamentos',
    merchant: 'Farmacia',
    category: 'Salud',
    amount: -18.4,
    method: 'Tarjeta •••• 4821',
    status: 'Completado',
  },
  {
    id: 'tx-07',
    date: thisMonth(20),
    description: 'Curso de diseño UX',
    merchant: 'Domestika',
    category: 'Educación',
    amount: -49.99,
    method: 'Tarjeta •••• 4821',
    status: 'Completado',
  },
  {
    id: 'tx-08',
    date: thisMonth(19),
    description: 'Depósito de gasolina',
    merchant: 'Repsol',
    category: 'Transporte',
    amount: -52.1,
    method: 'Tarjeta •••• 4821',
    status: 'Completado',
  },
  {
    id: 'tx-09',
    date: thisMonth(18),
    description: 'Cena con amigos',
    merchant: 'La Buena Vida',
    category: 'Comida',
    amount: -52,
    method: 'Tarjeta •••• 4821',
    status: 'Completado',
  },
  {
    id: 'tx-10',
    date: thisMonth(16),
    description: 'Compra semanal',
    merchant: 'Lidl',
    category: 'Comida',
    amount: -87.5,
    method: 'Tarjeta •••• 4821',
    status: 'Completado',
  },
  {
    id: 'tx-11',
    date: thisMonth(15),
    description: 'Proyecto freelance',
    merchant: 'Estudio Norte',
    category: 'Ingresos',
    amount: 850,
    method: 'Transferencia',
    status: 'Completado',
  },
  {
    id: 'tx-12',
    date: thisMonth(12),
    description: 'Suscripción mensual',
    merchant: 'Spotify',
    category: 'Entretenimiento',
    amount: -10.99,
    method: 'Tarjeta •••• 4821',
    status: 'Completado',
  },
  {
    id: 'tx-13',
    date: thisMonth(10),
    description: 'Pedido online',
    merchant: 'Amazon',
    category: 'Compras',
    amount: -46.75,
    method: 'Tarjeta •••• 4821',
    status: 'Completado',
  },
  {
    id: 'tx-14',
    date: thisMonth(8),
    description: 'Regalo de cumpleaños',
    merchant: 'El Corte Inglés',
    category: 'Compras',
    amount: -85,
    method: 'Tarjeta •••• 4821',
    status: 'Completado',
  },
  {
    id: 'tx-15',
    date: thisMonth(6),
    description: 'Aporte automático',
    merchant: 'Transferencia a ahorro',
    category: 'Ahorro',
    amount: -400,
    method: 'Cuenta de ahorro',
    status: 'Completado',
  },
  {
    id: 'tx-16',
    date: thisMonth(5),
    description: 'Cuota mensual',
    merchant: 'Gimnasio Fit',
    category: 'Salud',
    amount: -29.99,
    method: 'Tarjeta •••• 4821',
    status: 'Completado',
  },
  {
    id: 'tx-17',
    date: thisMonth(4),
    description: 'Luz y gas',
    merchant: 'Iberdrola',
    category: 'Servicios',
    amount: -74.2,
    method: 'Cuenta corriente',
    status: 'Completado',
  },
  {
    id: 'tx-18',
    date: thisMonth(3),
    description: 'Internet fibra',
    merchant: 'Movistar',
    category: 'Servicios',
    amount: -39.99,
    method: 'Cuenta corriente',
    status: 'Completado',
  },
  {
    id: 'tx-19',
    date: thisMonth(2),
    description: 'Alquiler de octubre',
    merchant: 'Alquiler apartamento',
    category: 'Vivienda',
    amount: -950,
    method: 'Cuenta corriente',
    status: 'Completado',
  },
  {
    id: 'tx-20',
    date: thisMonth(2),
    description: 'Seguro del coche',
    merchant: 'Mutua Madrileña',
    category: 'Transporte',
    amount: -68,
    method: 'Cuenta corriente',
    status: 'Completado',
  },
  {
    id: 'tx-21',
    date: thisMonth(1),
    description: 'Nómina de octubre',
    merchant: 'Atlas Digital',
    category: 'Ingresos',
    amount: 3200,
    method: 'Transferencia',
    status: 'Completado',
  },
  {
    id: 'tx-22',
    date: thisMonth(29),
    description: 'Escapada de fin de semana',
    merchant: 'Airbnb',
    category: 'Entretenimiento',
    amount: -320,
    method: 'Tarjeta •••• 4821',
    status: 'Completado',
  },
  {
    id: 'tx-23',
    date: thisMonth(24),
    description: 'Panadería',
    merchant: 'Pan de ayer',
    category: 'Comida',
    amount: -12.6,
    method: 'Efectivo',
    status: 'Completado',
  },
];

export const initialGoals = [
  {
    id: 'goal-01',
    name: 'Viaje a Japón',
    description: 'Dos semanas en primavera',
    target: 4500,
    saved: 2875,
    deadline: '2027-04-15',
    icon: 'plane',
    color: '#34d399',
    gradient: 'linear-gradient(135deg, #34d399, #0ea5e9)',
  },
  {
    id: 'goal-02',
    name: 'Fondo de emergencia',
    description: 'Seis meses de tranquilidad',
    target: 9000,
    saved: 5400,
    deadline: '2027-06-30',
    icon: 'shield',
    color: '#60a5fa',
    gradient: 'linear-gradient(135deg, #60a5fa, #8b5cf6)',
  },
  {
    id: 'goal-03',
    name: 'Nuevo MacBook',
    description: 'Para el siguiente proyecto',
    target: 2200,
    saved: 1100,
    deadline: '2026-12-20',
    icon: 'laptop',
    color: '#fbbf24',
    gradient: 'linear-gradient(135deg, #fbbf24, #f97316)',
  },
];

export const initialProfile = {
  name: 'Valentina Ríos',
  email: 'valentina.rios@fintra.app',
  phone: '+34 612 345 678',
  location: 'Madrid, España',
  role: 'Product Designer',
  bio: 'Diseñadora de producto y entusiasta de las finanzas personales. Construyendo un futuro con más libertad y menos ruido.',
  memberSince: 'marzo 2024',
};

export const initialSettings = {
  currency: 'EUR',
  notifications: true,
  weeklySummary: true,
  budgetAlerts: true,
  hideBalances: false,
  compactMode: false,
};

const previousMonths = [
  { income: 3820, expenses: 2510 },
  { income: 3960, expenses: 2380 },
  { income: 4100, expenses: 2740 },
  { income: 4050, expenses: 2210 },
  { income: 4180, expenses: 2350 },
];

export function buildMonthlyTrend(currentIncome, currentExpenses) {
  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    const label = new Intl.DateTimeFormat('es-ES', { month: 'short' })
      .format(date)
      .replace('.', '');
    const values =
      index === 5
        ? { income: currentIncome, expenses: currentExpenses }
        : previousMonths[index];

    return {
      label,
      fullLabel: new Intl.DateTimeFormat('es-ES', {
        month: 'long',
        year: 'numeric',
      }).format(date),
      income: values.income,
      expenses: values.expenses,
      savings: Math.max(0, values.income - values.expenses),
    };
  });
}

export function buildSavingsGrowth(balance) {
  const factors = [
    0.56, 0.59, 0.57, 0.63, 0.67, 0.69, 0.73, 0.78, 0.82, 0.87, 0.92, 1,
  ];

  return factors.map((factor, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (11 - index), 1);
    return {
      label: new Intl.DateTimeFormat('es-ES', { month: 'short' })
        .format(date)
        .replace('.', ''),
      fullLabel: new Intl.DateTimeFormat('es-ES', {
        month: 'long',
        year: 'numeric',
      }).format(date),
      value: Math.round(balance * factor),
    };
  });
}

export const monthLabel = new Intl.DateTimeFormat('es-ES', {
  month: 'long',
  year: 'numeric',
}).format(now);

export const fullToday = new Intl.DateTimeFormat('es-ES', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
}).format(now);

export function formatDate(value, options = {}) {
  if (!value) return '—';
  const date = new Date(`${value}T12:00:00`);
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    ...options,
  }).format(date);
}

export function formatLongDate(value) {
  if (!value) return '—';
  const date = new Date(`${value}T12:00:00`);
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function getCategory(name) {
  return (
    CATEGORY_MAP[name] || {
      name: name || 'Otros',
      icon: 'sparkles',
      color: '#94a3b8',
      budget: 0,
    }
  );
}
