// Parser de CSV simples (sem dependências externas) para o modo "Meus dados".
// Suporta campos entre aspas com vírgulas/quebras de linha internas e aspas escapadas ("").

export const MIN_SERIES_POINTS = 18;

export function parseCSV(text) {
  const rows = [];
  let field = "";
  let row = [];
  let inQuotes = false;
  let i = 0;
  const len = text.length;

  while (i < len) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      field += c;
      i++;
      continue;
    }
    if (c === '"') {
      inQuotes = true;
      i++;
      continue;
    }
    if (c === ",") {
      row.push(field);
      field = "";
      i++;
      continue;
    }
    if (c === "\r") {
      i++;
      continue;
    }
    if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      i++;
      continue;
    }
    field += c;
    i++;
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  // Remove linhas totalmente vazias.
  return rows.filter((r) => !(r.length === 1 && r[0].trim() === ""));
}

/**
 * Lê um CSV com colunas `date` e `value` e retorna { labels, values }.
 * Lança um Error com mensagem amigável (em português) quando o arquivo é inválido.
 */
export function parseSeriesCSV(text) {
  const clean = String(text).replace(/^﻿/, ""); // remove BOM, se houver
  const rows = parseCSV(clean);

  if (rows.length < 2) {
    throw new Error("O arquivo CSV está vazio ou não tem linhas de dados além do cabeçalho.");
  }

  const header = rows[0].map((h) => h.trim().toLowerCase());
  const dateIdx = header.indexOf("date");
  const valueIdx = header.indexOf("value");

  if (dateIdx === -1 || valueIdx === -1) {
    throw new Error(
      `Cabeçalho inválido. É esperado ao menos as colunas "date" e "value". ` +
        `Colunas encontradas: ${rows[0].map((h) => h.trim()).join(", ") || "(nenhuma)"}.`
    );
  }

  const labels = [];
  const values = [];
  const errors = [];

  for (let r = 1; r < rows.length; r++) {
    const cols = rows[r];
    if (cols.every((c) => c.trim() === "")) continue; // linha em branco

    const rawDate = (cols[dateIdx] ?? "").trim();
    const rawValue = (cols[valueIdx] ?? "").trim();

    if (rawDate === "" || rawValue === "") {
      errors.push(`Linha ${r + 1}: faltando "date" ou "value".`);
      continue;
    }

    // Aceita "1234.5" (padrão) ou "1234,5" (vírgula decimal, sem separador de milhar).
    const normalized = rawValue.includes(",") && !rawValue.includes(".") ? rawValue.replace(",", ".") : rawValue;
    const num = Number(normalized);

    if (!Number.isFinite(num)) {
      errors.push(`Linha ${r + 1}: valor "${rawValue}" não é um número válido.`);
      continue;
    }

    labels.push(rawDate);
    values.push(num);
  }

  if (errors.length > 0) {
    const shown = errors.slice(0, 6).join("\n");
    const extra = errors.length > 6 ? `\n... e mais ${errors.length - 6} problema(s).` : "";
    throw new Error(`Foram encontrados problemas no CSV:\n${shown}${extra}`);
  }

  if (values.length < MIN_SERIES_POINTS) {
    throw new Error(
      `Série muito curta: são necessários ao menos ${MIN_SERIES_POINTS} pontos (meses) para treino/teste. ` +
        `Foram encontrados ${values.length}.`
    );
  }

  return { labels, values };
}

/** Gera um CSV de exemplo (dados fictícios) com o cabeçalho esperado e ~24 linhas. */
export function buildSampleCSV() {
  // Valores fictícios apenas para ilustrar o formato — não são dados reais de vendas.
  const base = [1200, 1250, 1300, 1180, 1220, 1260, 1300, 1350, 1400, 1600, 1900, 1500];
  const rows = ["date,value"];
  const start = new Date(2024, 0, 1);
  for (let i = 0; i < 24; i++) {
    const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
    const label = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const seasonal = base[i % 12];
    const trend = Math.round(i * 8);
    rows.push(`${label},${seasonal + trend}`);
  }
  return rows.join("\n") + "\n";
}

/** Dispara o download do CSV de exemplo no navegador. */
export function downloadSampleCSV(filename = "modelo-serie-temporal-exemplo.csv") {
  const csv = buildSampleCSV();
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
