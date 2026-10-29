import { useState } from 'react';

export default function BarChart({
  data,
  height = 250,
  format = (value) => String(value),
  tipFormat,
}) {
  const [active, setActive] = useState(null);

  const W = 760;
  const H = height;
  const pad = { top: 22, right: 20, bottom: 32, left: 60 };

  if (!data || !data.length) {
    return <div className="chart-empty">Sin datos para este periodo.</div>;
  }

  const max = Math.max(1, ...data.flatMap((item) => [item.income, item.expense])) * 1.16;
  const innerW = W - pad.left - pad.right;
  const innerH = H - pad.top - pad.bottom;
  const groupW = innerW / data.length;
  const barW = Math.min(20, groupW * 0.26);
  const gap = 5;

  const y = (value) => pad.top + (1 - value / max) * innerH;
  const ticks = [0, 1, 2, 3].map((index) => (max * index) / 3);
  const activeItem = active === null ? null : data[active];
  const baseY = pad.top + innerH;
  const formatter = tipFormat || format;

  return (
    <div className="chart">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="chart-svg"
        role="img"
        aria-label="Comparativa de ingresos y gastos"
      >
        {ticks.map((tick, index) => (
          <g key={`tick-${index}`}>
            <line
              x1={pad.left}
              x2={W - pad.right}
              y1={y(tick)}
              y2={y(tick)}
              className="grid-line"
            />
            <text x={pad.left - 12} y={y(tick) + 4} textAnchor="end" className="axis-text">
              {format(tick)}
            </text>
          </g>
        ))}

        {data.map((item, index) => {
          const center = pad.left + groupW * index + groupW / 2;
          const incomeX = center - barW - gap / 2;
          const expenseX = center + gap / 2;
          const incomeH = Math.max(0, baseY - y(item.income));
          const expenseH = Math.max(0, baseY - y(item.expense));

          return (
            <g key={item.key || item.label}>
              <rect
                x={pad.left + groupW * index + 2}
                y={pad.top}
                width={groupW - 4}
                height={innerH}
                rx="10"
                fill="rgba(148, 163, 184, 0.07)"
                opacity={active === index ? 1 : 0}
              />
              <rect
                x={incomeX}
                y={y(item.income)}
                width={barW}
                height={incomeH}
                rx="5"
                fill="#34d399"
                opacity={active === null || active === index ? 1 : 0.45}
              />
              <rect
                x={expenseX}
                y={y(item.expense)}
                width={barW}
                height={expenseH}
                rx="5"
                fill="#fb7185"
                opacity={active === null || active === index ? 1 : 0.45}
              />
              <text x={center} y={H - 9} textAnchor="middle" className="axis-text">
                {item.label}
              </text>
              <rect
                x={pad.left + groupW * index}
                y={pad.top}
                width={groupW}
                height={innerH}
                fill="transparent"
                onMouseEnter={() => setActive(index)}
                onMouseLeave={() => setActive(null)}
              />
            </g>
          );
        })}
      </svg>

      {activeItem && (
        <div
          className="chart-tip chart-tip--wide"
          style={{
            left: `${Math.min(84, Math.max(16, ((pad.left + groupW * active + groupW / 2) / W) * 100))}%`,
            top: `${(y(Math.max(activeItem.income, activeItem.expense)) / H) * 100}%`,
          }}
        >
          <span>{activeItem.label}</span>
          <div className="tip-row">
            <i className="dot dot-green" /> Ingresos <strong>{formatter(activeItem.income)}</strong>
          </div>
          <div className="tip-row">
            <i className="dot dot-rose" /> Gastos <strong>{formatter(activeItem.expense)}</strong>
          </div>
        </div>
      )}
    </div>
  );
}
