import { formatarDuracao } from '@shared/formato'

const MIN = 60_000

// Valores de exemplo até o cronômetro existir (etapa 4).
const exemplo = {
  codigo: 'PROJ-123',
  titulo: 'Ajustar filtro de busca na listagem',
  sessaoMs: 42 * MIN,
  hojeMs: 2 * 60 * MIN + 10 * MIN
}

function Tempo({ rotulo, ms }: { rotulo: string; ms: number }): React.JSX.Element {
  return (
    <div className="text-right">
      <div className="text-xs text-zinc-500 dark:text-zinc-400">{rotulo}</div>
      <div className="font-medium tabular-nums">{formatarDuracao(ms)}</div>
    </div>
  )
}

export function BarraTopo(): React.JSX.Element {
  return (
    <header className="flex items-center gap-4 border-b border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800/60">
      <div className="min-w-0 flex-1">
        <div className="text-xs text-zinc-500 dark:text-zinc-400">Item ativo</div>
        <div className="truncate font-medium">
          <span className="tabular-nums">{exemplo.codigo}</span> · {exemplo.titulo}
        </div>
      </div>

      <Tempo rotulo="Sessão" ms={exemplo.sessaoMs} />
      <Tempo rotulo="Hoje no item" ms={exemplo.hojeMs} />

      <button
        type="button"
        className="rounded bg-blue-600 px-3 py-1.5 font-medium text-white hover:bg-blue-700"
      >
        Pausar
      </button>

      <input
        type="text"
        placeholder="Cole o código ou o link do card"
        className="w-72 rounded border border-zinc-300 bg-white px-2 py-1.5 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-900"
      />
    </header>
  )
}
