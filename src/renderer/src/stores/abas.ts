import { create } from 'zustand'

export const ABAS = [
  { id: 'trabalho', rotulo: 'Trabalho' },
  { id: 'diario', rotulo: 'Diário' },
  { id: 'aprendizados', rotulo: 'Aprendizados' },
  { id: 'performance', rotulo: 'Performance' },
  { id: 'daily', rotulo: 'Daily' },
  { id: 'revisao', rotulo: 'Revisão' },
  { id: 'kit', rotulo: 'Kit' },
  { id: 'configuracoes', rotulo: 'Configurações' }
] as const

export type AbaId = (typeof ABAS)[number]['id']

interface EstadoAbas {
  abaAtiva: AbaId
  abrirAba: (aba: AbaId) => void
}

export const useAbas = create<EstadoAbas>()((set) => ({
  abaAtiva: 'trabalho',
  abrirAba: (aba) => set({ abaAtiva: aba })
}))
