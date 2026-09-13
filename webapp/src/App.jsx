import { useMemo, useState } from "react";
import { runPipeline } from "./lib/model";
import { LineSeriesChart, Legend } from "./components/Charts";

function monthLabel(i) {
  const start = new Date(2018, 0, 1);
  const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
  return d.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
}

export default function App() {
  const [seed, setSeed] = useState(2026);
  const sim = useMemo(() => runPipeline(seed), [seed]);

  const historyLen = sim.series.length;
  const forecastLen = sim.forecast12.length;
  const totalLen = historyLen + forecastLen;

  const historySeries = [...sim.series, ...Array(forecastLen).fill(null)];
  const forecastSeries = [...Array(historyLen - 1).fill(null), sim.series[historyLen - 1], ...sim.forecast12];

  const xLabels = Array.from({ length: totalLen }, (_, i) => monthLabel(i));

  const sortedModels = Object.entries(sim.results).sort((a, b) => a[1].rmse - b[1].rmse);

  return (
    <div className="app">
      <h1>Predição do Mercado Consumidor de Notebooks no Brasil</h1>
      <p className="subtitle">Miguel Caxias da Silva Junior · PPGEP/UFAM · Projeto de Qualificação</p>

      <div className="disclaimer">
        <strong>Série 100% sintética.</strong> Simula um mercado mais volátil que o de
        veículos elétricos (ciclo econômico de ~4 anos + sazonalidade dupla de
        "volta às aulas"/Black Friday + variável de câmbio-proxy), apenas para validar o
        pipeline de identificação de variáveis / treino / teste / avaliação da
        metodologia. Substituir pelos dados reais de vendas (IDC/ABINEE/varejo) e
        variáveis exógenas (câmbio, PIB, renda) do estudo.
      </div>

      <div className="card">
        <h2>Série histórica + previsão ({sim.bestModel})</h2>
        <Legend items={[
          { label: "Histórico (sintético)", color: "var(--accent)" },
          { label: "Previsão 12 meses", color: "#f59e0b" },
        ]} />
        <LineSeriesChart
          series={[
            { name: "Histórico", color: "var(--accent)", values: historySeries },
            { name: "Previsão", color: "#f59e0b", values: forecastSeries, dashed: true },
          ]}
          xLabels={xLabels}
          width={760}
        />
        <div style={{ marginTop: 12 }}>
          <button className="reroll" onClick={() => setSeed((s) => s + 1)}>
            Gerar nova série (seed {seed})
          </button>
        </div>
      </div>

      <div className="card">
        <h2>Comparação de modelos (conjunto de teste, últimos 12 meses)</h2>
        <table>
          <thead>
            <tr><th>Modelo</th><th>MAE</th><th>RMSE</th><th>MAPE %</th><th>R²</th></tr>
          </thead>
          <tbody>
            {sortedModels.map(([name, m]) => (
              <tr key={name} style={name === sim.bestModel ? { fontWeight: 700 } : undefined}>
                <td>{name}{name === sim.bestModel ? " ⭐" : ""}</td>
                <td>{m.mae.toFixed(1)}</td>
                <td>{m.rmse.toFixed(1)}</td>
                <td>{m.mape.toFixed(2)}</td>
                <td>{m.r2.toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 8 }}>
          Note como, neste mercado mais volátil, os modelos sazonais/simples tendem a
          superar a regressão linear — diferente do observado no mercado de VE de duas
          rodas (tendência mais monotônica). Isso ilustra por que a escolha do modelo deve
          ser reavaliada por série.
        </p>
      </div>

      <footer>
        POC acadêmica — PPGEP/UFAM. Substituir a série sintética e a variável de câmbio
        pelos dados reais e variáveis exógenas do estudo.
      </footer>
    </div>
  );
}
