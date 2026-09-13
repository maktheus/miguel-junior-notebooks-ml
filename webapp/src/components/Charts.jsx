// Primitivas de gráfico em SVG puro (sem dependências externas de chart lib).

export function BarCompareChart({ data, width = 640, height = 260, formatValue }) {
  // data: [{ label, before, after, unit }]
  const padding = { top: 20, right: 20, bottom: 50, left: 56 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;
  const groupW = innerW / data.length;
  const barW = groupW * 0.32;
  const maxVal = Math.max(...data.flatMap((d) => [d.before, d.after])) * 1.15 || 1;
  const y = (v) => padding.top + innerH - (v / maxVal) * innerH;
  const barH = (v) => (v / maxVal) * innerH;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto", maxWidth: width, display: "block" }}
      role="img" aria-label="Gráfico comparativo antes e depois">
      <line x1={padding.left} y1={padding.top} x2={padding.left} y2={padding.top + innerH} stroke="var(--axis)" />
      <line x1={padding.left} y1={padding.top + innerH} x2={width - padding.right} y2={padding.top + innerH} stroke="var(--axis)" />
      {data.map((d, i) => {
        const cx = padding.left + groupW * i + groupW / 2;
        return (
          <g key={d.label}>
            <rect x={cx - barW - 4} y={y(d.before)} width={barW} height={barH(d.before)} fill="var(--before)" rx={3} />
            <rect x={cx + 4} y={y(d.after)} width={barW} height={barH(d.after)} fill="var(--after)" rx={3} />
            <text x={cx} y={padding.top + innerH + 18} textAnchor="middle" fontSize="11" fill="var(--text-muted)">
              {d.label}
            </text>
            <text x={cx - barW / 2 - 4} y={y(d.before) - 6} textAnchor="middle" fontSize="10" fill="var(--text)">
              {formatValue ? formatValue(d.before) : d.before.toFixed(1)}
            </text>
            <text x={cx + barW / 2 + 4} y={y(d.after) - 6} textAnchor="middle" fontSize="10" fill="var(--text)">
              {formatValue ? formatValue(d.after) : d.after.toFixed(1)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function LineSeriesChart({ series, width = 720, height = 300, xLabels }) {
  // series: [{ name, color, values: number[], dashed?: boolean }]
  const padding = { top: 20, right: 20, bottom: 30, left: 56 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;
  const allValues = series.flatMap((s) => s.values.filter((v) => v != null));
  const maxVal = Math.max(...allValues) * 1.1;
  const minVal = Math.min(0, Math.min(...allValues) * 0.9);
  const n = Math.max(...series.map((s) => s.values.length));
  const x = (i) => padding.left + (i / (n - 1)) * innerW;
  const y = (v) => padding.top + innerH - ((v - minVal) / (maxVal - minVal)) * innerH;

  function pathFor(values) {
    let d = "";
    values.forEach((v, i) => {
      if (v == null) return;
      d += (d === "" ? "M" : "L") + x(i) + "," + y(v) + " ";
    });
    return d.trim();
  }

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto", maxWidth: width, display: "block" }}
      role="img" aria-label="Série temporal">
      <line x1={padding.left} y1={padding.top} x2={padding.left} y2={padding.top + innerH} stroke="var(--axis)" />
      <line x1={padding.left} y1={padding.top + innerH} x2={width - padding.right} y2={padding.top + innerH} stroke="var(--axis)" />
      {series.map((s) => (
        <path key={s.name} d={pathFor(s.values)} fill="none" stroke={s.color} strokeWidth={2}
          strokeDasharray={s.dashed ? "5,4" : undefined} />
      ))}
      {xLabels && xLabels.map((lab, i) => (
        i % Math.ceil(n / 8) === 0 ? (
          <text key={i} x={x(i)} y={padding.top + innerH + 16} fontSize="10" textAnchor="middle" fill="var(--text-muted)">
            {lab}
          </text>
        ) : null
      ))}
    </svg>
  );
}

export function Legend({ items }) {
  return (
    <div className="legend">
      {items.map((it) => (
        <span key={it.label} className="legend-item">
          <span className="legend-swatch" style={{ background: it.color }} />
          {it.label}
        </span>
      ))}
    </div>
  );
}
