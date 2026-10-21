import type { FocoApi } from '@shared/api'

declare global {
  interface Window {
    api: FocoApi
  }
}
