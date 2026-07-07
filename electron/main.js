const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

// Force the Chromium UI locale to English regardless of the OS locale, so
// native controls the app can't restyle via CSS (date picker popup, context
// menus, etc.) are always in English. Must be set before the app is ready.
app.commandLine.appendSwitch('lang', 'en-US');

let mainWindow;
let backendProcess;

// Log to file for debugging
const logFile = path.join(app.getPath('userData'), 'app.log');
function log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    console.log(message);
    try {
        fs.appendFileSync(logFile, logMessage);
    } catch (e) {
        // Ignore write errors
    }
}

// Start backend server
function startBackend() {
    const isDev = !app.isPackaged;

    // Try multiple possible backend locations
    const possiblePaths = [
        path.join(__dirname, '../backend/dist/index.js'),
        path.join(process.resourcesPath, 'app.asar.unpacked/backend/dist/index.js'),
        path.join(process.resourcesPath, 'backend/dist/index.js'),
        path.join(process.resourcesPath, 'app/backend/dist/index.js'),
        path.join(__dirname, '..', 'app', 'backend', 'dist', 'index.js')
    ];

    let backendPath = null;
    for (const p of possiblePaths) {
        log(`Checking backend path: ${p}`);
        if (fs.existsSync(p)) {
            backendPath = p;
            log(`Found backend at: ${p}`);
            break;
        }
    }

    if (!backendPath) {
        log('ERROR: Backend not found in any expected location!');
        log(`Searched paths: ${JSON.stringify(possiblePaths, null, 2)}`);
        dialog.showErrorBox(
            'Error de Inicio',
            'No se pudo encontrar el backend de la aplicación.\n\nLog: ' + logFile
        );
        return false;
    }

    log('Starting backend from: ' + backendPath);

    // Load .env file
    const envPath = path.join(path.dirname(backendPath), '..', '.env');
    log(`Looking for .env at: ${envPath}`);

    let envVars = {
        ...process.env,
        PORT: '3000',
        NODE_ENV: 'production'
    };

    if (fs.existsSync(envPath)) {
        log('.env file found, loading variables');
        try {
            const envContent = fs.readFileSync(envPath, 'utf8');
            const envLines = envContent.split('\n');

            envLines.forEach(line => {
                line = line.trim();
                if (line && !line.startsWith('#')) {
                    const [key, ...valueParts] = line.split('=');
                    if (key && valueParts.length > 0) {
                        let value = valueParts.join('=').trim();
                        value = value.replace(/^["']|["']$/g, '');
                        envVars[key.trim()] = value;
                        log(`Loaded env var: ${key.trim()}`);
                    }
                }
            });
        } catch (error) {
            log(`Error reading .env file: ${error.message}`);
        }
    } else {
        log('WARNING: .env file not found!');
    }

    try {
        backendProcess = spawn('node', [backendPath], {
            env: envVars,
            stdio: ['ignore', 'pipe', 'pipe']
        });

        backendProcess.stdout.on('data', (data) => {
            log(`Backend: ${data.toString().trim()}`);
        });

        backendProcess.stderr.on('data', (data) => {
            log(`Backend ERROR: ${data.toString().trim()}`);
        });

        backendProcess.on('error', (error) => {
            log(`Failed to start backend: ${error.message}`);
        });

        backendProcess.on('exit', (code) => {
            log(`Backend process exited with code ${code}`);
        });

        return true;
    } catch (error) {
        log(`Exception starting backend: ${error.message}`);
        return false;
    }
}

// Create main window
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            webSecurity: true
        },
        icon: path.join(__dirname, 'assets/icon.png')
    });

    // Load frontend
    const isDev = !app.isPackaged;

    if (isDev) {
        // In development, load from Vite dev server
        log('Loading frontend from development server...');
        mainWindow.loadURL('http://localhost:5173').catch(err => {
            log(`Failed to load dev server: ${err.message}`);
            dialog.showErrorBox('Error', 'No se pudo conectar con el servidor de desarrollo.\nAsegúrate de que el frontend esté corriendo en http://localhost:5173');
        });
    } else {
        // In production, load from built files
        const possibleFrontendPaths = [
            path.join(__dirname, '../frontend/dist/index.html'),
            path.join(process.resourcesPath, 'app/frontend/dist/index.html'),
            path.join(process.resourcesPath, 'frontend/dist/index.html'),
            path.join(__dirname, '..', 'app', 'frontend', 'dist', 'index.html'),
            path.join(process.resourcesPath, 'app.asar.unpacked/frontend/dist/index.html')
        ];

        let frontendPath = null;
        for (const p of possibleFrontendPaths) {
            log(`Checking frontend path: ${p}`);
            if (fs.existsSync(p)) {
                frontendPath = p;
                log(`Found frontend at: ${p}`);
                break;
            }
        }

        if (!frontendPath) {
            log('ERROR: Frontend not found!');
            log(`Searched paths: ${JSON.stringify(possibleFrontendPaths, null, 2)}`);
            dialog.showErrorBox(
                'Error de Inicio',
                'No se pudo encontrar el frontend de la aplicación.\n\nLog: ' + logFile
            );
            app.quit();
            return;
        }

        log(`Loading frontend from: ${frontendPath}`);
        const frontendUrl = `file://${frontendPath.replace(/\\/g, '/')}`;
        log(`Frontend URL: ${frontendUrl}`);
        mainWindow.loadURL(frontendUrl).catch(err => {
            log(`Failed to load frontend: ${err.message}`);
        });
    }

    // Always open DevTools to see frontend errors
    mainWindow.webContents.openDevTools();

    mainWindow.webContents.on('did-fail-load', () => {
        log('Frontend failed to load');
        mainWindow.webContents.openDevTools();
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// Wait for backend to be ready
async function waitForBackend(maxRetries = 30) {
    log('Waiting for backend to be ready...');
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch('http://localhost:3000/api/health').catch(() => null);
            if (response && response.ok) {
                log('Backend is ready!');
                return true;
            }
        } catch (error) {
            // Backend not ready yet
        }
        log(`Backend not ready yet, retry ${i + 1}/${maxRetries}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    log('Backend failed to start after 30 seconds');
    return false;
}

// App lifecycle
app.whenReady().then(async () => {
    log('App starting...');
    log(`App version: ${app.getVersion()}`);
    log(`Electron version: ${process.versions.electron}`);
    log(`Node version: ${process.versions.node}`);
    log(`Is packaged: ${app.isPackaged}`);
    log(`Resources path: ${process.resourcesPath}`);
    log(`App path: ${app.getAppPath()}`);
    log(`User data: ${app.getPath('userData')}`);

    // Start backend
    const backendStarted = startBackend();

    if (backendStarted) {
        // Wait for backend to be ready
        const isReady = await waitForBackend();

        if (!isReady) {
            log('Backend not ready, but showing window anyway');
            dialog.showMessageBox({
                type: 'warning',
                title: 'Advertencia',
                message: 'El backend tardó en iniciar. La aplicación puede no funcionar correctamente.',
                detail: 'Revisa el log en: ' + logFile
            });
        }
    } else {
        log('Backend failed to start, showing window anyway');
    }

    // Create window regardless of backend status
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('quit', () => {
    log('App quitting...');
    // Kill backend process
    if (backendProcess) {
        backendProcess.kill();
        log('Backend process killed');
    }
});

// Handle squirrel events (Windows installer)
if (require('electron-squirrel-startup')) {
    log('Squirrel startup event, quitting');
    app.quit();
}
