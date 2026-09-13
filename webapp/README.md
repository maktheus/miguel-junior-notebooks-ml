# Dashboard React — Predição do Mercado de Notebooks

Aplicação React (Vite + React DOM) que visualiza o pipeline do
[`poc/forecast_market.js`](../poc/forecast_market.js): série histórica sintética
(mercado mais volátil, com ciclo econômico + sazonalidade dupla + câmbio-proxy),
previsão dos próximos 12 meses e tabela comparativa de 5 modelos por MAE/RMSE/MAPE/R².

**Dados 100% sintéticos** — ver aviso no próprio dashboard e no README do projeto.

## Como rodar

```bash
npm install
npm run dev
```

## Build de produção

```bash
npm run build
```

## Stack

- React 19 + React DOM
- Vite 8
- Gráficos em SVG puro — ver `src/components/Charts.jsx`
