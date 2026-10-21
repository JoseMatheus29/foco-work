import { ABAS, useAbas } from '@renderer/stores/abas'

export function Abas(): React.JSX.Element {
  const abaAtiva = useAbas((s) => s.abaAtiva)
  const abrirAba = useAbas((s) => s.abrirAba)

  return (
    <nav role="tablist" className="flex gap-1 border-b border-zinc-200 px-2 dark:border-zinc-700">
      {ABAS.map((aba) => {
        const ativa = aba.id === abaAtiva
        return (
          <button
            key={aba.id}
            type="button"
            role="tab"
            aria-selected={ativa}
            onClick={() => abrirAba(aba.id)}
            className={`-mb-px border-b-2 px-3 py-1.5 ${
              ativa
                ? 'border-blue-600 font-medium text-zinc-900 dark:border-blue-400 dark:text-zinc-100'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            {aba.rotulo}
          </button>
        )
      })}
    </nav>
  )
}
