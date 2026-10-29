import { useMemo, useState } from 'react';

export default function DonutChart({
  data,
  size = 196,
  thickness = 22,
  format = (value) => String(value),
  centerLabel = 'Total',
}) {
  const [active, setActive] = useState(null);

  const items = useMemo(() => {
    if (data.length <= 6) return data;
    const top = data.slice(0, 5);
    const rest = data.slice(5).reduce((acc, item) => acc + item.value, 0);
    return [...top, { label: 'Otros', value: rest, color: '#64748b' }];
  }, [data]);

  const total = items.reduce((acc, item) => acc + item.value, 0);

  if (!items.length || total <= 0) {
    return <div className="chart-empty">Todavía no hay gastos en este periodo.</div>;
  }

  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  const segments = items.map((item) => {
    const fraction = item.value / total;
    const length = Math.max(fraction * circumference - 5, 0.8);
    const segment = { ...item, length, offset, fraction };
    offset += fraction * circumference;
    return segment;
  });

  const activeItem = active === null ? null : items[active];

  return (
    <div className="donut">
      <div className="donut-ring" style={{ width: size, maxWidth: '100%' }}>
        <svg viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Gastos por categoría">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(148, 163, 184, 0.12)"
            strokeWidth={thickness}
          />
          <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
            {segments.map((segment, index) => (
              <circle
                key={segment.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth={active === index ? thickness + 4 : thickness}
                strokeDasharray={`${segment.length} ${circumference - segment.length}`}
                strokeDashoffset={-segment.offset}
                strokeLinecap="round"
                opacity={active === null || active === index ? 1 : 0.32}
                style={{ transition: 'opacity .18s ease, stroke-width .18s ease', cursor: 'pointer' }}
                onMouseEnter={() => setActive(index)}
                onMouseLeave={() => setActive(null)}
              />
            ))}
          </g>
          <text
            x={size / 2}
            y={size / 2 - 6}
            textAnchor="middle"
            className="donut-label"
          >
            {activeItem ? activeItem.label : centerLabel}
          </text>
          <text
            x={size / 2}
            y={size / 2 + 18}
            textAnchor="middle"
            className="donut-value"
          >
            {format(activeItem ? activeItem.value : total)}
          </text>
        </svg>
      </div>

      <ul className="donut-legend">
        {items.map((item, index) => (
          <li
            key={item.label}
            className={active === index ? 'is-active' : ''}
            onMouseEnter={() => setActive(index)}
            onMouseLeave={() => setActive(null)}
          >
            <span className="legend-dot" style={{ background: item.color }} />
            <span className="legend-name">{item.label}</span>
            <span className="legend-pct">{Math.round((item.value / total) * 100)}%</span>
            <span className="legend-value">{format(item.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
