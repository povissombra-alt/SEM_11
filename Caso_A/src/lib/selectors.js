import { CATEGORIES } from '../data/seed';

export const START_BALANCE = 4200;

const MONTHS_SHORT = [
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic',
];

const round2 = (n) => Math.round(n * 100) / 100;
const pad2 = (n) => String(n).padStart(2, '0');
const keyOf = (date) => `${date.getFullYear()}-${pad2(date.getMonth() + 1)}`;

function pct(current, previous) {
  if (!previous) return null;
  return Math.round(((current - previous) / Math.abs(previous)) * 100);
}

/** Serie mensual de ingresos y gastos para los últimos `count` meses. */
export function buildMonthlySeries(movements, count = 7) {
  const now = new Date();
  const buckets = [];

  for (let i = count - 1; i >= 0; i -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({
      key: keyOf(date),
      label: MONTHS_SHORT[date.getMonth()],
      income: 0,
      expense: 0,
    });
  }

  const map = new Map(buckets.map((bucket) => [bucket.key, bucket]));

  for (const movement of movements) {
    const bucket = map.get(movement.date.slice(0, 7));
    if (!bucket) continue;
    if (movement.type === 'ingreso') bucket.income += movement.amount;
    else bucket.expense += movement.amount;
  }

  return buckets.map((bucket) => ({
    ...bucket,
    income: round2(bucket.income),
    expense: round2(bucket.expense),
    net: round2(bucket.income - bucket.expense),
  }));
}

/** Saldo total = saldo inicial + todos los ingresos − todos los gastos. */
export function getBalance(movements) {
  const net = movements.reduce(
    (acc, movement) => acc + (movement.type === 'ingreso' ? movement.amount : -movement.amount),
    0,
  );
  return round2(START_BALANCE + net);
}

/** Serie acumulada del saldo (puntos para el área de ahorro). */
export function getSavingsSeries(movements, count = 7) {
  const buckets = buildMonthlySeries(movements, count);
  const total = getBalance(movements);
  const windowNet = buckets.reduce((acc, bucket) => acc + bucket.net, 0);
  let running = round2(total - windowNet);

  return buckets.map((bucket) => {
    running = round2(running + bucket.net);
    return { key: bucket.key, label: bucket.label, value: running };
  });
}

/** Estadísticas del mes actual y comparación con el anterior. */
export function getMonthStats(movements, reference = new Date()) {
  const currentKey = keyOf(reference);
  const previousKey = keyOf(new Date(reference.getFullYear(), reference.getMonth() - 1, 1));

  const sum = (key, type) =>
    movements
      .filter((movement) => movement.date.slice(0, 7) === key && movement.type === type)
      .reduce((acc, movement) => acc + movement.amount, 0);

  const income = round2(sum(currentKey, 'ingreso'));
  const expense = round2(sum(currentKey, 'gasto'));
  const previousIncome = round2(sum(previousKey, 'ingreso'));
  const previousExpense = round2(sum(previousKey, 'gasto'));
  const saving = round2(income - expense);
  const previousSaving = round2(previousIncome - previousExpense);

  return {
    income,
    expense,
    saving,
    previousIncome,
    previousExpense,
    previousSaving,
    incomeDelta: pct(income, previousIncome),
    expenseDelta: pct(expense, previousExpense),
    savingDelta: pct(saving, previousSaving),
    count: movements.filter((movement) => movement.date.slice(0, 7) === currentKey).length,
  };
}

/** Gastos agrupados por categoría en los últimos `months` meses. */
export function getCategoryBreakdown(movements, months = 6) {
  const now = new Date();
  const cutoff = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);
  const cutoffKey = keyOf(cutoff);
  const totals = new Map();

  for (const movement of movements) {
    if (movement.type !== 'gasto') continue;
    if (movement.date.slice(0, 7) < cutoffKey) continue;
    totals.set(movement.category, (totals.get(movement.category) || 0) + movement.amount);
  }

  return [...totals.entries()]
    .map(([label, value]) => ({
      label,
      value: round2(value),
      color: CATEGORIES[label]?.color || '#94a3b8',
    }))
    .sort((a, b) => b.value - a.value);
}

/** Datos agregados para la vista de gráficas. */
export function getPeriodInsights(movements, months = 6) {
  const now = new Date();
  const cutoff = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);
  const cutoffKey = keyOf(cutoff);
  const inPeriod = movements.filter((movement) => movement.date.slice(0, 7) >= cutoffKey);
  const expenses = inPeriod.filter((movement) => movement.type === 'gasto');

  const totalIncome = round2(
    inPeriod
      .filter((movement) => movement.type === 'ingreso')
      .reduce((acc, movement) => acc + movement.amount, 0),
  );
  const totalExpense = round2(expenses.reduce((acc, movement) => acc + movement.amount, 0));
  const net = round2(totalIncome - totalExpense);
  const categories = getCategoryBreakdown(movements, months);
  const biggest = expenses.reduce(
    (max, movement) => (movement.amount > (max?.amount || 0) ? movement : max),
    null,
  );

  return {
    inPeriod,
    totalIncome,
    totalExpense,
    net,
    avgMonth: round2(net / months),
    avgDay: round2(totalExpense / (months * 30)),
    topCategory: categories[0] || null,
    biggest,
  };
}
