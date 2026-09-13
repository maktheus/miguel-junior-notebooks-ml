# POC — Pipeline de modelagem preditiva do mercado de notebooks

Valida o pipeline descrito na metodologia: identificação de variáveis endógenas/exógenas
(inclui uma variável de câmbio simulada) → série temporal → comparação de modelos (naive,
naive sazonal, média móvel, regressão linear, Holt) por MAE/RMSE/MAPE/R² → previsão dos
próximos 12 meses.

**Dados:** série mensal 100% sintética (ciclo econômico + sazonalidade dupla de
"volta às aulas"/Black Friday + câmbio-proxy + ruído) — não são dados reais de
vendas/IDC/ABINEE.

Este projeto compartilha a mesma estrutura de pipeline do POC de
[Sandro Alves](../../sandro-alves-veiculos-eletricos-ml/poc) (previsão do mercado de VE
de duas rodas), com uma série sintética diferente e um modelo adicional (naive sazonal)
para ilustrar como a escolha do melhor modelo muda conforme o padrão da série.

## Como rodar

```bash
node forecast_market.js
```

Requer apenas Node.js (sem dependências externas).

## Próximo passo real

Substituir a série sintética (`series`) e a variável de câmbio (`fxRate`) pelos dados
reais de vendas (IDC/ABINEE/varejo) e variáveis exógenas (câmbio, PIB, renda) do estudo.
