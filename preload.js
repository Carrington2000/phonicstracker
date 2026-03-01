const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openLocalFile: async (fileName) => {
    return await ipcRenderer.invoke('open-local-file', fileName);
  }
});
