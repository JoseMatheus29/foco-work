# Foco: plano para construir com Claude Code

Oct 21, 2026 · @Matheus

## Visão geral

Foco é um app de Windows, só seu, para medir quanto tempo você passa em cada card do Jira, organizar afazeres e registrar aprendizados, pontos positivos e pontos negativos. Tudo fica salvo no seu computador. Este documento serve de guia para você e de especificação para o Claude Code: exporte como Markdown e salve na pasta do projeto como `docs/PLANO.md`.

| Decisão | Escolha | Motivo |
| --- | --- | --- |
| Plataforma | Executável de Windows, só desktop | Uso individual no computador de trabalho |
| Stack | Electron + React + TypeScript, montado com electron-vite | Você já usa Node e React Native; não precisa instalar nada novo |
| Estado da interface | Zustand | Simples e comum no mundo React Native |
| Estilo | Tailwind CSS | Rápido de ajustar pedindo ao Claude Code |
| Banco de dados | SQLite local com better-sqlite3, no processo principal | Um arquivo só, fácil de copiar para backup |
| Recursos de desktop | APIs do próprio Electron: bandeja, atalhos globais, inatividade, tela bloqueada, notificações, iniciar com o Windows | Tudo em TypeScript, sem outra linguagem |
| Instalador | electron-builder, gerando um instalador .exe | Já vem no template do electron-vite |
| Custo aceito | Instalador perto de 100 MB e mais memória que um app nativo | Para uso pessoal, vale pela simplicidade |
| Jira | Sem API na v1: você cola o código ou o link do card | Não depende de token nem de autorização da TI |
| Jornada de trabalho | Fora do escopo | A empresa já controla pelo ponto |

Fica fora da v1: integração com a API do Jira, sincronização entre computadores e versão para celular.

## Preparar o ambiente no Windows

Você já tem Git, Node, Claude Code e VS Code, então não falta instalar nada. Só confira:

1. `node -v` mostra a versão 22 ou mais nova. Se for mais antiga, atualize para a LTS atual.
2. `git --version` e `claude --version` respondem no terminal.
3. No VS Code, instale as extensões ESLint, Prettier e Tailwind CSS IntelliSense.

## Especificação funcional

Cada módulo abaixo traz as regras a seguir. Onde houver número (minutos, dias), ele vira configuração com esse valor padrão.

### 1. Cards

- Cadastro colando o código
- Campos: código, título, link, horas estimadas e status.
- Status: A fazer, Em andamento, Em revisão, Bloqueado, Concluído.
- Colar um código que já existe abre o card existente em vez de criar outro.
- Cards concluídos podem ser arquivados: saem da lista, mas continuam nos relatórios.

### 2. Atividades fixas

- Reunião, Ajudando alguém, Estudo/onboarding e Outros.
- Funcionam como itens do cronômetro, sem estimativa, sempre no topo da lista.

### 3. Cronômetro

- Uma sessão ativa por vez. Iniciar outro item encerra a sessão anterior no mesmo instante.
- A sessão é gravada no banco ao iniciar, só com o início. O app grava um sinal de vida a cada 60 segundos enquanto ela roda.
- Se o app fechar ou travar com sessão aberta, ao reabrir ele pergunta: continuar contando, encerrar no último sinal de vida ou encerrar agora.
- Sessões com menos de 30 segundos são descartadas (clique errado).
- Lançamento manual: item, data, início e fim. A sessão fica marcada como manual.
- Sessões podem ser editadas e excluídas. O app recusa sessões que se sobrepõem.
- Sessão que passa da meia-noite é dividida em duas, uma para cada dia.
- Inatividade: a cada 15 segundos o app lê há quanto tempo teclado e mouse estão parados. Passou de 5 minutos com o cronômetro rodando, o app marca o início da inatividade. Tela bloqueada conta como inatividade.
- Ao voltar da inatividade, uma janela pergunta: manter os minutos parados, descartar e continuar, ou descartar e pausar.
- Cronômetro esquecido: mais de 2 horas seguidas no mesmo item gera a notificação "Ainda no PROJ-123?".
- Totais mostrados por item: hoje, semana (segunda a domingo) e total.

### 4. Afazeres

