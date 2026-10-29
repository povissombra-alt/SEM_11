import { useId, useMemo, useState } from 'react';

function smoothPath(points) {
  if (!points.length) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let index = 0; index < points.length - 1; index += 1) {
    const p0 = points[index - 1] || points[index];
    const p1 = points[index];
    const p2 = points[index + 1];
    const p3 = points[index + 2] || p2;

    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;

    path += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }

  return path;
}

export default function TrendChart({
  data,
  series,
  formatValue,
  formatAxis,
  height = 292,
  showLegend = true,
  className = '',
}) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const rawId = useId();
  const uid = rawId.replace(/[^a-zA-Z0-9]/g, '');
  const width = 760;
  const padding = { top: 18, right: 18, bottom: 38, left: 58 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const { maxValue, pointsBySeries, xPositions, ticks } = useMemo(() => {
    const values = data.flatMap((point) =>
      series.map((item) => Number(point[item.key]) || 0),
    );
    const highest = Math.max(1, ...values);
    const roundedMax = Math.ceil(highest / 500) * 500;
    const max = roundedMax || 1;

    const x = data.map(
      (_, index) =>
        padding.left +
        (data.length === 1 ? chartWidth / 2 : (index / (data.length - 1)) * chartWidth),
    );

    const seriesPoints = Object.fromEntries(
      series.map((item) => [
        item.key,
        data.map((point, index) => ({
          x: x[index],
          y:
            padding.top +
            chartHeight -
            ((Number(point[item.key]) || 0) / max) * chartHeight,
        })),
      ]),
    );

    return {
      maxValue: max,
      pointsBySeries: seriesPoints,
      xPositions: x,
      ticks: [0, 0.25, 0.5, 0.75, 1].map((ratio) => ({
        ratio,
        value: max * ratio,
        y: padding.top + chartHeight - ratio * chartHeight,
      })),
    };
  }, [chartHeight, chartWidth, data, padding.left, padding.top, series]);

  const activePoint = activeIndex >= 0 ? data[activeIndex] : null;
  const activeX = activeIndex >= 0 ? xPositions[activeIndex] : 0;
  const minActiveY =
    activeIndex >= 0
      ? Math.min(
          ...series.map(
            (item) => pointsBySeries[item.key][activeIndex]?.y ?? height,
          ),
        )
      : 0;

  const labelStep = data.length > 8 ? 2 : 1;

  return (
    <div className={`trend-chart ${className}`}>
      {showLegend && (
        <div className="chart-legend" aria-hidden="true">
          {series.map((item) => (
            <span key={item.key}>
              <i style={{ background: item.color }} />
              {item.label}
            </span>
          ))}
        </div>
      )}

      <div className="trend-chart-canvas">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={`Gráfica de ${series.map((item) => item.label).join(' y ')}`}
          onMouseLeave={() => setActiveIndex(-1)}
        >
          <defs>
            {series.map((item) => (
              <linearGradient
                key={item.key}
                id={`gradient-${uid}-${item.key}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={item.color} stopOpacity="0.3" />
                <stop offset="100%" stopColor={item.color} stopOpacity="0" />
              </linearGradient>
            ))}
          </defs>

          {ticks.map((tick) => (
            <g key={tick.ratio}>
              <line
                x1={padding.left}
                x2={width - padding.right}
                y1={tick.y}
                y2={tick.y}
                className="chart-grid-line"
              />
              <text
                x={padding.left - 12}
                y={tick.y + 4}
                textAnchor="end"
                className="chart-axis-label"
              >
                {formatAxis ? formatAxis(tick.value) : tick.value}
              </text>
            </g>
          ))}

          {data.map((point, index) => {
            if (index % labelStep !== 0 && index !== data.length - 1) return null;
            return (
              <text
                key={`${point.label}-${index}`}
                x={xPositions[index]}
                y={height - 12}
                textAnchor="middle"
                className="chart-axis-label chart-x-label"
              >
                {point.label}
              </text>
            );
          })}

          {series.map((item) => {
            const points = pointsBySeries[item.key];
            const line = smoothPath(points);
            const area = `${line} L ${points[points.length - 1].x} ${
              padding.top + chartHeight
            } L ${points[0].x} ${padding.top + chartHeight} Z`;

            return (
              <g key={item.key}>
                <path
                  d={area}
                  fill={`url(#gradient-${uid}-${item.key})`}
                  className="chart-area"
                />
                <path
                  d={line}
                  fill="none"
                  stroke={item.color}
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  className="chart-line"
                />
                {series.length === 1 &&
                  points.map((point, index) => (
                    <circle
                      key={index}
                      cx={point.x}
                      cy={point.y}
                      r="3.2"
                      fill="#0b1728"
                      stroke={item.color}
                      strokeWidth="2"
                    />
                  ))}
              </g>
            );
          })}

          {activeIndex >= 0 && (
            <g>
              <line
                x1={activeX}
                x2={activeX}
                y1={padding.top}
                y2={padding.top + chartHeight}
                className="chart-active-line"
              />
              {series.map((item) => {
                const point = pointsBySeries[item.key][activeIndex];
                if (!point) return null;
                return (
                  <g key={item.key}>
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="7"
                      fill={item.color}
                      opacity="0.17"
                    />
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="4"
                      fill="#0b1728"
                      stroke={item.color}
                      strokeWidth="2.4"
                    />
                  </g>
                );
              })}
            </g>
          )}

          {data.map((point, index) => {
            const step = chartWidth / Math.max(1, data.length - 1);
            const barWidth = step;
            return (
              <rect
                key={`hover-${point.label}-${index}`}
                x={xPositions[index] - barWidth / 2}
                y={padding.top}
                width={barWidth}
                height={chartHeight}
                fill="transparent"
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                onClick={() => setActiveIndex(index)}
                tabIndex="-1"
              />
            );
          })}
        </svg>

        {activePoint && (
          <div
            className="chart-tooltip"
            style={{
              left: `${(activeX / width) * 100}%`,
              top: `${Math.max(2, ((minActiveY - 8) / height) * 100)}%`,
              transform: `translate(${
                activeIndex === 0
                  ? '0'
                  : activeIndex === data.length - 1
                    ? '-100%'
                    : '-50%'
              }, -100%)`,
            }}
          >
            <strong>{activePoint.fullLabel || activePoint.label}</strong>
            {series.map((item) => (
              <span key={item.key}>
                <i style={{ background: item.color }} />
                {item.label}
                <b>
                  {formatValue
                    ? formatValue(activePoint[item.key])
                    : activePoint[item.key]}
                </b>
              </span>
            ))}
          </div>
        )}
      </div>
      <span className="sr-only">
        Valor máximo del periodo: {formatAxis ? formatAxis(maxValue) : maxValue}
      </span>
    </div>
  );
}
