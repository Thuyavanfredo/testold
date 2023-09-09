const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path');
const {autoUpdater}=require("electron-updater")
const log = require('electron-log');
const fs = require("fs")


process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

fs.mkdir("C:/Automation Toolbox log", function(err) {
  if (err) {
    console.log(err)
  } else {
    console.log("New directory successfully created.")
  }
})
log.transports.file.resolvePath = () => path.join("C:/Automation Toolbox log", '/logs/main.log');
log.log("Application version"+ app.getVersion())
log.info('Hello, log');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// eslint-disable-next-line global-require
if (require('electron-squirrel-startup')) {
  app.quit();
}
function handleSetTitle (event, title) {
  var child = require('child_process').execFile;
  var executablePath = "./resources/Effectivity Macro 2.06.exe";
  
  child(executablePath, function(err, data) {
      if(err){
         console.error(err);
         return;
      }
   
      console.log(data.toString());
  });
}
const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, 'icon/android-chrome-512x512.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    }
  });


  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  mainWindow.setMenuBarVisibility(false)

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  ipcMain.on('set-title', handleSetTitle)
  createWindow()
  autoUpdater.checkForUpdatesAndNotify()
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
    autoUpdater.checkForUpdatesAndNotify()
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
autoUpdater.on("update-available",()=>{
  log.info("Update available")
})
autoUpdater.on("checking-for-update",()=>{
  log.info("checking-for-update")
})
  autoUpdater.on("download-progress",(progressTrack)=>{
  log.info("\n\ndownload-progress")
  log.info(progressTrack)
})
autoUpdater.on("update-downloaded",()=>{
  log.info("update-downloaded")
})
autoUpdater.on("update-not-available",()=>{
  log.info("update-not-available")
})
autoUpdater.on("error",(err)=>{
  log.info("Error", err)
})