- Campos: texto, card vinculado (opcional), prioridade (urgente ou normal), data (padrão: hoje) e data de conclusão.
- Visão **Hoje**: pendentes com data até hoje e concluídos hoje. Visão **Depois**: datas futuras e sem data.
- Pendente de dia anterior aparece em Hoje com a marca "atrasado desde 20/10". A data original não muda.
- Reordenação por arrastar.

### 5. Notas

- Uma nota por card, em Markdown, salva sozinha 1 segundo depois que você para de digitar.
- Diário do dia: um texto por data, salvo do mesmo jeito.
- Busca global (Ctrl+K) em cards, notas, afazeres e registros, ignorando maiúsculas e acentos.

### 6. Aprendizados e pontos

- Três tipos: aprendizado, ponto positivo e ponto negativo.
- Campos: texto, card vinculado (opcional), etiquetas livres (com autocompletar das já usadas) e data e hora.
- **Registro relâmpago:** um atalho global abre uma janela pequena, sem bordas, centralizada e sempre por cima. As teclas 1, 2 e 3 escolhem o tipo, Enter salva e fecha, Esc cancela. O card ativo vem pré-selecionado.
- Linha do tempo com filtros por tipo, etiqueta e período.
- **Padrões:** etiquetas com 3 ou mais pontos negativos nos últimos 30 dias aparecem em destaque no topo.
- **Lembrete de fim do dia:** às 17h45, se faltar algum dos três tipos no dia, o app mostra uma notificação. Dá para desligar.
- **Resumo do mês:** texto em Markdown agrupado por tipo e etiqueta, com contagens, pronto para copiar e levar a uma conversa de feedback.

### 7. Gerador de daily

- **Ontem:** o último dia útil com sessões (na segunda, pega a sexta). Lista os cards trabalhados e os afazeres concluídos.
- **Hoje:** cards em andamento e afazeres de hoje.
- **Impedimentos:** cards com status Bloqueado.
- O texto fica editável antes de copiar. Uma opção liga ou desliga o tempo ao lado de cada card.

### 8. Painel de performance

Seletor de período: hoje, semana ou mês.

- **Distribuição do tempo:** cards, reunião, ajudando, estudo e outros.
- **Real × estimado:** horas gastas dividido por horas estimadas em cada card concluído, com a lista dos maiores estouros.
- **Horas por story point:** média nos cards concluídos, separada por tamanho (1, 2, 3, 5, 8, 13). Mostra se suas estimativas estão calibradas.
- **Trocas de contexto:** quantas vezes o item ativo mudou por dia, sem contar pausas.
- **Blocos de foco:** a maior sessão contínua do dia e a média das sessões.
- **Horários:** horas em cards por hora do dia, das 8h às 19h.
- **Cards parados:** em andamento e sem sessão há 3 dias úteis ou mais.

### 9. Revisão semanal

- Mostra os números da semana, os registros de aprendizados e pontos agrupados por tipo e o compromisso da semana anterior.
- Você marca o compromisso anterior como cumprido, cumprido em parte ou não cumprido.
- Campo final: "o que vou mudar na próxima semana". Uma revisão por semana.

## Modelo de dados

Um banco SQLite com as tabelas abaixo. Instantes (início, fim, criação) ficam em milissegundos desde 1970, em UTC. Datas de calendário ficam como texto `AAAA-MM-DD` no fuso local. Toda mudança de estrutura entra como migração numerada, sem apagar dados.

| Tabela | Campos | Observação |
| --- | --- | --- |
| `itens` | id, tipo, codigo, titulo, link, projeto, story_points, horas_estimadas, status, arquivado, criado_em, atualizado_em | tipo = `card` ou `atividade`; codigo único, vazio nas atividades |
| `sessoes` | id, item_id, inicio, fim, ultimo_sinal, manual | fim vazio = sessão rodando; no máximo uma assim |
| `afazeres` | id, texto, item_id, prioridade, data, ordem, concluido_em, criado_em | item_id opcional |
| `notas_card` | item_id, texto, atualizado_em | uma por item |
| `diario` | data, texto, atualizado_em | uma por dia |
| `registros` | id, tipo, texto, item_id, criado_em | tipo = `aprendizado`, `positivo` ou `negativo` |
| `etiquetas` | id, nome | nome único |
| `registro_etiquetas` | registro_id, etiqueta_id | liga registros e etiquetas |
| `revisoes` | semana, compromisso, resultado_anterior, observacoes, criado_em | semana no formato `2026-W43` |
| `perguntas` | id, pergunta, para_quem, resposta, respondida_em | |
| `glossario` | id, termo, significado | |
| `pessoas` | id, nome, papel, assuntos | |
| `links` | id, titulo, url, categoria | |
| `configuracoes` | chave, valor | valor em JSON |

