# Dashboard React — Predição do Mercado de Notebooks

Aplicação React (Vite + React DOM) que visualiza o pipeline do
[`poc/forecast_market.js`](../poc/forecast_market.js): série histórica,
previsão dos próximos períodos e tabela comparativa de 5 modelos
(naive, naive sazonal, média móvel, regressão linear, Holt) por MAE/RMSE/MAPE/R².

O dashboard tem dois modos, alternados por abas no topo:

- **Exemplo (série sintética)** — comportamento original: gera 96 meses de uma
  série 100% sintética (mercado mais volátil, com ciclo econômico + sazonalidade
  dupla de "volta às aulas"/Black Friday + variável de câmbio-proxy), apenas para
  validar o pipeline de identificação de variáveis / treino / teste / avaliação
  da metodologia.
- **Meus dados (CSV)** — modo MVP: o usuário sobe a própria série temporal (ex.
  vendas mensais de notebooks) e o mesmo pipeline de comparação de modelos roda
  sobre essa série real.

## Modo "Meus dados" — formato do CSV

O arquivo deve ter cabeçalho com (pelo menos) duas colunas, em qualquer ordem:

```csv
date,value
2024-01,1200
2024-02,1250
2024-03,1300
...
```

- `date`: rótulo do período (texto livre, ex. "2024-01", "jan/2024" — usado só
  como label do eixo X, não é parseado como data real).
- `value`: número. Aceita ponto ou vírgula como separador decimal
  (ex. `1234.5` ou `1234,5`).

Use o botão **"Baixar modelo CSV"** na aba "Meus dados" para baixar um arquivo
de exemplo já no formato correto, com ~24 linhas de dados **fictícios** (apenas
para ilustrar o formato — não são vendas reais).

### Requisitos mínimos e validações

- Mínimo de **18 pontos** (meses) na série — abaixo disso o upload é rejeitado
  com uma mensagem explicando o motivo.
- O split treino/teste é automático: os últimos ~20% dos pontos viram o
  conjunto de teste, com piso de 3 e teto de 12 pontos.
- Erros de formato (coluna `date` ou `value` faltando, valores não numéricos,
  linhas incompletas) são reportados na tela, apontando a linha problemática,
  em vez de quebrar o dashboard.

### Naive Sazonal com séries curtas

O modelo "Naive Sazonal (mês análogo)" assume um ciclo anual de 12 meses e só é
confiável com pelo menos **24 pontos** (2 ciclos completos) na série. Se a
série enviada tiver menos de 24 pontos, esse modelo é **omitido** automaticamente
da comparação (os demais 4 modelos continuam rodando normalmente), e um aviso é
exibido no dashboard explicando a omissão.

**Dados sintéticos no modo Exemplo** — ver aviso no próprio dashboard e no README do projeto.
Nenhum dado real de vendas (IDC/ABINEE/varejo) está embutido no dashboard; o
modo "Meus dados" existe justamente para o usuário final plugar seus próprios
números quando os tiver.

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
- Parsing de CSV implementado sem dependências novas — ver `src/lib/csv.js`
