const { app, BrowserWindow, ipcMain } = require('electron');
const database = require('./src/database/query');

const PATH = './TaskDB.db';

require('electron-reload')(__dirname);

function createWindow () {
  // Cria uma janela de navegação.
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // e carregar o index.html do aplicativo.
  win.loadFile('./src/index.html')

  // code

  //init db
  database.createTableLists(PATH);
  database.createTableTasks(PATH);

  // first load

  ipcMain.on('loaded', async () => {
    let list = await database.selectLists(PATH);
    win.webContents.send('firstLoaded', list);
  })

  //add
  ipcMain.on('addTask', async (evt, value) => {
    let tasks = await database.addTask(value, PATH);
    win.webContents.send('added', tasks);
  })

  //get task by id

  ipcMain.on('getTaskById', async (evt, value) => {
    let task = await database.selectTaskById(value, PATH);
    win.webContents.send('sendTask', task);
  });

  //update 

  ipcMain.on('updateTask', async (evt, value) => {
    let task = await database.updateTask(value[0], value[1], PATH);
    win.webContents.send('updated', task);
  });

  //done
  ipcMain.on('setDone', async (evt, value) => {
    let tasks = await database.taskDone(value, PATH);
    win.webContents.send('DoneChanged', tasks);
  })

  //undone

  ipcMain.on('setUndone', async (evt, value) => {
    let tasks = await database.taskUndone(value, PATH);
    win.webContents.send('undoneChanged', tasks);
  })

  //delete
  ipcMain.on('deleteTask', async (evt, value) => {
    let tasks = await database.deleteTask(value, PATH);
    win.webContents.send('taskDeleted', tasks);
  })

  //delete all

  ipcMain.on('deleteAll', async (evt, value) => {
    let tasks = await database.deleteAll(PATH);
    win.webContents.send('allDeleted', tasks);
  })

  

}

app.whenReady().then(createWindow)