Para a busca, use uma tabela FTS5 com o tokenizador `unicode61 remove_diacritics 2`, que ignora acentos. Se o SQLite em uso não tiver FTS5, use colunas de texto normalizado (minúsculas, sem acentos).

## Telas, janelas e atalhos

O app tem quatro janelas e vive na bandeja do sistema. Fechar a janela principal só a esconde; sair é pelo menu da bandeja.

| Janela | O que mostra | Como abre |
| --- | --- | --- |
| Principal | Barra do topo, área de trabalho em três colunas e abas | Clique no ícone da bandeja |
| Mini-cronômetro | Item ativo, tempo, pausar/retomar e troca rápida entre os 5 itens recentes | Botão na barra do topo, menu da bandeja ou atalho; sempre por cima e lembra a posição |
| Registro relâmpago | Tipo, texto, card e etiquetas | Atalho global |
| Volta da inatividade | Quanto tempo ficou parado e as três opções | Sozinha, quando você volta |

**Bandeja:** o ícone muda entre rodando e pausado. Ao passar o mouse, mostra "PROJ-123 · 1h20". O menu traz pausar/retomar, os 5 itens recentes, registro relâmpago, mini-cronômetro, abrir o Foco e sair.

**Janela principal:**

- **Barra do topo:** item ativo (código e título), tempo da sessão, total do item hoje, pausar/retomar e um campo "cole o código ou o link do card".
- **Coluna esquerda:** atividades fixas no topo, depois os cards agrupados por status, com filtro por texto.
- **Coluna central:** o item selecionado, com estimado × real, sessões, nota, afazeres e registros vinculados.
- **Coluna direita:** afazeres de hoje e o total do dia por item.
- **Abas:** Trabalho, Diário, Aprendizados, Performance, Daily, Revisão, Kit e Configurações.

**Visual:** segue o tema claro ou escuro do Windows, com densidade compacta. Os números de tempo usam algarismos de largura fixa para não pular. Tempo no formato `2h10`, datas no formato `21/10/2026`.

| Atalho | Ação | Onde funciona |
| --- | --- | --- |
| Ctrl+Alt+Espaço | Pausar ou retomar | Em qualquer programa |
| Ctrl+Alt+Shift+R | Registro relâmpago | Em qualquer programa |
| Ctrl+Alt+Shift+M | Mostrar ou esconder o mini-cronômetro | Em qualquer programa |
| Ctrl+K | Busca | Dentro do app |
| Ctrl+N | Novo afazer | Dentro do app |
| Ctrl+V fora de um campo | Cria ou abre o card colado | Dentro do app |
| Alt+1 a Alt+8 | Troca de aba | Dentro do app |

Evite atalhos globais com Ctrl+Alt e uma letra só. No teclado ABNT2, Ctrl+Alt equivale ao AltGr, e o atalho pode roubar caracteres como `/` e `?`.

## CLAUDE.md

Crie o arquivo `CLAUDE.md` na raiz do projeto com o conteúdo abaixo. O Claude Code lê esse arquivo sozinho no começo de cada conversa, então ele sempre sabe a stack, as regras e em que etapa o projeto está.

