import { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  buildMonthlySeries,
  getCategoryBreakdown,
  getPeriodInsights,
  getSavingsSeries,
} from '../lib/selectors';
import { compactMoney, dateShort, money } from '../lib/format';
import AreaChart from '../components/AreaChart';
import BarChart from '../components/BarChart';
import DonutChart from '../components/DonutChart';
import Icon from '../components/Icons';

const PERIODS = [
  { value: 3, label: '3 meses' },
  { value: 6, label: '6 meses' },
  { value: 12, label: '12 meses' },
];

export default function Graficas() {
  const { movements, privacy } = useApp();
  const [period, setPeriod] = useState(6);

  const savings = useMemo(() => getSavingsSeries(movements, period), [movements, period]);
  const monthly = useMemo(() => buildMonthlySeries(movements, period), [movements, period]);
  const categories = useMemo(() => getCategoryBreakdown(movements, period), [movements, period]);
  const insights = useMemo(() => getPeriodInsights(movements, period), [movements, period]);

  return (
    <div className="page-in">
      <section className="card charts-toolbar">
        <div>
          <h2>Análisis financiero</h2>
          <p className="muted">
            Cambia el periodo y observa cómo se actualizan todas las gráficas al instante.
          </p>
        </div>
        <div className="segmented" role="group" aria-label="Periodo de análisis">
          {PERIODS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={period === option.value ? 'active' : ''}
              onClick={() => setPeriod(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>

      <div className="grid-main">
        <section className="card">
          <header className="card-head">
            <div>
              <h2>Ahorro acumulado</h2>
              <p className="muted">Saldo al cierre de cada mes</p>
            </div>
            <span className={`pill ${insights.net >= 0 ? 'pill-good' : 'pill-bad'}`}>
              {insights.net >= 0 ? '+' : '−'}
              {money(Math.abs(insights.net), privacy)}
            </span>
          </header>
          <AreaChart
            data={savings}
            color="#34d399"
            format={compactMoney}
            tipFormat={(value) => money(value, privacy)}
          />
        </section>

        <section className="card">
          <header className="card-head">
            <div>
              <h2>Reparto de gastos</h2>
              <p className="muted">Por categoría</p>
            </div>
          </header>
          <DonutChart
            data={categories}
            centerLabel="Total gastos"
            format={(value) => money(value, privacy)}
          />
        </section>
      </div>

      <div className="grid-main">
        <section className="card">
          <header className="card-head">
            <div>
              <h2>Ingresos vs. gastos</h2>
              <p className="muted">Comparativa mensual</p>
            </div>
            <div className="legend-inline">
              <span>
                <i className="dot dot-green" /> Ingresos
              </span>
              <span>
                <i className="dot dot-rose" /> Gastos
              </span>
            </div>
          </header>
          <BarChart
            data={monthly}
            format={compactMoney}
            tipFormat={(value) => money(value, privacy)}
          />
        </section>

        <section className="card">
          <header className="card-head">
            <div>
              <h2>Datos clave</h2>
              <p className="muted">Periodo seleccionado</p>
            </div>
          </header>

          <ul className="insight-list">
            <li>
              <span className="insight-icon tone-accent">
                <Icon name="target" size={17} />
              </span>
              <div>
                <span>Ahorro neto</span>
                <strong className={insights.net >= 0 ? 'pos' : 'neg'}>
                  {money(insights.net, privacy)}
                </strong>
              </div>
            </li>
            <li>
              <span className="insight-icon tone-blue">
                <Icon name="calendar" size={17} />
              </span>
              <div>
                <span>Media mensual</span>
                <strong>{money(insights.avgMonth, privacy)}</strong>
              </div>
            </li>
            <li>
              <span className="insight-icon tone-violet">
                <Icon name="clock" size={17} />
              </span>
              <div>
                <span>Gasto medio diario</span>
                <strong>{money(insights.avgDay, privacy)}</strong>
              </div>
            </li>
            <li>
              <span className="insight-icon tone-amber">
                <Icon name="card" size={17} />
              </span>
              <div>
                <span>Categoría con más gasto</span>
                <strong>{insights.topCategory?.label || '—'}</strong>
                <small>{money(insights.topCategory?.value || 0, privacy)}</small>
              </div>
            </li>
            <li>
              <span className="insight-icon tone-rose">
                <Icon name="alert" size={17} />
              </span>
              <div>
                <span>Mayor gasto individual</span>
                <strong>{insights.biggest?.description || '—'}</strong>
                <small>
                  {insights.biggest
                    ? `${money(insights.biggest.amount, privacy)} · ${dateShort(
                        insights.biggest.date,
                      )}`
                    : 'Sin datos'}
                </small>
              </div>
            </li>
            <li>
              <span className="insight-icon tone-slate">
                <Icon name="swap" size={17} />
              </span>
              <div>
                <span>Movimientos analizados</span>
                <strong>{insights.inPeriod.length}</strong>
              </div>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
