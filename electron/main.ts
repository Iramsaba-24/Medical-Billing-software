import { app, BrowserWindow, Menu } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const isDev = !app.isPackaged

const RENDERER_DIST = isDev
  ? path.join(process.cwd(), 'dist')
  : path.join(process.resourcesPath, 'dist')

const INDEX_FILE = path.join(RENDERER_DIST, 'index.html')

let win: BrowserWindow | null = null

function createWindow() {
  if (!fs.existsSync(INDEX_FILE)) {
    console.error('index.html missing:', INDEX_FILE)
    return
  }

  win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 700,
    autoHideMenuBar: true,
    icon: isDev
      ? path.join(process.cwd(), 'public', 'electron-vite.svg')
      : path.join(process.resourcesPath, 'icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  win.setMenuBarVisibility(false)

  if (isDev) {
    win.webContents.openDevTools()
    win.loadURL(process.env.VITE_DEV_SERVER_URL!)
  } else {
    win.loadFile(INDEX_FILE)
  }
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(null)
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