```markdown
# Foco

App de Windows para uso pessoal: cronômetro por card do Jira, afazeres, notas,
aprendizados e pontos positivos/negativos, painel de performance.
A especificação completa está em `docs/PLANO.md`. Leia a seção relevante antes de cada etapa.

## Stack
- Electron montado com electron-vite, React, TypeScript estrito, Zustand, Tailwind CSS.
- SQLite com better-sqlite3, usado só no processo principal.
- Recursos de desktop pelas APIs do Electron: Tray, globalShortcut, powerMonitor,
  Notification, app.setLoginItemSettings, app.requestSingleInstanceLock, shell.openExternal.
- Instalador com electron-builder (NSIS).
- Testes com Vitest. ESLint e Prettier.

## Comandos
- `npm run dev`: rodar em desenvolvimento
- `npm run test`: testes
- `npm run typecheck`: checagem de tipos
- `npm run build:win`: gerar o instalador
Mantenha esta lista igual aos scripts do package.json.

## Estrutura
- `src/main/`: processo principal (janelas, bandeja, atalhos, inatividade, backup).
- `src/main/db/`: migrações e repositórios. Todo SQL fica aqui.
- `src/preload/`: expõe `window.api` tipada via contextBridge. Única ponte entre
  a interface e o processo principal.
- `src/renderer/src/`: React (`views/` com uma pasta por aba, `components/`, `stores/`).
- `src/shared/`: tipos e regras puras (sessões, métricas, daily), sem banco,
  sem Electron e sem React.

## Regras
- Interface e mensagens em português do Brasil.
- Segurança: contextIsolation ligado, nodeIntegration desligado, sandbox ligado.
- Regras de tempo e métricas ficam em `src/shared/` como funções puras, sempre com testes.
- Instantes em milissegundos UTC. Datas de calendário como `AAAA-MM-DD` no fuso local.
  Semana começa na segunda.
- Nunca altere uma migração já aplicada; crie uma nova.
- Pergunte antes de adicionar qualquer biblioteca nova.
- O app não acessa a internet.
- Ao terminar uma etapa: rode testes e checagem de tipos, atualize "Estado atual"
  abaixo e proponha a mensagem de commit.

## Estado atual
- Última etapa concluída: nenhuma
- Próxima etapa: 1
- Pendências conhecidas: nenhuma
```

## Como trabalhar com o Claude Code

Uma etapa do roteiro por conversa, sempre com plano aprovado antes do código e commit no fim. Repita este ciclo em cada etapa:

1. Abra o terminal na pasta do projeto e rode `claude`.
2. Cole o prompt da etapa. Todos pedem para o Claude Code ler a especificação, propor um plano e esperar sua aprovação.
3. Leia o plano, corrija o que não fizer sentido e aprove.
4. Deixe ele implementar. Ele pede permissão para rodar comandos como `npm` e `git`; aprove os que você reconhecer.
5. Rode `npm run dev` e teste você mesmo com o checklist da etapa.
6. Se algo falhar, diga o que fez, o que esperava, o que aconteceu e cole a mensagem de erro inteira.
7. Quando tudo do checklist passar, peça o commit.
8. Rode `/clear` antes da próxima etapa. O `CLAUDE.md` e o `docs/PLANO.md` guardam o contexto entre conversas.

Dicas:

- O commit de cada etapa é seu ponto de volta. Se uma conversa desandar, `git restore .` descarta o que não foi commitado.
- Se quiser só planejar, use o modo de planejamento (Shift+Tab alterna os modos). Nele o Claude Code lê e propõe, sem mexer em arquivos.
- Para aprender React no caminho, peça no fim de cada etapa: "explique em poucas linhas o que você fez e por quê".
- Desconfie de mudanças em arquivos que a etapa não deveria tocar. Pergunte o motivo antes de aceitar.

## Roteiro de etapas

São 16 etapas em três fases. Ao fim da fase 1 (etapa 10) você já tem um executável para usar no trabalho. Cada etapa traz o prompt para colar no Claude Code e o checklist para você testar antes do commit.

### Fase 1: usável no dia a dia

#### Etapa 1. Esqueleto do projeto

```text
Leia o CLAUDE.md e as seções "Visão geral" e "Telas, janelas e atalhos" do docs/PLANO.md.
Crie o projeto nesta pasta com electron-vite (template React + TypeScript), sem apagar
CLAUDE.md nem docs/. Se o gerador recusar a pasta não vazia, gere numa pasta temporária
e mova os arquivos.
Adicione Tailwind CSS, Zustand, Vitest, ESLint e Prettier.
Organize as pastas como está no CLAUDE.md, incluindo src/shared/.
Monte só o esqueleto da janela principal: barra do topo, três colunas e abas, com textos de exemplo.
Deixe contextIsolation e sandbox ligados e crie uma window.api tipada, ainda vazia, no preload.
Antes de escrever código, me mostre um plano curto e espere minha aprovação.
```

- [ ] `npm run dev` abre a janela do Foco
- [ ] Barra do topo, três colunas e abas aparecem
- [ ] `npm run test` e `npm run typecheck` passam
- [ ] `CLAUDE.md` e `docs/` continuam na pasta

