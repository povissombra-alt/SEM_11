import { useId, useState } from 'react';

function smoothPath(points) {
  if (points.length < 2) return '';
  let path = `M ${points[0][0].toFixed(2)} ${points[0][1].toFixed(2)}`;
  for (let index = 1; index < points.length; index += 1) {
    const [x0, y0] = points[index - 1];
    const [x1, y1] = points[index];
    const middle = (x0 + x1) / 2;
    path += ` C ${middle.toFixed(2)} ${y0.toFixed(2)}, ${middle.toFixed(2)} ${y1.toFixed(
      2,
    )}, ${x1.toFixed(2)} ${y1.toFixed(2)}`;
  }
  return path;
}

export default function AreaChart({
  data,
  height = 250,
  color = '#34d399',
  format = (value) => String(value),
  tipFormat,
}) {
  const gradientId = useId().replace(/:/g, '');
  const [active, setActive] = useState(null);

  const W = 760;
  const H = height;
  const pad = { top: 22, right: 20, bottom: 32, left: 60 };

  if (!data || data.length < 2) {
    return <div className="chart-empty">Sin datos suficientes para dibujar la gráfica.</div>;
  }

  const values = data.map((item) => item.value);
  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const span = rawMax - rawMin || Math.max(rawMax * 0.15, 1);
  const lo = Math.max(0, rawMin - span * 0.4);
  const hi = rawMax + span * 0.18;

  const innerW = W - pad.left - pad.right;
  const innerH = H - pad.top - pad.bottom;
  const step = innerW / (data.length - 1);

  const x = (index) => pad.left + index * step;
  const y = (value) => pad.top + (1 - (value - lo) / (hi - lo)) * innerH;

  const points = data.map((item, index) => [x(index), y(item.value)]);
  const line = smoothPath(points);
  const area = `${line} L ${points[points.length - 1][0].toFixed(2)} ${(
    pad.top + innerH
  ).toFixed(2)} L ${points[0][0].toFixed(2)} ${(pad.top + innerH).toFixed(2)} Z`;

  const ticks = [0, 1, 2, 3].map((index) => lo + ((hi - lo) * index) / 3);
  const formatter = tipFormat || format;
  const activeItem = active === null ? null : data[active];

  return (
    <div className="chart">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="chart-svg"
        role="img"
        aria-label="Evolución del ahorro"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.34" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {ticks.map((tick, index) => {
          const tickY = y(tick);
          return (
            <g key={`tick-${index}`}>
              <line
                x1={pad.left}
                x2={W - pad.right}
                y1={tickY}
                y2={tickY}
                className="grid-line"
              />
              <text x={pad.left - 12} y={tickY + 4} textAnchor="end" className="axis-text">
                {format(tick)}
              </text>
            </g>
          );
        })}

        <path d={area} fill={`url(#${gradientId})`} />
        <path
          d={line}
          fill="none"
          stroke={color}
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {data.map((item, index) => (
          <text key={`label-${item.key || index}`} x={x(index)} y={H - 9} textAnchor="middle" className="axis-text">
            {item.label}
          </text>
        ))}

        {activeItem && (
          <g>
            <line
              x1={x(active)}
              x2={x(active)}
              y1={pad.top}
              y2={pad.top + innerH}
              className="cursor-line"
            />
            <circle
              cx={x(active)}
              cy={y(activeItem.value)}
              r="6"
              fill={color}
              stroke="#07101d"
              strokeWidth="3"
            />
          </g>
        )}

        {data.map((item, index) => (
          <rect
            key={`hover-${item.key || index}`}
            x={x(index) - step / 2}
            y={pad.top}
            width={step}
            height={innerH}
            fill="transparent"
            onMouseEnter={() => setActive(index)}
            onMouseLeave={() => setActive(null)}
          />
        ))}
      </svg>

      {activeItem && (
        <div
          className="chart-tip"
          style={{
            left: `${Math.min(88, Math.max(12, (x(active) / W) * 100))}%`,
            top: `${(y(activeItem.value) / H) * 100}%`,
          }}
        >
          <span>{activeItem.label}</span>
          <strong>{formatter(activeItem.value)}</strong>
        </div>
      )}
    </div>
  );
}
