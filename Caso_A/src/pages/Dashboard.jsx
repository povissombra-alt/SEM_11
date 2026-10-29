import { Link } from 'react-router-dom';
import { useFinance } from '../context/FinanceContext';
import { fullToday } from '../data';
import CategoryDonut from '../components/CategoryDonut';
import GoalMini from '../components/GoalMini';
import Icon from '../components/Icon';
import StatCard from '../components/StatCard';
import TransactionItem from '../components/TransactionItem';
import TrendChart from '../components/TrendChart';

const formatDelta = (value) =>
  `${Math.abs(value).toFixed(1).replace('.', ',')} %`;

export default function Dashboard() {
  const {
    balance,
    profile,
    stats,
    monthlyTrend,
    goals,
    transactions,
    categoryBreakdown,
    formatCurrency,
    formatCompact,
    openTransactionModal,
    notify,
  } = useFinance();

  const firstName = profile.name.split(' ')[0];
  const previousMonth = monthlyTrend[monthlyTrend.length - 2] || {
    income: 0,
    expenses: 0,
    savings: 0,
  };
  const previousSavings = Math.max(
    0,
    previousMonth.income - previousMonth.expenses,
  );
  const incomeDelta =
    previousMonth.income > 0
      ? ((stats.income - previousMonth.income) / previousMonth.income) * 100
      : 0;
  const expenseDelta =
    previousMonth.expenses > 0
      ? ((stats.expenses - previousMonth.expenses) /
          previousMonth.expenses) *
        100
      : 0;
  const savingsDelta =
    previousSavings > 0
      ? ((stats.savings - previousSavings) / previousSavings) * 100
      : 0;

  const recentTransactions = [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  const topVariable =
    categoryBreakdown.find((category) => category.name !== 'Vivienda') ||
    categoryBreakdown[0];

  return (
    <div className="dashboard-page">
      <section className="page-intro">
        <div>
          <span className="eyebrow">
            <span className="live-dot" />
            {fullToday}
          </span>
          <h2>
            Hola, {firstName} <span className="wave">👋</span>
          </h2>
          <p>
            Este es el pulso de tus finanzas. Todo en orden, todo en un solo
            lugar.
          </p>
        </div>
        <div className="page-actions">
          <button
            type="button"
            className="button button-ghost"
            onClick={() =>
              notify('Informe mensual preparado. Descarga simulada en la demo.', 'info')
            }
          >
            <Icon name="download" size={17} />
            Informe mensual
          </button>
          <button
            type="button"
            className="button button-primary"
            onClick={openTransactionModal}
          >
            <Icon name="plus" size={18} />
            Nuevo movimiento
          </button>
        </div>
      </section>

      <section className="stats-grid" aria-label="Resumen financiero">
        <StatCard
          label="Saldo total"
          value={formatCurrency(balance)}
          icon="wallet"
          tone="green"
          change="+4,8 %"
          changeDirection="up"
          positive
        />
        <StatCard
          label="Ingresos del mes"
          value={formatCurrency(stats.income)}
          icon="arrowDownLeft"
          tone="blue"
          change={formatDelta(incomeDelta)}
          changeDirection={incomeDelta >= 0 ? 'up' : 'down'}
          positive={incomeDelta >= 0}
        />
        <StatCard
          label="Gastos del mes"
          value={formatCurrency(stats.expenses)}
          icon="arrowUpRight"
          tone="rose"
          change={formatDelta(expenseDelta)}
          changeDirection={expenseDelta >= 0 ? 'up' : 'down'}
          positive={expenseDelta <= 0}
        />
        <StatCard
          label="Ahorro del mes"
          value={formatCurrency(stats.savings)}
          icon="piggy"
          tone="amber"
          change={formatDelta(savingsDelta)}
          changeDirection={savingsDelta >= 0 ? 'up' : 'down'}
          positive={savingsDelta >= 0}
        />
      </section>

      <section className="dashboard-grid dashboard-grid-main">
        <article className="card trend-card">
          <header className="card-header">
            <div>
              <span className="card-kicker">Flujo de caja</span>
              <h2>Ingresos y gastos</h2>
            </div>
            <span className="range-pill">
              <Icon name="calendar" size={14} />
              Últimos 6 meses
            </span>
          </header>

          <div className="trend-summary">
            <div>
              <span>Entradas</span>
              <strong className="positive-text">
                +{formatCurrency(stats.income, { maximumFractionDigits: 0 })}
              </strong>
            </div>
            <div>
              <span>Salidas</span>
              <strong className="negative-text">
                −{formatCurrency(stats.expenses, { maximumFractionDigits: 0 })}
              </strong>
            </div>
            <div className="trend-rate">
              <span>Tasa de ahorro</span>
              <strong>{Math.round(stats.savingsRate)} %</strong>
            </div>
          </div>

          <TrendChart
            data={monthlyTrend}
            series={[
              { key: 'income', label: 'Ingresos', color: '#34d399' },
              { key: 'expenses', label: 'Gastos', color: '#fb7185' },
            ]}
            formatValue={(value) => formatCurrency(value, { maximumFractionDigits: 0 })}
            formatAxis={formatCompact}
            height={292}
          />
        </article>

        <CategoryDonut />
      </section>

      <section className="dashboard-grid dashboard-grid-secondary">
        <article className="card recent-card">
          <header className="card-header">
            <div>
              <span className="card-kicker">Actividad reciente</span>
              <h2>Últimos movimientos</h2>
            </div>
            <Link to="/movimientos" className="text-link">
              Ver todos
              <Icon name="arrowRight" size={15} />
            </Link>
          </header>

          <div className="recent-list">
            {recentTransactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
              />
            ))}
            {recentTransactions.length === 0 && (
              <div className="empty-inline">
                <Icon name="movements" size={26} />
                <div>
                  <strong>Sin movimientos todavía</strong>
                  <p>Añade tu primer gasto o ingreso para empezar.</p>
                </div>
              </div>
            )}
          </div>

          <footer className="recent-footer">
            <span>
              <Icon name="shield" size={15} />
              Datos guardados de forma local en este navegador
            </span>
            <button
              type="button"
              className="text-link"
              onClick={openTransactionModal}
            >
              <Icon name="plus" size={15} />
              Añadir
            </button>
          </footer>
        </article>

        <article className="card goals-card">
          <header className="card-header">
            <div>
              <span className="card-kicker">Ahorro</span>
              <h2>Tus metas</h2>
            </div>
            <Link to="/ahorros" className="icon-button icon-button-sm" aria-label="Ver metas">
              <Icon name="arrowUpRight" size={17} />
            </Link>
          </header>

          <div className="goal-list">
            {goals.slice(0, 3).map((goal) => (
              <GoalMini key={goal.id} goal={goal} />
            ))}
          </div>

          <div className="goals-note">
            <span className="goals-note-icon">
              <Icon name={topVariable?.icon || 'sparkles'} size={16} />
            </span>
            <p>
              <strong>{topVariable?.name || 'Tus gastos'}</strong> es tu mayor
              gasto variable: {formatCurrency(topVariable?.amount || 0)} este
              mes.
            </p>
          </div>
        </article>
      </section>

      <section className="insight-strip">
        <span className="insight-icon">
          <Icon name="sparkles" size={22} />
        </span>
        <div className="insight-copy">
          <span>Recomendación de Fintra</span>
          <strong>
            {stats.savingsRate >= 20
              ? `Estás ahorrando el ${Math.round(
                  stats.savingsRate,
                )} % de tus ingresos. Mantén el ritmo y tus metas llegarán antes.`
              : 'Tu tasa de ahorro puede mejorar. Empieza con un aporte pequeño y constante.'}
          </strong>
        </div>
        <Link to="/ahorros" className="button button-soft">
          Ver mis ahorros
          <Icon name="arrowRight" size={16} />
        </Link>
      </section>
    </div>
  );
}
