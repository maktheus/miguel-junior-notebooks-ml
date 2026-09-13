> **Rascunho de apoio gerado para revisão do orientador/aluno antes de incorporar ao texto da qualificação — não é texto final.**

# Plano de próximos passos — do protótipo sintético ao estudo de caso real

Este documento organiza, em fases, o backlog de tarefas necessárias para evoluir o
projeto de Miguel Caxias da Silva Junior a partir do estado atual — protótipo (POC) e
dashboard construídos sobre uma série **100% sintética** (ver `poc/README.md` e
`webapp/README.md`) — em direção ao estudo de caso real sobre o mercado consumidor de
notebooks no Brasil e seu impacto no planejamento de produção do Polo Industrial de Manaus
(PIM). As fases seguem uma lógica de dependência: dados reais precisam existir antes da
remodelagem; a remodelagem precisa estar validada antes da validação com o PIM e da
redação final.

## Fase 1 — Dados

1. **Levantar dados reais de vendas de notebooks.**
   Buscar séries históricas de vendas/mercado consumidor de notebooks no Brasil junto a
   fontes como IDC Brasil, ABINEE, GfK/Circana, ou por meio de parceria direta com
   fabricantes instalados no PIM. Esta é a substituição mais importante em relação ao
   protótipo atual, que usa uma série sintética.

2. **Mapear e obter séries reais das variáveis exógenas.**
   Identificar e coletar séries históricas de câmbio USD/BRL, PIB/renda (IBGE) e índices de
   confiança do consumidor (FGV/CNI), hoje representadas de forma simulada no protótipo
   (variável `fxRate`). Essas variáveis são as candidatas naturais a variáveis exógenas do
   modelo, conforme já indicado nos objetivos específicos do projeto.

## Fase 2 — Modelagem real

3. **Reimplementar o pipeline em Python.**
   Portar a lógica atual do protótipo em Node.js (`poc/forecast_market.js`) para um
   pipeline em Python, usando bibliotecas como pandas, scikit-learn, statsmodels,
   PyTorch ou Prophet, já preparado para consumir dados reais em vez da série sintética.

4. **Validar a qualidade dos dados reais antes do re-treino.**
   Checar outliers, padrões de sazonalidade e possíveis quebras estruturais nas séries
   reais coletadas (vendas e variáveis exógenas) antes de treinar ou comparar modelos —
   etapa que não existe no protótipo sintético, onde os dados são gerados de forma
   controlada.

5. **Definir e documentar o protocolo de validação temporal.**
   Especificar formalmente o esquema de validação a ser usado (walk-forward / rolling
   origin), evitando vazamento temporal de informação e garantindo que a comparação de
   modelos (MAE/RMSE/MAPE/R², já usada no protótipo) seja metodologicamente defensável
   para uma dissertação.

6. **Revisar a POC/dashboard à luz do achado de Elalem et al. (2023).**
   Elalem, Maier e Seifert (2023) mostram que um ARIMAX simples supera DNNs em dados
   limpos, mas que DNNs são mais robustas a ruído (ver `docs/revisao-literatura.md`, Seção
   1). Como dados reais tendem a ser mais ruidosos que a série sintética atual, essa
   comparação deve orientar quais modelos priorizar na Fase 2 e como interpretar as
   métricas de acurácia obtidas.

## Fase 3 — Validação com o PIM e redação

7. **Entrevistar equipes de S&OP/planejamento de 2-3 empresas do PIM.**
   Levantar, com equipes de Sales & Operations Planning (S&OP) ou de planejamento de
   produção de empresas do polo, como uma previsão de demanda de notebooks seria
   efetivamente consumida na prática — insumo qualitativo para validar a utilidade real do
   modelo além das métricas de acurácia.

8. **Validar a revisão de literatura já redigida.**
   Confirmar que `docs/revisao-literatura.md` mantém os dois TCCs (Ermelindo, 2025; Gullo,
   2025) claramente marcados como trabalhos correlatos locais, e não como base teórica
   principal do projeto — o texto já foi redigido nesse formato; esta tarefa é apenas de
   revisão/validação pelo orientando e orientador.

9. **Buscar artigos revisados por pares sobre câmbio e importação de eletrônicos no
   Brasil.**
   A revisão de literatura atual identificou explicitamente a ausência de fontes
   acadêmicas específicas sobre o efeito da variação cambial na demanda de eletrônicos
   importados no país (lacuna registrada em `docs/revisao-literatura.md`). Buscar 2-3
   artigos revisados por pares sobre o tema para preencher essa lacuna antes da versão
   final da qualificação.

10. **Confirmar o DOI de Elalem, Maier e Seifert (2023).**
    O DOI dessa referência não foi confirmado com certeza durante o levantamento atual
    (marcado como "DOI a confirmar" em `docs/revisao-literatura.md`). Verificar o DOI
    correto em uma base como o Crossref antes de finalizar o texto de qualificação.

## Regra de trabalho

Nenhuma etapa deste plano deve ser executada com dados, resultados ou afirmações
inventados. Onde uma fonte, um dado real ou uma confirmação (DOI, autoria completa) ainda
não existir, isso deve permanecer explicitamente sinalizado como pendente — como já feito
em `docs/revisao-literatura.md` — até que seja de fato levantado ou verificado.
