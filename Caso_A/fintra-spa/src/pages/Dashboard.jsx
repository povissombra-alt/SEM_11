import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  getBalance,
  getCategoryBreakdown,
  getMonthStats,
  getSavingsSeries,
} from '../lib/selectors';
import { compactMoney, dateLong, money, nowLocalISO } from '../lib/format';
import StatCard from '../components/StatCard';
import AreaChart from '../components/AreaChart';
import DonutChart from '../components/DonutChart';
import TransactionTable from '../components/TransactionTable';
import MovementModal from '../components/MovementModal';
import Icon from '../components/Icons';

export default function Dashboard() {
  const { user, movements, privacy, live } = useApp();
  const [modalOpen, setModalOpen] = useState(false);

  const stats = useMemo(() => getMonthStats(movements), [movements]);
  const balance = useMemo(() => getBalance(movements), [movements]);
  const series = useMemo(() => getSavingsSeries(movements, 7), [movements]);
  const categories = useMemo(() => getCategoryBreakdown(movements, 1), [movements]);
  const recent = useMemo(() => movements.slice(0, 6), [movements]);

  const firstName = user.name.split(' ')[0];
  const goalProgress = Math.min(
    100,
    Math.round((Math.max(stats.saving, 0) / (user.goal || 1)) * 100),
  );

  return (
    <div className="page-in">
      <section className="hero card">
        <div className="hero-copy">
          <span className="eyebrow">
            <span className={`live-dot ${live ? 'on' : ''}`} />
            {live ? 'Datos en tiempo real' : 'Actualización en pausa'} · {dateLong(nowLocalISO())}
          </span>
          <h2>Hola, {firstName} 👋</h2>
          <p className="muted">
            Este es el resumen de tus finanzas. Los movimientos nuevos aparecen al instante, sin
            recargar la página.
          </p>
        </div>
        <div className="hero-actions">
          <button type="button" className="btn btn-primary" onClick={() => setModalOpen(true)}>
            <Icon name="plus" size={18} /> Nuevo movimiento
          </button>
          <Link to="/graficas" className="btn btn-ghost">
            <Icon name="chart" size={18} /> Ver gráficas
          </Link>
        </div>
      </section>

      <div className="stat-grid">
        <StatCard
          label="Saldo disponible"
          value={balance}
          icon="wallet"
          tone="accent"
          hint="Actualizado en vivo"
          spark={series.map((point) => point.value)}
        />
        <StatCard
          label="Ingresos del mes"
          value={stats.income}
          icon="arrowIn"
          tone="blue"
          delta={stats.incomeDelta}
          deltaLabel="vs. mes anterior"
        />
        <StatCard
          label="Gastos del mes"
          value={stats.expense}
          icon="arrowOut"
          tone="rose"
          delta={stats.expenseDelta}
          positiveIsGood={false}
          deltaLabel="vs. mes anterior"
        />
        <StatCard
          label="Ahorro del mes"
          value={stats.saving}
          icon="target"
          tone="violet"
          delta={stats.savingDelta}
          deltaLabel="vs. mes anterior"
          progress={goalProgress}
          hint={`Meta: ${money(user.goal, privacy)}`}
        />
      </div>

      <div className="grid-main">
        <section className="card">
          <header className="card-head">
            <div>
              <h2>Evolución del ahorro</h2>
              <p className="muted">Saldo acumulado en los últimos 7 meses</p>
            </div>
            <span className="pill">{money(balance, privacy)}</span>
          </header>
          <AreaChart
            data={series}
            color="#34d399"
            format={compactMoney}
            tipFormat={(value) => money(value, privacy)}
          />
        </section>

        <section className="card">
          <header className="card-head">
            <div>
              <h2>Gastos por categoría</h2>
              <p className="muted">Mes actual</p>
            </div>
          </header>
          <DonutChart
            data={categories}
            centerLabel="Gastos del mes"
            format={(value) => money(value, privacy)}
          />
        </section>
      </div>

      <section className="card">
        <header className="card-head">
          <div>
            <h2>Últimos movimientos</h2>
            <p className="muted">
              {stats.count} movimientos este mes · {movements.length} en total
            </p>
          </div>
          <Link to="/movimientos" className="link">
            Ver todos <Icon name="arrowRight" size={16} />
          </Link>
        </header>
        <TransactionTable items={recent} />
      </section>

      <MovementModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
