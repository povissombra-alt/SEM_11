import Icon from './Icon';

export default function StatCard({
  label,
  value,
  icon,
  tone = 'green',
  change,
  changeDirection = 'up',
  positive = true,
  footnote = 'vs. mes anterior',
}) {
  return (
    <article className={`stat-card tone-${tone}`}>
      <div className="stat-card-top">
        <span className="stat-icon">
          <Icon name={icon} size={19} />
        </span>
        {change && (
          <span
            className={`stat-change ${positive ? 'is-positive' : 'is-negative'}`}
          >
            <Icon
              name={changeDirection === 'up' ? 'trendUp' : 'arrowDownLeft'}
              size={14}
            />
            {change}
          </span>
        )}
      </div>
      <p>{label}</p>
      <strong>{value}</strong>
      <div className="stat-foot">
        {change ? (
          <>
            <span
              className={positive ? 'positive-text' : 'negative-text'}
            >
              {positive ? 'Buen ritmo' : 'A revisar'}
            </span>
            <span>{footnote}</span>
          </>
        ) : (
          <span>{footnote}</span>
        )}
      </div>
    </article>
  );
}
