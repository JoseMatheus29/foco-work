const MINUTO_MS = 60_000

/** Formata uma duração em milissegundos como `2h10`, descartando os segundos. */
export function formatarDuracao(ms: number): string {
  const minutos = Math.floor(Math.max(0, ms) / MINUTO_MS)
  const horas = Math.floor(minutos / 60)
  return `${horas}h${String(minutos % 60).padStart(2, '0')}`
}
