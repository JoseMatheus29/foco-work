import { app, shell, BrowserWindow, nativeTheme } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'

function criarJanelaPrincipal(): void {
  const janela = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 960,
    minHeight: 600,
    title: 'Foco',
    show: false,
    autoHideMenuBar: true,
    // Mesma cor do fundo da interface, para não piscar branco no tema escuro.
    backgroundColor: nativeTheme.shouldUseDarkColors ? '#18181b' : '#ffffff',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  })

  janela.on('ready-to-show', () => {
    janela.show()
  })

  // Nenhuma janela nova abre dentro do app; links http(s) vão para o navegador padrão.
  janela.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://') || url.startsWith('http://')) shell.openExternal(url)
    return { action: 'deny' }
  })

  // Em desenvolvimento carrega o servidor do electron-vite (com HMR); no app empacotado, o HTML local.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    janela.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    janela.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  // F12 abre as DevTools em desenvolvimento; Ctrl+R fica desativado no app empacotado.
  app.on('browser-window-created', (_, janela) => {
    optimizer.watchWindowShortcuts(janela)
  })

  criarJanelaPrincipal()
})

app.on('window-all-closed', () => {
  app.quit()
})
