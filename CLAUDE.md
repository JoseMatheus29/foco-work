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
- `npm run lint`: ESLint (inclui a checagem do Prettier)
- `npm run format`: formatar com Prettier
- `npm run start`: rodar o build de produção, sem instalador
- `npm run build:unpack`: gerar o app sem instalador, em `dist/win-unpacked`
- `npm run build:win`: gerar o instalador
Mantenha esta lista igual aos scripts do package.json.

## Estrutura
- `src/main/`: processo principal (janelas, bandeja, atalhos, inatividade, backup).
- `src/main/db/`: migrações e repositórios. Todo SQL fica aqui.
- `src/preload/`: expõe `window.api` tipada via contextBridge. Única ponte entre
  a interface e o processo principal.
- `src/renderer/src/`: React (`views/` com uma pasta por aba, `components/`, `stores/`).
- `src/shared/`: tipos e regras puras (sessões, métricas, daily), sem banco,
  sem Electron e sem React. Importado como `@shared/...` em todos os processos.
  O contrato da `window.api` fica em `src/shared/api.ts`.
- Testes ficam ao lado do código, em `*.test.ts`.

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
- Última etapa concluída: 1
- Próxima etapa: 2
- Pendências conhecidas:
  - `appId` (`electron-builder.yml`) e `setAppUserModelId` (`src/main/index.ts`) ainda são
    os do template; acertar na etapa 10, antes das notificações valerem no app instalado.
  - Ícones em `resources/` e `build/` ainda são os do template.
