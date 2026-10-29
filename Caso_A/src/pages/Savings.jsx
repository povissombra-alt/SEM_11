import { useMemo, useState } from 'react';
import { formatLongDate } from '../data';
import { useFinance } from '../context/FinanceContext';
import Icon from '../components/Icon';
import Modal from '../components/Modal';
import TrendChart from '../components/TrendChart';

function monthsUntil(dateValue) {
  const deadline = new Date(`${dateValue}T12:00:00`);
  const now = new Date();
  const months =
    (deadline.getFullYear() - now.getFullYear()) * 12 +
    (deadline.getMonth() - now.getMonth());
  return Math.max(0, months);
}

export default function Savings() {
  const {
    goals,
    goalsSummary,
    savingsGrowth,
    balance,
    stats,
    transactions,
    formatCurrency,
    formatCompact,
    settings,
    addFundsToGoal,
  } = useFinance();
  const [range, setRange] = useState('12');
  const [contributionOpen, setContributionOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState(
    goals.find((goal) => goal.saved < goal.target)?.id || goals[0]?.id || '',
  );
  const [amount, setAmount] = useState('');

  const openContribution = (goalId) => {
    setSelectedGoalId(goalId || selectedGoalId);
    setAmount('');
    setContributionOpen(true);
  };

  const selectedGoal = goals.find((goal) => goal.id === selectedGoalId);
  const activeGoals = goals.filter((goal) => goal.saved < goal.target);
  const chartData = useMemo(
    () => (range === '6' ? savingsGrowth.slice(-6) : savingsGrowth),
    [range, savingsGrowth],
  );

  const monthlyContributions = useMemo(() => {
    const now = new Date();
    const key = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    return Math.abs(
      transactions
        .filter(
          (transaction) =>
            transaction.category === 'Ahorro' &&
            transaction.amount < 0 &&
            transaction.date.startsWith(key),
        )
        .reduce((total, transaction) => total + transaction.amount, 0),
    );
  }, [transactions]);

  const featuredGoal =
    [...activeGoals].sort(
      (a, b) => b.saved / b.target - a.saved / a.target,
    )[0] || goals[0];
  const featuredRemaining = featuredGoal
    ? Math.max(0, featuredGoal.target - featuredGoal.saved)
    : 0;
  const projectedMonths =
    monthlyContributions > 0
      ? Math.ceil(featuredRemaining / monthlyContributions)
      : null;

  const remainingSelected = selectedGoal
    ? Math.max(0, selectedGoal.target - selectedGoal.saved)
    : 0;

  const handleContribution = (event) => {
    event.preventDefault();
    if (!selectedGoal) return;
    const success = addFundsToGoal(selectedGoal.id, amount);
    if (success) {
      setContributionOpen(false);
      setAmount('');
    }
  };

  return (
    <div className="savings-page">
      <section className="page-intro">
        <div>
          <span className="eyebrow">
            <span className="live-dot" />
            Ahorro con propósito
          </span>
          <h2>Haz que tu dinero trabaje para ti</h2>
          <p>
            Cada aporte te acerca a eso que llevas tiempo queriendo hacer.
          </p>
        </div>
        <div className="page-actions">
          <button
            type="button"
            className="button button-primary"
            onClick={() => openContribution(activeGoals[0]?.id)}
          >
            <Icon name="plus" size={18} />
            Aportar a una meta
          </button>
        </div>
      </section>

      <section className="savings-hero">
        <div className="savings-hero-copy">
          <span className="savings-hero-eyebrow">
            <Icon name="piggy" size={16} />
            Total ahorrado en metas
          </span>
          <h3>{formatCurrency(goalsSummary.saved)}</h3>
          <p>
            Has completado el{' '}
            <strong>{Math.round(goalsSummary.percentage)} %</strong> de un
            objetivo total de{' '}
            {formatCurrency(goalsSummary.target, {
              maximumFractionDigits: 0,
            })}
            .
          </p>
          <div className="savings-hero-progress">
            <span
              style={{ width: `${Math.min(100, goalsSummary.percentage)}%` }}
            />
          </div>
          <div className="savings-hero-meta">
            <span>
              <strong>
                {formatCurrency(monthlyContributions, {
                  maximumFractionDigits: 0,
                })}
              </strong>
              aportados este mes
            </span>
            <span>
              <strong>{activeGoals.length}</strong>
              metas activas
            </span>
            <span>
              <strong>{formatCurrency(balance, { maximumFractionDigits: 0 })}</strong>
              saldo disponible
            </span>
          </div>
        </div>

        <div className="savings-hero-visual" aria-hidden="true">
          <div
            className="savings-ring"
            style={{
              '--ring-progress': `${Math.min(
                100,
                goalsSummary.percentage,
              )}%`,
            }}
          >
            <div>
              <strong>{Math.round(goalsSummary.percentage)}%</strong>
              <span>completado</span>
            </div>
          </div>
          <div className="savings-orb savings-orb-one" />
          <div className="savings-orb savings-orb-two" />
        </div>
      </section>

      <section className="savings-grid">
        <article className="card savings-chart-card">
          <header className="card-header">
            <div>
              <span className="card-kicker">Crecimiento</span>
              <h2>Evolución de tus ahorros</h2>
            </div>
            <div className="range-switch" role="group" aria-label="Periodo de la gráfica">
              <button
                type="button"
                className={range === '6' ? 'is-active' : ''}
                onClick={() => setRange('6')}
              >
                6M
              </button>
              <button
                type="button"
                className={range === '12' ? 'is-active' : ''}
                onClick={() => setRange('12')}
              >
                1A
              </button>
            </div>
          </header>

          <div className="savings-chart-summary">
            <div>
              <span>Saldo actual</span>
              <strong>{formatCurrency(balance)}</strong>
            </div>
            <span className="savings-growth-pill">
              <Icon name="trendUp" size={15} />
              +{formatCurrency(chartData[0] ? balance - chartData[0].value : 0, {
                maximumFractionDigits: 0,
              })}{' '}
              en el periodo
            </span>
          </div>

          <TrendChart
            data={chartData}
            series={[
              { key: 'value', label: 'Ahorro acumulado', color: '#34d399' },
            ]}
            formatValue={(value) =>
              formatCurrency(value, { maximumFractionDigits: 0 })
            }
            formatAxis={formatCompact}
            height={286}
          />
        </article>

        <aside className="card savings-insight-card">
          <span className="savings-insight-icon">
            <Icon name="sparkles" size={22} />
          </span>
          <span className="card-kicker">Proyección</span>
          <h2>
            {projectedMonths
              ? `A este ritmo, tu meta llega en ${projectedMonths} ${
                  projectedMonths === 1 ? 'mes' : 'meses'
                }.`
              : 'Empieza con un aporte pequeño.'}
          </h2>
          <p>
            {featuredGoal && projectedMonths
              ? `Mantén ${formatCurrency(monthlyContributions, {
                  maximumFractionDigits: 0,
                })} al mes y completarás “${featuredGoal.name}” antes de lo previsto.`
              : 'Aportar de forma constante, aunque sea poco, es la mejor forma de crear el hábito.'}
          </p>

          {featuredGoal && (
            <div className="savings-insight-goal">
              <span
                className="goal-mini-icon"
                style={{
                  color: featuredGoal.color,
                  background: `color-mix(in srgb, ${featuredGoal.color} 14%, transparent)`,
                }}
              >
                <Icon name={featuredGoal.icon} size={18} />
              </span>
              <div>
                <strong>{featuredGoal.name}</strong>
                <span>
                  {formatCurrency(featuredRemaining, {
                    maximumFractionDigits: 0,
                  })}{' '}
                  por conseguir
                </span>
              </div>
            </div>
          )}

          <div className="savings-tip">
            <Icon name="info" size={16} />
            <span>
              Consejo: automatiza tus aportes el día después de cobrar.
            </span>
          </div>

          <button
            type="button"
            className="button button-soft button-block"
            onClick={() => openContribution(featuredGoal?.id)}
          >
            Hacer un aporte
            <Icon name="arrowRight" size={16} />
          </button>
        </aside>
      </section>

      <section className="goals-section">
        <header className="section-heading">
          <div>
            <span className="card-kicker">Tus objetivos</span>
            <h2>Metas de ahorro</h2>
          </div>
          <span className="section-note">
            {activeGoals.length} en curso · {goals.length - activeGoals.length}{' '}
            completadas
          </span>
        </header>

        <div className="goals-grid">
          {goals.map((goal) => {
            const percentage = Math.min(100, (goal.saved / goal.target) * 100);
            const remaining = Math.max(0, goal.target - goal.saved);
            const completed = percentage >= 100;

            return (
              <article
                className={`goal-card${completed ? ' is-completed' : ''}`}
                key={goal.id}
              >
                <header>
                  <span
                    className="goal-card-icon"
                    style={{
                      color: goal.color,
                      background: `color-mix(in srgb, ${goal.color} 14%, transparent)`,
                    }}
                  >
                    <Icon name={goal.icon} size={22} />
                  </span>
                  <div className="goal-card-title">
                    <h3>{goal.name}</h3>
                    <p>{goal.description}</p>
                  </div>
                  {completed && (
                    <span className="completed-pill">
                      <Icon name="check" size={13} />
                      Lograda
                    </span>
                  )}
                </header>

                <div className="goal-card-amounts">
                  <strong>
                    {formatCurrency(goal.saved, { maximumFractionDigits: 0 })}
                  </strong>
                  <span>
                    de {formatCurrency(goal.target, { maximumFractionDigits: 0 })}
                  </span>
                  <em>{Math.round(percentage)} %</em>
                </div>

                <div className="progress-track">
                  <span
                    style={{
                      width: `${percentage}%`,
                      background: goal.gradient,
                    }}
                  />
                </div>

                <footer>
                  <span>
                    <Icon name="calendar" size={14} />
                    {formatLongDate(goal.deadline)}
                  </span>
                  {completed ? (
                    <span className="goal-done-copy">
                      <Icon name="check" size={14} />
                      Meta completada
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="goal-contribute"
                      onClick={() => openContribution(goal.id)}
                    >
                      Aportar
                      <Icon name="plus" size={14} />
                    </button>
                  )}
                </footer>

                {!completed && (
                  <p className="goal-remaining">
                    Te faltan{' '}
                    <strong>
                      {formatCurrency(remaining, {
                        maximumFractionDigits: 0,
                      })}
                    </strong>{' '}
                    · {monthsUntil(goal.deadline)} meses para la fecha límite
                  </p>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <Modal
        open={contributionOpen}
        onClose={() => setContributionOpen(false)}
        title="Aportar a una meta"
        subtitle="Mueve dinero de tu saldo disponible a uno de tus objetivos."
        icon="piggy"
        size="sm"
      >
        <form className="form-stack" onSubmit={handleContribution}>
          <label className="field">
            <span>Meta de ahorro</span>
            <select
              value={selectedGoalId}
              onChange={(event) => setSelectedGoalId(event.target.value)}
            >
              {goals.map((goal) => (
                <option key={goal.id} value={goal.id}>
                  {goal.name} · {Math.round((goal.saved / goal.target) * 100)} %
                </option>
              ))}
            </select>
          </label>

          {selectedGoal && (
            <div className="contribution-summary">
              <div>
                <span>Ahorrado</span>
                <strong>{formatCurrency(selectedGoal.saved)}</strong>
              </div>
              <div>
                <span>Falta</span>
                <strong>{formatCurrency(remainingSelected)}</strong>
              </div>
              <div
                className="contribution-progress"
                aria-hidden="true"
              >
                <span
                  style={{
                    width: `${Math.min(
                      100,
                      (selectedGoal.saved / selectedGoal.target) * 100,
                    )}%`,
                    background: selectedGoal.gradient,
                  }}
                />
              </div>
            </div>
          )}

          <label className="field">
            <span>Importe del aporte</span>
            <div className="input-with-suffix">
              <input
                type="number"
                min="0.01"
                max={remainingSelected || undefined}
                step="0.01"
                inputMode="decimal"
                placeholder="0,00"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                required
                autoFocus
              />
              <span>{settings.currency}</span>
            </div>
          </label>

          <div className="quick-amounts">
            {[25, 50, 100, 250].map((value) => (
              <button
                type="button"
                key={value}
                onClick={() => setAmount(String(Math.min(value, remainingSelected)))}
                disabled={remainingSelected < value && remainingSelected <= 0}
              >
                +{formatCurrency(value, { maximumFractionDigits: 0 })}
              </button>
            ))}
          </div>

          <footer className="modal-actions">
            <button
              type="button"
              className="button button-ghost"
              onClick={() => setContributionOpen(false)}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="button button-primary"
              disabled={!remainingSelected}
            >
              <Icon name="piggy" size={17} />
              Confirmar aporte
            </button>
          </footer>
        </form>
      </Modal>
    </div>
  );
}
