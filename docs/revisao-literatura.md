> **Rascunho de apoio gerado para revisão do orientador/aluno antes de incorporar ao texto da qualificação — não é texto final.**

# Revisão de literatura — Aprendizado de máquina na previsão do mercado consumidor de notebooks

Este documento reúne, em prosa acadêmica com citação no formato ABNT, as fontes
levantadas até o momento para fundamentar a discussão teórica do projeto de
qualificação de Miguel Caxias da Silva Junior (PPGEP/UFAM), cujo objetivo geral é propor
uma aplicação de técnicas de aprendizado de máquina para a previsão da demanda do mercado
consumidor de notebooks no Brasil, com ênfase no apoio ao planejamento de produção das
indústrias do Polo Industrial de Manaus (PIM). O texto está organizado em três blocos: (i)
previsão de demanda de eletrônicos de consumo com aprendizado de máquina; (ii) comparação
entre séries temporais clássicas e ML aplicadas a varejo/tecnologia; e (iii) trabalhos
correlatos produzidos localmente sobre o PIM. Ao final, é registrada uma lacuna de
literatura identificada durante o levantamento e a lista de referências em formato ABNT.

Importante: todas as afirmações abaixo se apoiam exclusivamente nas seis fontes
verificadas fornecidas para esta revisão. Nenhuma citação, dado ou conclusão foi
adicionada além do que essas fontes permitem sustentar.

## 1. Previsão de demanda de eletrônicos de consumo e produtos sazonais com aprendizado de máquina

A aplicação de aprendizado de máquina à previsão de vendas de produtos de consumo tem
sido investigada sob diferentes recortes — geral, sazonal e de produtos de ciclo de vida
curto —, o que é diretamente relevante para o caso dos notebooks, um bem de consumo
tecnológico sujeito tanto a sazonalidade (datas comerciais, período letivo) quanto a
obsolescência relativamente rápida.

PAVLYSHENKO (2019) avalia modelos de aprendizado de máquina para previsão de séries
temporais de vendas, comparando o desempenho preditivo de diferentes abordagens sobre
dados de vendas no varejo. O estudo é relevante para o projeto de Miguel Junior porque
oferece um ponto de partida metodológico para a etapa de identificação e comparação de
modelos de ML aplicados a séries de vendas, um dos objetivos específicos do projeto
(avaliar e comparar modelos de aprendizado de máquina quanto à acurácia das estimativas de
demanda).

ENSAFI et al. (2022) realizam uma análise comparativa de modelos de aprendizado de
máquina especificamente para a previsão de vendas de itens sazonais, contrastando o
desempenho desses modelos frente a abordagens tradicionais de séries temporais. A
sazonalidade tratada pelos autores — picos de vendas associados a períodos específicos do
ano — dialoga com o padrão de demanda de notebooks no Brasil, tipicamente marcado por
picos em datas como volta às aulas e Black Friday, conforme já modelado de forma sintética
no protótipo (POC) do próprio projeto. O trabalho reforça a necessidade de comparar
múltiplos modelos (e não adotar um único método a priori) antes de eleger o mais adequado
para dados reais de vendas de notebooks.

ELALEM, MAIER e SEIFERT (2023) propõem um framework baseado em aprendizado de máquina —
com redes neurais profundas (DNNs) — para a previsão de vendas de novos produtos com ciclo
de vida curto, characterística central de produtos de tecnologia de consumo, entre eles os
notebooks. O achado central dos autores é particularmente relevante para a discussão
metodológica do projeto: em dados "limpos" (sem ruído significativo), um modelo ARIMAX
simples supera as DNNs em acurácia; entretanto, as DNNs se mostram mais robustas quando os
dados contêm ruído. Esse resultado tem implicação direta para o planejamento de produção
no PIM, pois dados reais de vendas e variáveis exógenas (câmbio, renda, confiança do
consumidor) tendem a ser mais ruidosos do que séries controladas em laboratório — o que
sugere que a escolha do modelo mais adequado para o estudo de caso não deve ser decidida
apenas pela acurácia em condições ideais, mas também pela robustez a ruído observada nos
dados reais que ainda serão coletados. Registra-se aqui que o DOI desta referência não foi
confirmado com certeza durante o levantamento e deve ser validado em base como o Crossref
antes da versão final do texto de qualificação (ver `docs/plano-proximos-passos.md`).

