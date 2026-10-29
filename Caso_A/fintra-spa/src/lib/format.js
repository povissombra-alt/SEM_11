const eur = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const eur0 = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

/** Formatea un importe. Si privacy está activo, oculta la cifra. */
export function money(value, privacy = false) {
  if (privacy) return '•••• €';
  return eur.format(Number.isFinite(value) ? value : 0);
}

/** Importe con signo según el tipo de movimiento. */
export function moneySigned(movement, privacy = false) {
  if (privacy) return '•••• €';
  const sign = movement.type === 'ingreso' ? '+' : '−';
  return `${sign}${eur.format(movement.amount)}`;
}

/** Importe compacto para ejes de gráficas: 12,4k € */
export function compactMoney(value) {
  const abs = Math.abs(value);
  if (abs >= 1000) {
    const digits = abs >= 10000 ? 0 : 1;
    return `${(value / 1000).toFixed(digits).replace('.', ',')}k €`;
  }
  return `${Math.round(value)} €`;
}

export function moneyRounded(value, privacy = false) {
  if (privacy) return '•••• €';
  return eur0.format(value);
}

/** +12% / −8% */
export function percentLabel(value) {
  if (value === null || value === undefined) return '—';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value}%`;
}

const shortDateFmt = new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short' });
const longDateFmt = new Intl.DateTimeFormat('es-ES', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
});
const monthYearFmt = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' });

export function dateShort(iso) {
  return shortDateFmt.format(new Date(iso)).replace('.', '');
}

export function dateLong(iso) {
  const text = longDateFmt.format(new Date(iso));
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function monthYear(iso) {
  const text = monthYearFmt.format(new Date(iso));
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function monthTitle(key) {
  const [year, month] = key.split('-').map(Number);
  const text = monthYearFmt.format(new Date(year, month - 1, 1));
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function initials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

/** 00:03:42 */
export function duration(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = String(Math.floor(total / 3600)).padStart(2, '0');
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0');
  const s = String(total % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

/** Fecha local en formato YYYY-MM-DDTHH:mm (sin desfase UTC). */
export function nowLocalISO(date = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
}
