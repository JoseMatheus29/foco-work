import { contextBridge } from 'electron'
import type { FocoApi } from '@shared/api'

const api: FocoApi = {}

contextBridge.exposeInMainWorld('api', api)