## 2. Séries temporais clássicas versus aprendizado de máquina no varejo e em tecnologia

Um segundo eixo de discussão relevante para o projeto é a comparação entre métodos
estatísticos clássicos de séries temporais e métodos de aprendizado de máquina, tema que
perpassa diretamente o objetivo específico de "comparar o desempenho dos modelos
preditivos quanto à acurácia das estimativas de demanda".

HOBOR et al. (2025) apresentam uma análise comparativa de modelos modernos de aprendizado
de máquina aplicados à previsão de vendas no varejo, contribuindo com evidências recentes
sobre o desempenho relativo de diferentes arquiteturas de ML no contexto varejista. Esse
trabalho serve de referência atualizada para balizar a escolha do conjunto de modelos a
serem testados no estudo de caso de Miguel Junior, complementando os achados de Pavlyshenko
(2019) com uma perspectiva mais recente sobre o estado da arte em modelos de ML para
varejo.

Combinado ao achado de Elalem, Maier e Seifert (2023) sobre a superioridade do ARIMAX
simples em dados limpos frente às DNNs, e à robustez destas últimas sob ruído, o conjunto
de referências desta seção sustenta uma postura metodológica cautelosa: a comparação de
modelos no projeto não deve pressupor que modelos de ML mais complexos superam
automaticamente abordagens estatísticas clássicas — a decisão deve ser empírica e apoiada
nas métricas de acurácia (MAE, RMSE, MAPE, R², já adotadas no protótipo do projeto) sobre
os dados reais que vierem a ser coletados, e não apenas sobre dados sintéticos ou
idealizados.

## 3. Trabalhos correlatos locais sobre previsão de demanda no Polo Industrial de Manaus

Dois trabalhos de conclusão de curso (TCC) foram identificados como correlatos por
tratarem, especificamente, de previsão de demanda associada ao contexto industrial da
Zona Franca de Manaus/PIM ou a problemas de planejamento de produção com ML. É importante
frisar que ambos são trabalhos de graduação, não artigos revisados por pares publicados em
periódico — por isso são tratados aqui como trabalhos correlatos locais, e não como base
teórica principal do projeto de mestrado.

ERMELINDO (2025), em TCC de Bacharelado em Administração pela UFAM, realiza um estudo de
caso sobre previsão de demanda no Polo Industrial de Manaus utilizando regressão linear.
Os resultados reportados pelo autor indicam coeficientes de determinação (R²) baixos —
0,40 e 0,27 —, o que evidencia a limitação de um modelo linear simples para capturar a
dinâmica de demanda no contexto do PIM. Por se tratar da mesma localidade (PIM) e da mesma
instituição (UFAM) do projeto de Miguel Junior, esse trabalho é especialmente relevante
como justificativa empírica local para a proposta de aplicar técnicas de aprendizado de
máquina mais sofisticadas do que a regressão linear simples: os baixos R² relatados por
Ermelindo (2025) reforçam, em contexto próximo ao do estudo de caso, a motivação central do
projeto de qualificação de que modelos mais avançados podem melhorar a acurácia da previsão
de demanda no PIM.

GULLO (2025), em TCC de Ciência da Computação pela UNESP Bauru, aplica aprendizado de
máquina — com uma abordagem baseada em LSTM incorporando sazonalidade e variáveis exógenas
— à resolução conjunta do problema de corte unidimensional com sobras aproveitáveis e à
predição de demanda. Embora o contexto de aplicação (otimização de corte) seja distinto do
mercado consumidor de notebooks, o trabalho é relevante metodologicamente por demonstrar,
em um TCC brasileiro recente, o uso de redes neurais recorrentes (LSTM) com variáveis
exógenas para predição de demanda — uma arquitetura que pode ser considerada entre os
modelos a serem comparados no estudo de caso do PIM, ao lado das abordagens estatísticas
clássicas e de ML mais simples discutidas na Seção 2.

## Lacuna identificada

Durante o levantamento realizado para esta revisão, **não foi encontrada nenhuma fonte
acadêmica específica sobre o efeito da variação cambial (câmbio USD/BRL) na demanda de
eletrônicos importados no Brasil**, tema diretamente relevante para o projeto, uma vez que
o câmbio é uma das variáveis exógenas centrais na modelagem da demanda de notebooks
discutida no protótipo (POC) do projeto (variável `fxRate`, atualmente simulada). Essa
lacuna deve ser tratada como um ponto em aberto e não deve ser preenchida com suposições:
recomenda-se a busca ativa de artigos revisados por pares sobre o tema antes da redação
final da qualificação (ver item correspondente em `docs/plano-proximos-passos.md`).

