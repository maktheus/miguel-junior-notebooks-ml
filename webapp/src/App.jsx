import { useMemo, useRef, useState } from "react";
import { runPipeline } from "./lib/model";
import { parseSeriesCSV, downloadSampleCSV, MIN_SERIES_POINTS } from "./lib/csv";
import { LineSeriesChart, Legend } from "./components/Charts";

function monthLabel(i) {
  const start = new Date(2018, 0, 1);
  const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
  return d.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
}

function ModelResultsCard({ sim, title, xLabels }) {
  const historyLen = sim.series.length;
  const forecastLen = sim.forecast12.length;
  const totalLen = historyLen + forecastLen;

  const historySeries = [...sim.series, ...Array(forecastLen).fill(null)];
  const forecastSeries = [...Array(historyLen - 1).fill(null), sim.series[historyLen - 1], ...sim.forecast12];

  const sortedModels = Object.entries(sim.results).sort((a, b) => a[1].rmse - b[1].rmse);

  return (
    <>
      <div className="card">
        <h2>{title} ({sim.bestModel})</h2>
        <Legend items={[
          { label: "Histórico", color: "var(--accent)" },
          { label: `Previsão ${forecastLen} ${forecastLen === 1 ? "período" : "períodos"}`, color: "#f59e0b" },
        ]} />
        <LineSeriesChart
          series={[
            { name: "Histórico", color: "var(--accent)", values: historySeries },
            { name: "Previsão", color: "#f59e0b", values: forecastSeries, dashed: true },
          ]}
          xLabels={xLabels ?? Array.from({ length: totalLen }, (_, i) => monthLabel(i))}
          width={760}
        />
      </div>

      <div className="card">
        <h2>Comparação de modelos (conjunto de teste, últimos {sim.testSize} {sim.testSize === 1 ? "ponto" : "pontos"})</h2>
        {sim.seasonalSkipped && (
          <p style={{ fontSize: "0.85rem", color: "var(--warn-text)", background: "var(--warn-bg)", border: "1px solid var(--warn-border)", borderRadius: 8, padding: "8px 12px", marginTop: 0 }}>
            O modelo "Naive Sazonal (mês análogo)" foi <strong>omitido</strong> desta comparação: ele
            precisa de pelo menos 24 pontos (2 ciclos anuais completos) na série para funcionar de forma
            confiável, e esta série tem {sim.series.length}.
          </p>
        )}
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
                <td>{Number.isFinite(m.mape) ? m.mape.toFixed(2) : "—"}</td>
                <td>{Number.isFinite(m.r2) ? m.r2.toFixed(3) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function ExampleMode() {
  const [seed, setSeed] = useState(2026);
  const sim = useMemo(() => runPipeline(seed), [seed]);

  return (
    <>
      <div className="disclaimer">
        <strong>Série 100% sintética.</strong> Simula um mercado mais volátil que o de
        veículos elétricos (ciclo econômico de ~4 anos + sazonalidade dupla de
        "volta às aulas"/Black Friday + variável de câmbio-proxy), apenas para validar o
        pipeline de identificação de variáveis / treino / teste / avaliação da
        metodologia. Substituir pelos dados reais de vendas (IDC/ABINEE/varejo) e
        variáveis exógenas (câmbio, PIB, renda) do estudo.
      </div>

      <ModelResultsCard sim={sim} title="Série histórica + previsão" />

      <div className="card">
        <div style={{ marginTop: 0 }}>
          <button className="reroll" onClick={() => setSeed((s) => s + 1)}>
            Gerar nova série (seed {seed})
          </button>
        </div>
        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 12, marginBottom: 0 }}>
          Note como, neste mercado mais volátil, os modelos sazonais/simples tendem a
          superar a regressão linear — diferente do observado no mercado de VE de duas
          rodas (tendência mais monotônica). Isso ilustra por que a escolha do modelo deve
          ser reavaliada por série.
        </p>
      </div>
    </>
  );
}

function CustomMode() {
  const [data, setData] = useState(null); // { labels, values, fileName }
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const sim = useMemo(() => {
    if (!data) return null;
    try {
      return runPipeline(undefined, { values: data.values, labels: data.labels });
    } catch {
      return null;
    }
  }, [data]);

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result ?? "");
        const parsed = parseSeriesCSV(text);
        setData({ ...parsed, fileName: file.name });
      } catch (err) {
        setData(null);
        setError(err.message || String(err));
      }
    };
    reader.onerror = () => {
      setData(null);
      setError("Não foi possível ler o arquivo selecionado.");
    };
    reader.readAsText(file);
    // Permite reenviar o mesmo arquivo (ex.: depois de corrigi-lo) disparando onChange de novo.
    e.target.value = "";
  }

  const xLabels = useMemo(() => {
    if (!sim) return null;
    const historyLabels = sim.labels && sim.labels.length === sim.series.length
      ? sim.labels
      : sim.series.map((_, i) => `#${i + 1}`);
    const forecastLabels = Array.from({ length: sim.forecast12.length }, (_, i) => `+${i + 1}`);
    return [...historyLabels, ...forecastLabels];
  }, [sim]);

  return (
    <>
      <div className="disclaimer">
        <strong>Modo "Meus dados".</strong> Suba um CSV com sua própria série histórica
        (por ex. vendas mensais de notebooks) e o mesmo pipeline de comparação de modelos
        (naive, naive sazonal, média móvel, regressão linear, Holt) roda em cima dela.
      </div>

      <div className="card">
        <h2>Upload de CSV</h2>
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
          Formato esperado: colunas <code>date</code> (rótulo do período, ex. "2024-01") e{" "}
          <code>value</code> (número). Mínimo de {MIN_SERIES_POINTS} pontos (meses). Para o
          modelo sazonal ser incluído, são necessários pelo menos 24 pontos (2 ciclos anuais).
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={handleFile}
          />
          <button className="reroll" onClick={() => downloadSampleCSV()}>
            Baixar modelo CSV
          </button>
        </div>
        {data && !error && (
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: 12, marginBottom: 0 }}>
            Arquivo carregado: <strong>{data.fileName}</strong> — {data.values.length} pontos.
          </p>
        )}
        {error && (
          <pre style={{
            whiteSpace: "pre-wrap",
            fontSize: "0.85rem",
            color: "var(--warn-text)",
            background: "var(--warn-bg)",
            border: "1px solid var(--warn-border)",
            borderRadius: 8,
            padding: "10px 12px",
            marginTop: 12,
            marginBottom: 0,
          }}>
            {error}
          </pre>
        )}
      </div>

      {sim && (
        <ModelResultsCard sim={sim} title="Série carregada + previsão" xLabels={xLabels} />
      )}
    </>
  );
}

export default function App() {
  const [mode, setMode] = useState("example"); // "example" | "custom"

  return (
    <div className="app">
      <h1>Predição do Mercado Consumidor de Notebooks no Brasil</h1>
      <p className="subtitle">Miguel Caxias da Silva Junior · PPGEP/UFAM · Projeto de Qualificação</p>

      <div className="tabs">
        <button
          className={"tab" + (mode === "example" ? " tab-active" : "")}
          onClick={() => setMode("example")}
        >
          Exemplo (série sintética)
        </button>
        <button
          className={"tab" + (mode === "custom" ? " tab-active" : "")}
          onClick={() => setMode("custom")}
        >
          Meus dados (CSV)
        </button>
      </div>

      {mode === "example" ? <ExampleMode /> : <CustomMode />}

      <footer>
        POC acadêmica — PPGEP/UFAM. No modo exemplo, substituir a série sintética e a
        variável de câmbio pelos dados reais e variáveis exógenas do estudo; no modo
        "Meus dados", basta subir o CSV com a série real.
      </footer>
    </div>
  );
}
