import { Abas } from './components/Abas'
import { BarraTopo } from './components/BarraTopo'
import { useAbas, type AbaId } from './stores/abas'
import { Aprendizados } from './views/aprendizados/Aprendizados'
import { Configuracoes } from './views/configuracoes/Configuracoes'
import { Daily } from './views/daily/Daily'
import { Diario } from './views/diario/Diario'
import { Kit } from './views/kit/Kit'
import { Performance } from './views/performance/Performance'
import { Revisao } from './views/revisao/Revisao'
import { Trabalho } from './views/trabalho/Trabalho'

const VIEWS: Record<AbaId, () => React.JSX.Element> = {
  trabalho: Trabalho,
  diario: Diario,
  aprendizados: Aprendizados,
  performance: Performance,
  daily: Daily,
  revisao: Revisao,
  kit: Kit,
  configuracoes: Configuracoes
}

function App(): React.JSX.Element {
  const abaAtiva = useAbas((s) => s.abaAtiva)
  const View = VIEWS[abaAtiva]

  return (
    <div className="flex h-full flex-col">
      <BarraTopo />
      <Abas />
      <main className="min-h-0 flex-1">
        <View />
      </main>
    </div>
  )
}

export default App