## Síntese

As fontes revisadas convergem para três conclusões que orientam diretamente a
continuidade metodológica do projeto de Miguel Junior: (i) há evidência consolidada, em
múltiplos estudos, de que modelos de aprendizado de máquina podem ser comparados de forma
sistemática a métodos estatísticos clássicos na previsão de vendas de varejo e de produtos
sazonais/de ciclo curto (PAVLYSHENKO, 2019; ENSAFI et al., 2022; HOBOR et al., 2025); (ii)
a superioridade de modelos mais complexos (DNNs, LSTM) não é incondicional — ela depende da
qualidade e do nível de ruído dos dados, o que deve pesar na escolha e na validação dos
modelos a serem testados com dados reais do estudo de caso (ELALEM; MAIER; SEIFERT, 2023);
e (iii) há evidência empírica local, ainda que em nível de TCC e não de artigo revisado por
pares, de que modelos simples (regressão linear) apresentam desempenho limitado no
contexto específico do PIM, o que reforça a justificativa do projeto para investigar
técnicas de ML mais sofisticadas (ERMELINDO, 2025; GULLO, 2025). Por fim, a ausência de
literatura específica sobre o efeito do câmbio na demanda de eletrônicos importados no
Brasil permanece como lacuna a ser endereçada antes da versão final do texto de
qualificação.

## Referências (ABNT)

ELALEM, Yehia Khaled; MAIER, Christian; SEIFERT, Ralf W. A machine learning-based
framework for forecasting sales of new products with short life cycles using deep neural
networks. **International Journal of Forecasting**, v. 39, n. 4, p. 1874-1894, 2023. DOI a
confirmar.

ENSAFI, Yasaman; AMIN, Saman Hassanzadeh; ZHANG, Yun; SHAH, Bharat. Time-series
forecasting of seasonal items sales using machine learning – A comparative analysis.
**International Journal of Information Management Data Insights**, v. 2, n. 1, art.
100058, 2022. DOI: 10.1016/j.jjimei.2022.100058.

ERMELINDO, [nome completo conforme registro institucional]. **Previsão de demanda
utilizando regressão linear: um estudo de caso no Polo Industrial de Manaus**. 2025.
Trabalho de Conclusão de Curso (Bacharelado em Administração) — Universidade Federal do
Amazonas, Manaus, 2025. Disponível em: https://riu.ufam.edu.br/handle/prefix/9117. [Trabalho
de conclusão de curso — não é artigo revisado por pares; citado como trabalho correlato
local.]

GULLO, [nome completo conforme registro institucional]. **Aplicação de machine learning na
resolução do problema de cortes unidimensional com sobras aproveitáveis e predição de
demanda**. 2025. Trabalho de Conclusão de Curso (Bacharelado em Ciência da Computação) —
Universidade Estadual Paulista "Júlio de Mesquita Filho", Bauru, 2025. Disponível em:
https://repositorio.unesp.br/entities/publication/6e403ae8-d86e-495c-b464-2a95052f51ec.
[Trabalho de conclusão de curso — não é artigo revisado por pares; citado como trabalho
correlato local.]

HOBOR, [nome completo não confirmado]; BRCIC, [nome completo não confirmado]; POLUTNIK,
[nome completo não confirmado]; KAPETANOVIC, [nome completo não confirmado]. Comparative
Analysis of Modern Machine Learning Models for Retail Sales Forecasting. **arXiv**,
arXiv:2506.05941, 2025.

PAVLYSHENKO, Bohdan M. Machine-Learning Models for Sales Time Series Forecasting.
**Data** (MDPI), v. 4, n. 1, art. 15, 2019. DOI: 10.3390/data4010015.

**Nota sobre os nomes dos autores:** os prenomes completos de Hobor, Brcic, Polutnik e
Kapetanovic (2025), assim como o nome completo dos autores das duas monografias
(Ermelindo, 2025; Gullo, 2025), não foram confirmados de forma independente durante este
levantamento e devem ser conferidos diretamente nas fontes originais (arXiv e repositórios
institucionais, respectivamente) antes da inclusão no texto final de qualificação.