#### Etapa 2. Banco de dados

```text
Leia a seção "Modelo de dados" do docs/PLANO.md.
Instale o better-sqlite3 e configure a recompilação para o Electron.
Crie em src/main/db/ um sistema de migrações numeradas e a migração 1 com todas as tabelas,
índices e a busca FTS5. O arquivo do banco fica em app.getPath('userData').
Crie repositórios por tabela e exponha pela window.api só o que a interface vai usar,
com os tipos em src/shared/.
Escreva testes das migrações com banco em memória. Atenção: o better-sqlite3 compilado para
o Electron pode não carregar no Node do Vitest; resolva isso e me explique a solução.
Plano primeiro, espere minha aprovação.
```

- [ ] O app abre sem erro e cria o arquivo do banco
- [ ] Fechar e abrir de novo mantém os dados
- [ ] Os testes passam

#### Etapa 3. Cards e atividades fixas

```text
Leia as seções 1 e 2 da "Especificação funcional" do docs/PLANO.md.
Implemente: campo da barra do topo que aceita código ou link do Jira, formulário do card
(título, story points, horas estimadas, status), coluna esquerda com atividades fixas no topo
e cards agrupados por status, filtro por texto e arquivamento.
Ctrl+V fora de um campo de texto também cria ou abre o card.
A extração do código fica em src/shared/ com testes: código puro, link do Jira, texto
inválido e código repetido.
Plano primeiro, espere minha aprovação.
```

- [ ] Colar `PROJ-123` cria o card e abre o formulário
- [ ] Colar o link completo do Jira extrai o código certo
- [ ] Colar um código que já existe abre o card, sem duplicar
- [ ] Atividades fixas aparecem no topo
- [ ] Arquivar tira o card da lista

#### Etapa 4. Cronômetro

```text
Leia a seção 3 da "Especificação funcional" do docs/PLANO.md, menos inatividade e
cronômetro esquecido (ficam para a etapa 11).
O estado do cronômetro vive no processo principal; a interface só exibe e envia comandos.
Implemente: iniciar e pausar, troca de item encerrando a sessão anterior, sinal de vida a
cada 60 s, recuperação ao reabrir com sessão aberta, descarte de sessões com menos de 30 s,
divisão na meia-noite, lançamento manual, edição e exclusão sem sobreposição, e os totais
de hoje, semana e geral.
Toda regra de tempo fica em src/shared/ com testes, incluindo meia-noite, sobreposição e
semana começando na segunda.
Plano primeiro, espere minha aprovação.
```

- [ ] Iniciar um card e depois outro deixa só um rodando
- [ ] Os totais batem com o relógio depois de alguns minutos
- [ ] Encerrar o app pelo Gerenciador de Tarefas com o cronômetro rodando e reabrir mostra a pergunta de recuperação
- [ ] Lançamento manual sobreposto é recusado com mensagem clara
- [ ] Os testes passam

#### Etapa 5. Bandeja, mini-cronômetro e atalhos globais

```text
Leia a seção "Telas, janelas e atalhos" do docs/PLANO.md.
Implemente: ícone na bandeja com estado rodando/pausado, tooltip com item e tempo, menu da
bandeja; fechar a janela principal esconde em vez de sair; instância única; mini-cronômetro
sempre por cima que lembra a posição; atalhos globais de pausar/retomar e do mini-cronômetro.
O atalho do registro relâmpago fica para a etapa 8.
Se um atalho global já estiver em uso por outro programa, mostre um aviso em vez de falhar calado.
Plano primeiro, espere minha aprovação.
```

- [ ] Fechar a janela deixa o ícone na bandeja
- [ ] Ctrl+Alt+Espaço pausa e retoma com outro programa em foco
- [ ] O mini-cronômetro fica por cima e volta no mesmo lugar
- [ ] Abrir o app de novo só traz a janela existente para a frente
- [ ] Sair pelo menu da bandeja encerra a sessão e fecha o app

#### Etapa 6. Afazeres

```text
Leia a seção 4 da "Especificação funcional" do docs/PLANO.md.
Implemente as visões Hoje e Depois, captura rápida com Enter, vínculo opcional a card,
prioridade, marca de atrasado, reordenação por arrastar e o atalho Ctrl+N.
A regra do que aparece em Hoje fica em src/shared/ com testes.
Plano primeiro, espere minha aprovação.
```

