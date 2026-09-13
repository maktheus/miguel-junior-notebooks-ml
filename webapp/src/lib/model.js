// Port do POC (poc/forecast_market.js) para uso no navegador (React).
// Série 100% sintética — ver README do projeto.

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const N_MONTHS = 96;
const TEST_SIZE = 12;

function generateSeries(seed) {
  const rand = mulberry32(seed);
  function randNormal(mean, std) {
    const u1 = rand() || 1e-9, u2 = rand();
    return mean + Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2) * std;
  }
  const fxRate = [];
  let fx = 3.7;
  for (let t = 0; t < N_MONTHS; t++) { fx += randNormal(0.01, 0.08); fxRate.push(Math.max(3, fx)); }

  const series = [];
  for (let t = 0; t < N_MONTHS; t++) {
    const month = t % 12;
    const cycle = 1400 + 300 * Math.sin((2 * Math.PI * t) / 48);
    const backToSchool = (month === 0 || month === 1) ? 380 : 0;
    const blackFriday = (month === 10) ? 420 : 0;
    const fxPenalty = -60 * (fxRate[t] - 3.7);
    const noise = randNormal(0, 140);
    series.push(Math.max(0, Math.round(cycle + backToSchool + blackFriday + fxPenalty + noise)));
  }
  return { series, fxRate };
}

function forecastNaive(train, horizon) {
  const last = train[train.length - 1];
  return Array(horizon).fill(last);
}
function forecastSeasonalNaive(train, horizon, season = 12) {
  const preds = [];
  for (let i = 0; i < horizon; i++) preds.push(train[train.length - season + (i % season)]);
  return preds;
}
function forecastMovingAverage(train, horizon, window = 3) {
  const preds = [];
  const hist = [...train];
  for (let i = 0; i < horizon; i++) {
    const w = hist.slice(-window);
    const avg = w.reduce((a, b) => a + b, 0) / w.length;
    preds.push(avg);
    hist.push(avg);
  }
  return preds;
}
function linearRegressionFit(y) {
  const n = y.length;
  const x = Array.from({ length: n }, (_, i) => i);
  const xMean = x.reduce((a, b) => a + b, 0) / n;
  const yMean = y.reduce((a, b) => a + b, 0) / n;
  let num = 0, den = 0;
  for (let i = 0; i < n; i++) { num += (x[i] - xMean) * (y[i] - yMean); den += (x[i] - xMean) ** 2; }
  const slope = num / den;
  const intercept = yMean - slope * xMean;
  return { slope, intercept };
}
function forecastLinearTrend(train, horizon) {
  const { slope, intercept } = linearRegressionFit(train);
  const preds = [];
  for (let i = 0; i < horizon; i++) preds.push(intercept + slope * (train.length + i));
  return preds;
}
function forecastHoltLinear(train, horizon, alpha = 0.4, beta = 0.2) {
  let level = train[0];
  let trend = train[1] - train[0];
  for (let i = 1; i < train.length; i++) {
    const lastLevel = level;
    level = alpha * train[i] + (1 - alpha) * (level + trend);
    trend = beta * (level - lastLevel) + (1 - beta) * trend;
  }
  const preds = [];
  for (let h = 1; h <= horizon; h++) preds.push(level + h * trend);
  return preds;
}

export const MODEL_FNS = {
  "Naive (último valor)": forecastNaive,
  "Naive Sazonal (mês análogo)": forecastSeasonalNaive,
  "Média Móvel (janela=3)": forecastMovingAverage,
  "Regressão Linear (tendência)": forecastLinearTrend,
  "Holt (suavização exp. dupla)": forecastHoltLinear,
};

function metrics(actual, predicted) {
  const n = actual.length;
  const errors = actual.map((a, i) => a - predicted[i]);
  const mae = errors.reduce((s, e) => s + Math.abs(e), 0) / n;
  const rmse = Math.sqrt(errors.reduce((s, e) => s + e * e, 0) / n);
  const mape = (errors.reduce((s, e, i) => s + Math.abs(e / actual[i]), 0) / n) * 100;
  const meanActual = actual.reduce((a, b) => a + b, 0) / n;
  const ssTot = actual.reduce((s, a) => s + (a - meanActual) ** 2, 0);
  const ssRes = errors.reduce((s, e) => s + e * e, 0);
  const r2 = 1 - ssRes / ssTot;
  return { mae, rmse, mape, r2 };
}

export function runPipeline(seed = 2026) {
  const { series, fxRate } = generateSeries(seed);
  const train = series.slice(0, N_MONTHS - TEST_SIZE);
  const test = series.slice(N_MONTHS - TEST_SIZE);

  const results = {};
  let best = null;
  for (const [name, fn] of Object.entries(MODEL_FNS)) {
    const preds = fn(train, TEST_SIZE);
    const m = metrics(test, preds);
    results[name] = { preds, ...m };
    if (!best || m.rmse < best.rmse) best = { name, rmse: m.rmse };
  }

  const forecast12 = MODEL_FNS[best.name](series, 12);

  return { series, fxRate, train, test, results, bestModel: best.name, forecast12 };
}
