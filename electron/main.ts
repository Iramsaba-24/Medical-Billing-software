import { app, BrowserWindow , Menu} from 'electron'
// import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'

// const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))


const isDev = !!process.env.VITE_DEV_SERVER_URL;

const RENDERER_DIST = isDev
  ? path.join(process.cwd(), 'dist')
  : path.join(__dirname, '../app-extracted/dist'); // fallback to extracted folder


  const INDEX_FILE = path.join(RENDERER_DIST, 'index.html');

  if (!fs.existsSync(INDEX_FILE)) {
  console.error('Error: index.html not found at', INDEX_FILE)
  app.quit();
}

// process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
 win = new BrowserWindow({
  width: 1280,
  height: 800,
  minWidth: 1024,
  minHeight: 700,
  autoHideMenuBar: true, 
  icon: path.join(app.getAppPath(), 'dist', 'electron-vite.svg'),
  webPreferences: {
    preload: path.join(__dirname, 'preload.mjs'),
  },
})

  win.setMenuBarVisibility(false)
  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

 if (isDev) {
  win.loadURL(process.env.VITE_DEV_SERVER_URL!)
} else {
  win.loadFile(INDEX_FILE)
}
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(() => {
  Menu.setApplicationMenu(null) 
  createWindow()
})

