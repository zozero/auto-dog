import { app, BrowserWindow, screen, ipcMain, shell, utilityProcess } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

let win: BrowserWindow | null = null;
const args = process.argv.slice(1),
  serve = args.some((val) => val === '--serve');

function createWindow(): BrowserWindow {
  const size = screen.getPrimaryDisplay().workAreaSize;
  // 设置应用初始位置，在屏幕中心打开
  const zx = Math.ceil(size.width / 2 - 1920 / 2);
  const zy = Math.ceil(size.height / 2 - 1080 / 2);

  // Create the browser window.
  win = new BrowserWindow({
    x: zx,
    y: zy,

    width: 1920,
    height: 1080,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: serve,
      contextIsolation: false,
    },
    title: '自动化小犬',
  });
  // 移除菜单栏
  // win.setMenu(null);

  if (serve) {
    const debug = require('electron-debug');
    debug();

    require('electron-reloader')(module);
    win.loadURL('http://localhost:4200');
  } else {
    // Path when running electron executable
    let pathIndex = './index.html';

    if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
      // Path when running electron in local folder
      pathIndex = '../dist/index.html';
    }

    const url = new URL(path.join('file:', __dirname, pathIndex));
    win.loadURL(url.href);
    // win.loadURL('http://localhost:4200');
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  return win;
}

// 这里接收了来自于浏览器内部即angular组件的请求动作，需要重新渲染才行
ipcMain.on('浏览器打开链接', (event, url) => {
  shell.openExternal(url)  // 打开链接
})
// 重启应用
ipcMain.on('重启应用', (event) => {
  app.relaunch({ args: process.argv.slice(1).concat(['--relaunch']) })
  app.exit(0)
})



try {

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947

  app.on('ready', () => setTimeout(createWindow, 400));

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

  // 运行执行端，因为需要管理员权限，不在启用
  // runExecute();
} catch (e) {
  // Catch Error
  // throw e;
}

// 运行其他程序，该函数需要管理员权限。
function runExecute() {
  const pathUrl = path.join(__dirname, 'test.txt')
  console.log(pathUrl)
  // Example code in main.js
  const { execFile } = require('child_process');

  // Replace 'path/to/your/external-program.exe' with the actual path to your executable
  const externalProgramPath = pathUrl;

  // Execute the external program
  execFile(externalProgramPath, (error: any, stdout: any, stderr: any) => {
    if (error) {
      console.error(`Error executing ${externalProgramPath}: ${error.message}`);
      return;
    }
    console.log(`External program output: ${stdout}`);
  });
}