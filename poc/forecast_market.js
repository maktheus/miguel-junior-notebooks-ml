/**
 * POC — Predição do mercado consumidor de notebooks no Brasil (aprendizado de máquina)
 *
 * Gera uma série temporal mensal SINTÉTICA (não são dados reais de vendas/IBGE/ABINEE)
 * simulando um mercado maduro e mais volátil que o de VE de duas rodas — com
 * sazonalidade de "volta às aulas" (jan/fev) e Black Friday (nov), influência de
 * câmbio (proxy) e reversões de tendência — e reproduz o pipeline descrito na
 * metodologia: identificação de variáveis, comparação de modelos preditivos por
 * MAE/RMSE/MAPE/R², e geração da previsão dos próximos 12 meses.
 *
 * Uso: node forecast_market.js
 */

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(2026);
function randNormal(mean, std) {
  const u1 = rand() || 1e-9, u2 = rand();
  return mean + Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2) * std;
}

// --- 1. Geração da série sintética (96 meses = jan/2018 a dez/2025) ---
// Variável exógena proxy: cotação USD/BRL (afeta custo de componentes importados)
const N_MONTHS = 96;
const fxRate = [];
let fx = 3.7;
for (let t = 0; t < N_MONTHS; t++) { fx += randNormal(0.01, 0.08); fxRate.push(Math.max(3, fx)); }

const series = [];
for (let t = 0; t < N_MONTHS; t++) {
  const month = t % 12;
  const cycle = 1400 + 300 * Math.sin((2 * Math.PI * t) / 48); // ciclo econômico de ~4 anos
  const backToSchool = (month === 0 || month === 1) ? 380 : 0;   // jan/fev
  const blackFriday = (month === 10) ? 420 : 0;                  // novembro
  const fxPenalty = -60 * (fxRate[t] - 3.7);                     // câmbio alto reduz vendas
  const noise = randNormal(0, 140);
  series.push(Math.max(0, Math.round(cycle + backToSchool + blackFriday + fxPenalty + noise)));
}

const TEST_SIZE = 12;
const train = series.slice(0, N_MONTHS - TEST_SIZE);
const test = series.slice(N_MONTHS - TEST_SIZE);

// --- 2. Modelos de previsão ---
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

// --- 3. Métricas de avaliação ---
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

const models = {
  "Naive (último valor)": forecastNaive(train, TEST_SIZE),
  "Naive Sazonal (mês análogo)": forecastSeasonalNaive(train, TEST_SIZE),
  "Média Móvel (janela=3)": forecastMovingAverage(train, TEST_SIZE),
  "Regressão Linear (tendência)": forecastLinearTrend(train, TEST_SIZE),
  "Holt (suavização exp. dupla)": forecastHoltLinear(train, TEST_SIZE),
};

console.log("=".repeat(78));
console.log("POC — Previsão do mercado consumidor de notebooks (série sintética, 96 meses)");
console.log("=".repeat(78));

const report = {};
let best = null;
for (const [name, preds] of Object.entries(models)) {
  const m = metrics(test, preds);
  report[name] = { MAE: m.mae.toFixed(1), RMSE: m.rmse.toFixed(1), "MAPE %": m.mape.toFixed(2), "R²": m.r2.toFixed(3) };
  if (!best || m.rmse < best.rmse) best = { name, rmse: m.rmse };
}
console.table(report);
console.log(`\nMelhor modelo no conjunto de teste (menor RMSE): ${best.name}`);
console.log(
  "\nNota: neste mercado mais volátil (ciclo econômico + câmbio + sazonalidade dupla),\n" +
  "espera-se que o Naive Sazonal e a Média Móvel superem a Regressão Linear simples —\n" +
  "diferente do observado no mercado de VE de duas rodas (tendência mais monotônica),\n" +
  "o que ilustra por que a escolha do modelo deve ser reavaliada por série."
);

console.log(
  "\nAVISO: série 100% sintética (ciclo + sazonalidade + câmbio-proxy + ruído), gerada\n" +
  "apenas para validar o pipeline de identificação de variáveis / treino / teste /\n" +
  "avaliação descrito na metodologia. Substituir `series` e `fxRate` pelos dados reais\n" +
  "de vendas (IDC/ABINEE/varejo) e variáveis exógenas (câmbio, PIB, renda) do estudo."
);
