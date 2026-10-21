import { describe, expect, it } from 'vitest'
import { formatarDuracao } from './formato'

const MIN = 60_000
const HORA = 60 * MIN

describe('formatarDuracao', () => {
  it('mostra horas e minutos no formato 2h10', () => {
    expect(formatarDuracao(2 * HORA + 10 * MIN)).toBe('2h10')
  })

  it('completa os minutos com zero à esquerda', () => {
    expect(formatarDuracao(2 * HORA + 5 * MIN)).toBe('2h05')
  })

  it('mostra 0h quando não chega a uma hora', () => {
    expect(formatarDuracao(45 * MIN)).toBe('0h45')
    expect(formatarDuracao(0)).toBe('0h00')
  })

  it('descarta os segundos em vez de arredondar', () => {
    expect(formatarDuracao(MIN - 1)).toBe('0h00')
    expect(formatarDuracao(HORA + 59 * MIN + 59_999)).toBe('1h59')
  })

  it('passa de 24 horas sem virar dias', () => {
    expect(formatarDuracao(25 * HORA)).toBe('25h00')
  })

  it('trata duração negativa como zero', () => {
    expect(formatarDuracao(-5 * MIN)).toBe('0h00')
  })
})
