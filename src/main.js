// main.js

/* eslint no-console: off, global-require: off */
const { app, BrowserWindow, ipcMain } = require('electron');
const { isTest } = require('./util');

if (isTest) {
  require('wdio-electron-service/main');
}

const appPath = app.getAppPath();

const appRootPath = `${appPath}/dist`;
let mainWindow = null;
let aboutWindow = null;

app.on('ready', () => {
  console.log('main log');
  console.warn('main warn');
  console.error('main error');

  global.mainProcessGlobal = 'foo';
  global.ipcEventCount = 0;

  mainWindow = new BrowserWindow({
    x: 25,
    y: 35,
    width: 200,
    height: 300,
    webPreferences: {
      preload: `${appRootPath}/preload.js`,
      enableRemoteModule: false,
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.webContents.on('did-finish-load', () => {
    // Send a message to the renderer process when the window is ready
    mainWindow?.webContents.send('main-window-ready');
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  mainWindow.loadFile(`${appRootPath}/index.html`);

  mainWindow.on('ready-to-show', () => {
    mainWindow.title = 'this is the title of the main window';
    // mainWindow.webContents.openDevTools();

    // Create a new BrowserWindow for the About Window
    aboutWindow = new BrowserWindow({
      width: 400,
      height: 300,
      show: false, // Start with the window hidden
      webPreferences: {
        nodeIntegration: true, // Enable Node.js integration for the About Window
      },
    });

    // aboutWindow.loadFile(`file://${app.getAppPath()}/dist/about.html`);
    const aboutHtml = '<html><body><h1>New Window Content</h1></body></html>';
    aboutWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(aboutHtml)}`);
  });

  ipcMain.handle('increase-window-size', () => {
    const bounds = mainWindow.getBounds();
    mainWindow.setBounds({ ...bounds, height: bounds.height + 10, width: bounds.width + 10 });
  });

  ipcMain.handle('open-new-window', () => {
    aboutWindow.show();
  });

  ipcMain.on('wdio-electron', (event) => {
    event.returnValue = 'test';
  });
});

ipcMain.on('ipc-event', (event, count) => {
  global.ipcEventCount += count;
});