- [ ] Enter cria o afazer na hora
- [ ] Afazer de ontem não concluído aparece com "atrasado desde"
- [ ] Afazer vinculado aparece também no card
- [ ] A ordem arrastada continua igual depois de reabrir

#### Etapa 7. Notas, diário e busca

```text
Leia a seção 5 da "Especificação funcional" do docs/PLANO.md.
Implemente a nota por card em Markdown com salvamento automático, a aba Diário e a busca
global com Ctrl+K em cards, notas, afazeres e registros, ignorando acentos e maiúsculas.
Plano primeiro, espere minha aprovação.
```

- [ ] A nota salva sozinha e continua lá depois de reabrir
- [ ] Buscar "funcao" encontra "função"
- [ ] Clicar num resultado leva ao lugar certo

#### Etapa 8. Aprendizados e pontos

```text
Leia a seção 6 da "Especificação funcional" do docs/PLANO.md, menos o resumo do mês
(fica para a etapa 14).
Implemente: registro dos três tipos com etiquetas e card opcional, janela do registro
relâmpago pelo atalho global Ctrl+Alt+Shift+R, linha do tempo com filtros, destaque de
padrões e lembrete de fim do dia.
A regra de padrões fica em src/shared/ com testes.
Plano primeiro, espere minha aprovação.
```

- [ ] O atalho abre a caixinha por cima de qualquer programa
- [ ] As teclas 1, 2 e 3 trocam o tipo; Enter salva; Esc fecha sem salvar
- [ ] O card ativo vem pré-selecionado
- [ ] Três pontos negativos com a mesma etiqueta fazem ela aparecer em destaque
- [ ] O lembrete aparece no horário quando falta algum tipo no dia

#### Etapa 9. Configurações e backup

```text
Leia a seção 11 da "Especificação funcional" do docs/PLANO.md.
Implemente a aba Configurações com todos os itens da seção, inclusive iniciar com o Windows,
o backup diário guardando as 14 cópias mais recentes, os botões de backup e restauração e a
exportação em JSON.
O backup usa a função de backup do better-sqlite3, não uma cópia do arquivo aberto.
Restaurar pede confirmação na própria tela e antes faz um backup do estado atual.
Plano primeiro, espere minha aprovação.
```

- [ ] Mudar um atalho funciona sem reiniciar o app
- [ ] "Fazer backup agora" cria o arquivo na pasta escolhida
- [ ] Restaurar um backup traz de volta os dados daquele dia
- [ ] Só ficam as 14 cópias mais recentes

#### Etapa 10. Primeiro executável

```text
Configure o electron-builder para gerar o instalador NSIS do Foco para Windows, com nome,
ícone e versão 0.1.0.
Garanta que o better-sqlite3 entra no pacote e funciona no app instalado.
Rode o build e me diga onde ficou o instalador.
Plano primeiro, espere minha aprovação.
```

- [ ] O instalador roda e o Foco aparece no menu Iniciar
- [ ] O app instalado abre, cria o banco e mantém os dados depois de reiniciar o Windows
- [ ] Iniciar com o Windows funciona no app instalado

Use a versão 0.1.0 por uma semana antes da fase 2. O que incomodar, registre no próprio app como ponto negativo com a etiqueta `foco`.

### Fase 2: medir de verdade

#### Etapa 11. Inatividade e cronômetro esquecido

```text
Leia a seção 3 da "Especificação funcional" do docs/PLANO.md, partes de inatividade e
cronômetro esquecido.
Use powerMonitor.getSystemIdleTime a cada 15 s e os eventos de bloqueio de tela do powerMonitor.
Implemente a janela de volta da inatividade com as três opções e a notificação de
cronômetro longo.
A decisão de como cortar ou manter a sessão fica em src/shared/ com testes.
Plano primeiro, espere minha aprovação.
```

- [ ] Com o limite em 1 minuto para testar, ficar parado e voltar mostra a janela com o tempo certo
- [ ] "Descartar e continuar" tira só os minutos parados
- [ ] Bloquear a tela com Win+L e voltar mostra a janela
- [ ] A notificação de cronômetro longo aparece (teste com limite baixo)

#### Etapa 12. Gerador de daily

