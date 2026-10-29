import { useApp } from '../context/AppContext';
import { money } from '../lib/format';
import Icon from './Icons';

function Sparkline({ data }) {
  if (!data || data.length < 2) return null;

  const width = 140;
  const height = 36;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const points = data.map((value, index) => [
    (index / (data.length - 1)) * width,
    height - 4 - ((value - min) / span) * (height - 8),
  ]);
  const path = points
    .map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(' ');

  return (
    <svg
      className="spark"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d={path} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function StatCard({
  label,
  value,
  icon,
  tone = 'accent',
  delta = null,
  deltaLabel,
  positiveIsGood = true,
  hint,
  spark,
  progress,
}) {
  const { privacy } = useApp();
  const hasDelta = typeof delta === 'number' && Number.isFinite(delta);
  const isGood = positiveIsGood ? delta >= 0 : delta <= 0;

  return (
    <article className={`stat tone-${tone}`}>
      <div className="stat-top">
        <span className="stat-label">{label}</span>
        <span className="stat-icon">
          <Icon name={icon} size={18} />
        </span>
      </div>

      <p className="stat-value">{money(value, privacy)}</p>

      <div className="stat-foot">
        {hasDelta && (
          <span className={`delta ${isGood ? 'good' : 'bad'}`}>
            <Icon name={delta >= 0 ? 'arrowUpRight' : 'arrowDownRight'} size={13} />
            {Math.abs(delta)}%
          </span>
        )}
        <span className="stat-hint">{deltaLabel || hint}</span>
      </div>

      {typeof progress === 'number' && (
        <div className="bar bar-sm">
          <i style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} />
        </div>
      )}

      {spark && (
        <div className="stat-spark">
          <Sparkline data={spark} />
        </div>
      )}
    </article>
  );
}
