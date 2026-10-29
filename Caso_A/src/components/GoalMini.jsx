import { Link } from 'react-router-dom';
import { useFinance } from '../context/FinanceContext';
import Icon from './Icon';

export default function GoalMini({ goal }) {
  const { formatCurrency } = useFinance();
  const percentage = Math.min(100, (goal.saved / goal.target) * 100);

  return (
    <Link to="/ahorros" className="goal-mini">
      <span
        className="goal-mini-icon"
        style={{
          color: goal.color,
          background: `color-mix(in srgb, ${goal.color} 14%, transparent)`,
        }}
      >
        <Icon name={goal.icon} size={18} />
      </span>
      <span className="goal-mini-copy">
        <span className="goal-mini-head">
          <strong>{goal.name}</strong>
          <em>{Math.round(percentage)}%</em>
        </span>
        <span className="goal-mini-values">
          {formatCurrency(goal.saved, { maximumFractionDigits: 0 })}
          <span>de {formatCurrency(goal.target, { maximumFractionDigits: 0 })}</span>
        </span>
        <span className="progress-track progress-track-sm">
          <span
            style={{
              width: `${percentage}%`,
              background: goal.gradient,
            }}
          />
        </span>
      </span>
      <Icon name="chevronRight" size={16} className="goal-mini-chevron" />
    </Link>
  );
}