```text
Leia a seção 7 da "Especificação funcional" do docs/PLANO.md.
Implemente a aba Daily com Ontem, Hoje e Impedimentos, texto editável, opção de mostrar o
tempo e botão de copiar.
A montagem do texto fica em src/shared/ com testes, incluindo a segunda-feira pegando a sexta.
Plano primeiro, espere minha aprovação.
```

- [ ] Na segunda, "Ontem" mostra a sexta
- [ ] Copiar e colar no chat da empresa mantém as quebras de linha
- [ ] Cards bloqueados aparecem em Impedimentos

#### Etapa 13. Painel de performance

```text
Leia a seção 8 da "Especificação funcional" do docs/PLANO.md.
Implemente a aba Performance com seletor de período e todas as métricas da seção.
Cada métrica é uma função pura em src/shared/ com testes.
Para os gráficos, proponha uma biblioteca leve ou SVG feito à mão e espere minha escolha.
Plano primeiro, espere minha aprovação.
```

- [ ] Os números de um dia batem com uma conferência manual
- [ ] Horas por story point usa só cards concluídos
- [ ] Cards parados mostra os que estão sem sessão há 3 dias úteis

### Fase 3: reflexão e acabamento

#### Etapa 14. Revisão semanal e resumo do mês

```text
Leia a seção 9 e o resumo do mês da seção 6 da "Especificação funcional" do docs/PLANO.md.
Implemente a aba Revisão com os números da semana, os registros agrupados, o compromisso
anterior e o novo, e o resumo do mês em Markdown com botão de copiar.
Plano primeiro, espere minha aprovação.
```

- [ ] O compromisso da semana passada aparece na revisão desta semana
- [ ] O resumo do mês agrupa por tipo e etiqueta, com contagens

#### Etapa 15. Kit do novato

```text
Leia a seção 10 da "Especificação funcional" do docs/PLANO.md.
Implemente a aba Kit com perguntas, glossário, pessoas e links, cada um com cadastro,
edição e exclusão. Inclua glossário e perguntas na busca global.
Links abrem no navegador padrão.
Plano primeiro, espere minha aprovação.
```

- [ ] Marcar uma pergunta como respondida guarda a resposta
- [ ] Termos do glossário aparecem na busca global
- [ ] Links abrem no navegador

#### Etapa 16. Acabamento e versão 1.0

```text
Compare o app inteiro com o docs/PLANO.md e liste o que falta ou está diferente da especificação.
Confira tema claro e escuro, atalhos Alt+1 a Alt+8, mensagens em português e números de
largura fixa. Proponha as correções em ordem de importância e espere eu escolher.
Depois das correções, gere o instalador como versão 1.0.0.
```

- [ ] O tema acompanha o do Windows
- [ ] Nenhum texto em inglês na interface
- [ ] O instalador 1.0.0 foi gerado e instalado por cima da 0.1.0 sem perder dados

## Gerar o executável e instalar

`npm run build:win` gera o instalador `.exe`, em geral na pasta `dist/`. Na etapa 10 o Claude Code confirma o caminho exato.

- **Aviso do Windows:** na primeira execução pode aparecer "O Windows protegeu o computador". Clique em "Mais informações" e depois em "Executar assim mesmo". Isso acontece porque o instalador não tem assinatura digital.
- **Antivírus da empresa:** pode bloquear o instalador. Nesse caso, só a TI libera.
- **Atualizar:** gere uma versão com número maior e instale por cima. Os dados ficam em `%APPDATA%\Foco` e não são apagados na atualização.
- **Segurança dos dados:** além do backup automático, copie a pasta de backup para um pendrive ou outro disco de vez em quando.

## Depois da v1

Ideias para quando a 1.0 estiver no seu dia a dia. Cada uma vira uma etapa nova no mesmo formato.

- **Cards direto do Jira:** com um token pessoal da API, só leitura, o app puxa os cards atribuídos a você com título, story points e status. Depende de a empresa permitir tokens e exige mudar a regra "o app não acessa a internet" no `CLAUDE.md`.
- **Metas pessoais:** por exemplo, um bloco de foco de 90 minutos por dia ou no máximo 8 trocas de contexto, com aviso quando passar.
- **Pomodoro opcional:** ciclos de foco e pausa ligados ao cronômetro do card ativo.
- **Comparar meses:** a evolução das horas por story point e dos pontos negativos mês a mês, para ver se as mudanças das revisões funcionaram.
