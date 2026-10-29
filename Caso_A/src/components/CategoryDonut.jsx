import { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import Icon from './Icon';

export default function CategoryDonut() {
  const { categoryBreakdown, stats, formatCurrency } = useFinance();

  const { segments, gradient } = useMemo(() => {
    const visible = categoryBreakdown.slice(0, 4);
    const restAmount = categoryBreakdown
      .slice(4)
      .reduce((total, category) => total + category.amount, 0);

    const items = [...visible];
    if (restAmount > 0) {
      items.push({
        name: 'Otras',
        color: '#64748b',
        amount: restAmount,
      });
    }

    let accumulated = 0;
    const stops = items.map((item) => {
      const start = accumulated;
      accumulated += stats.expenses
        ? (item.amount / stats.expenses) * 100
        : 0;
      return `${item.color} ${start}% ${accumulated}%`;
    });

    return {
      segments: items,
      gradient: stops.length
        ? `conic-gradient(from -90deg, ${stops.join(', ')})`
        : '#1e2d42',
    };
  }, [categoryBreakdown, stats.expenses]);

  const budgetOver = stats.budgetUsed > 100;

  return (
    <article className="card category-card">
      <header className="card-header">
        <div>
          <span className="card-kicker">Este mes</span>
          <h2>Gastos por categoría</h2>
        </div>
        <span className="card-badge">{categoryBreakdown.length} categorías</span>
      </header>

      <div className="donut-layout">
        <div className="donut-wrap">
          <div className="donut" style={{ background: gradient }}>
            <div className="donut-hole">
              <span>Gasto total</span>
              <strong>{formatCurrency(stats.expenses)}</strong>
              <em>{Math.round(stats.budgetUsed)} % del presupuesto</em>
            </div>
          </div>
        </div>

        <ul className="donut-legend">
          {segments.map((segment) => (
            <li key={segment.name}>
              <span className="legend-dot" style={{ background: segment.color }} />
              <span className="legend-name">{segment.name}</span>
              <strong>
                {stats.expenses
                  ? Math.round((segment.amount / stats.expenses) * 100)
                  : 0}
                %
              </strong>
            </li>
          ))}
          {segments.length === 0 && (
            <li className="legend-empty">Aún no hay gastos este mes.</li>
          )}
        </ul>
      </div>

      <footer className="budget-panel">
        <div className="budget-panel-top">
          <span>
            <Icon name="target" size={15} />
            Presupuesto mensual
          </span>
          <strong className={budgetOver ? 'negative-text' : ''}>
            {formatCurrency(stats.expenses, { maximumFractionDigits: 0 })} /{' '}
            {formatCurrency(stats.monthlyBudget, { maximumFractionDigits: 0 })}
          </strong>
        </div>
        <div
          className={`progress-track${budgetOver ? ' is-over' : ''}`}
          aria-hidden="true"
        >
          <span style={{ width: `${Math.min(100, stats.budgetUsed)}%` }} />
        </div>
        <p className={budgetOver ? 'negative-text' : ''}>
          {budgetOver
            ? 'Has superado tu presupuesto este mes.'
            : `Te quedan ${formatCurrency(
                Math.max(0, stats.monthlyBudget - stats.expenses),
                { maximumFractionDigits: 0 },
              )} disponibles.`}
        </p>
      </footer>
    </article>
  );
}
