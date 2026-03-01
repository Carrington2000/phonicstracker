const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:3000');
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }
}

// Handle requests from renderer to open a local file (PDFs etc)
ipcMain.handle('open-local-file', async (event, fileName) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      const url = `http://localhost:3000/${fileName}`;
      await shell.openExternal(url);
      return { opened: true, url };
    } else {
      // In production the files are expected next to the packaged app (dist folder)
      const filePath = path.join(__dirname, 'dist', fileName);
      const result = await shell.openPath(filePath);
      if (result) {
        return { opened: false, error: result };
      }
      return { opened: true, path: filePath };
    }
  } catch (err) {
    return { opened: false, error: err && err.message ? err.message : String(err) };
  }
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
