import { Fragment } from 'react'
import { formatarDuracao } from '@shared/formato'

const MIN = 60_000

// Dados de exemplo até existir o banco (etapa 2) e o cadastro de cards (etapa 3).
const atividades = ['Reunião', 'Ajudando alguém', 'Estudo/onboarding', 'Outros']

const cardsPorStatus = [
  {
    status: 'Em andamento',
    cards: [{ codigo: 'PROJ-123', titulo: 'Ajustar filtro de busca na listagem' }]
  },
  {
    status: 'A fazer',
    cards: [
      { codigo: 'PROJ-130', titulo: 'Exportar relatório em CSV' },
      { codigo: 'PROJ-131', titulo: 'Corrigir máscara de telefone' }
    ]
  },
  { status: 'Em revisão', cards: [{ codigo: 'PROJ-118', titulo: 'Paginação da tela de pedidos' }] },
  { status: 'Bloqueado', cards: [{ codigo: 'PROJ-125', titulo: 'Integração com o boleto' }] }
]

const afazeresHoje = [
  { texto: 'Responder dúvida do PR do PROJ-118', urgente: true },
  { texto: 'Atualizar a estimativa do PROJ-130', urgente: false },
  { texto: 'Ler a documentação do serviço de boletos', urgente: false }
]

const totaisHoje = [
  { item: 'PROJ-123', ms: 130 * MIN },
  { item: 'Reunião', ms: 45 * MIN },
  { item: 'PROJ-118', ms: 20 * MIN }
]

function Titulo({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <h2 className="mt-4 mb-1 text-xs font-semibold tracking-wide text-zinc-500 uppercase first:mt-0 dark:text-zinc-400">
      {children}
    </h2>
  )
}

function Linha({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <li className="cursor-default truncate rounded px-2 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-800">
      {children}
    </li>
  )
}

function ColunaItens(): React.JSX.Element {
  return (
    <section className="overflow-y-auto border-r border-zinc-200 p-3 dark:border-zinc-700">
      <input
        type="text"
        placeholder="Filtrar"
        className="mb-3 w-full rounded border border-zinc-300 bg-white px-2 py-1 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-900"
      />

      <Titulo>Atividades</Titulo>
      <ul>
        {atividades.map((nome) => (
          <Linha key={nome}>{nome}</Linha>
        ))}
      </ul>

      {cardsPorStatus.map(({ status, cards }) => (
        <Fragment key={status}>
          <Titulo>{status}</Titulo>
          <ul>
            {cards.map((card) => (
              <Linha key={card.codigo}>
                <span className="font-medium tabular-nums">{card.codigo}</span> {card.titulo}
              </Linha>
            ))}
          </ul>
        </Fragment>
      ))}
    </section>
  )
}

function ColunaItemSelecionado(): React.JSX.Element {
  return (
    <section className="overflow-y-auto p-4">
      <div className="text-xs text-zinc-500 dark:text-zinc-400">Em andamento</div>
      <h1 className="text-lg font-semibold">
        <span className="tabular-nums">PROJ-123</span> · Ajustar filtro de busca na listagem
      </h1>

      <div className="mt-3 flex gap-6">
        <div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">Estimado</div>
          <div className="font-medium tabular-nums">{formatarDuracao(6 * 60 * MIN)}</div>
        </div>
        <div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">Real</div>
          <div className="font-medium tabular-nums">{formatarDuracao(4 * 60 * MIN + 20 * MIN)}</div>
        </div>
      </div>

      <Titulo>Sessões</Titulo>
      <p className="text-zinc-500 dark:text-zinc-400">As sessões do card aparecem aqui.</p>
      <Titulo>Nota</Titulo>
      <p className="text-zinc-500 dark:text-zinc-400">A nota do card aparece aqui.</p>
      <Titulo>Afazeres</Titulo>
      <p className="text-zinc-500 dark:text-zinc-400">Os afazeres vinculados aparecem aqui.</p>
      <Titulo>Registros</Titulo>
      <p className="text-zinc-500 dark:text-zinc-400">
        Aprendizados e pontos vinculados aparecem aqui.
      </p>
    </section>
  )
}

function ColunaDia(): React.JSX.Element {
  return (
    <section className="overflow-y-auto border-l border-zinc-200 p-3 dark:border-zinc-700">
      <Titulo>Afazeres de hoje</Titulo>
      <ul>
        {afazeresHoje.map((afazer) => (
          <Linha key={afazer.texto}>
            {afazer.urgente && <span className="mr-1 font-semibold text-red-600">!</span>}
            {afazer.texto}
          </Linha>
        ))}
      </ul>

      <Titulo>Total do dia</Titulo>
      <ul>
        {totaisHoje.map(({ item, ms }) => (
          <li key={item} className="flex justify-between px-2 py-1">
            <span>{item}</span>
            <span className="tabular-nums">{formatarDuracao(ms)}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function Trabalho(): React.JSX.Element {
  return (
    <div className="grid h-full grid-cols-[17rem_1fr_19rem]">
      <ColunaItens />
      <ColunaItemSelecionado />
      <ColunaDia />
    </div>
  )
}
