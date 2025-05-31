// Helper to boot, mount, and run code in WebContainers
import { WebContainer, WebContainerProcess } from '@webcontainer/api';

let webContainerInstance: WebContainer | null = null;
let currentServerProcess: WebContainerProcess | null = null; // Added to track the server process

export async function getWebContainerInstance(): Promise<WebContainer> {
  if (!webContainerInstance) {
    console.log('Booting WebContainer...');
    try {
      webContainerInstance = await WebContainer.boot();
      console.log('WebContainer booted successfully.');

      // Optional: Add basic error/close listeners for debugging
      webContainerInstance.on('error', (error) => {
        console.error('WebContainer error:', error.message);
      });
      webContainerInstance.on('port', (port, type, url) => {
        console.log(`WebContainer port ${port} event (${type}): ${url}`);
      });

    } catch (error: any) {
      console.error('Failed to boot WebContainer:', error.message);
      throw error; // Re-throw to allow caller to handle
    }
  }
  return webContainerInstance;
}

export interface WebContainerFile {
  name: string;
  contents: string;
}

export async function mountFiles(files: WebContainerFile[]): Promise<void> {
  const wcInstance = await getWebContainerInstance();
  console.log('Mounting files:', files.map(f => f.name).join(', '));
  try {
    for (const file of files) {
      const directoryPath = file.name.substring(0, file.name.lastIndexOf('/'));
      if (directoryPath) {
        // Ensure parent directory exists, fs.mkdir with recursive:true is idempotent
        await wcInstance.fs.mkdir(directoryPath, { recursive: true });
      }
      await wcInstance.fs.writeFile(file.name, file.contents, 'utf-8');
      console.log(`File "${file.name}" mounted.`);
    }
    console.log('All files mounted successfully.');
  } catch (error: any) {
    console.error('Failed to mount files in WebContainer:', error.message);
    throw error;
  }
}

export async function startDevServer(): Promise<string> {
  const wcInstance = await getWebContainerInstance();
  console.log('Starting dev server...');

  if (currentServerProcess) {
    console.log('Attempting to kill existing http-server process...');
    const oldProcess = currentServerProcess;
    currentServerProcess = null; // Clear immediately
    try {
      oldProcess.kill();
      console.log('Previous http-server process kill signal sent. Waiting for exit...');
      // Wait for the old process to exit, with a timeout
      await Promise.race([
        oldProcess.exit,
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout waiting for old server process to exit.')), 5000))
      ]);
      console.log('Previous http-server process confirmed exited or timed out.');
    } catch (e: any) {
      console.warn('Error during previous server process shutdown (kill or exit wait):', e.message);
    }
  }

  try {
    console.log('Spawning http-server process using npx...');
    const serverProcess = await wcInstance.spawn('npx', ['--yes', 'http-server', '.', '-p', '8080', '--cors']);
    currentServerProcess = serverProcess;

    serverProcess.output.pipeTo(new WritableStream({
      write(data) {
        console.log('[http-server]:', data);
      }
    }));

    return new Promise<string>((resolve, reject) => {
      let resolvedOrRejected = false;
      let disposeServerReadyListener: (() => void) | null = null;

      const onServerReadyCallback = (port: number, url: string) => {
        if (resolvedOrRejected) return;
        if (port === 8080 && serverProcess === currentServerProcess) {
          resolvedOrRejected = true;
          cleanup();
          console.log(`Server ready on port ${port} at URL: ${url}`);
          if (url) {
            resolve(url);
          } else {
            reject(new Error('Server ready event triggered, but URL is empty.'));
          }
        }
      };

      const onProcessExit = (code: number | string) => {
        if (resolvedOrRejected) return;
        if (serverProcess === currentServerProcess) { // Ensure it's the current process exiting
          resolvedOrRejected = true;
          cleanup();
          currentServerProcess = null; 
          const message = `http-server process exited with code ${code}.`;
          console.error(message);
          if (code !== 0) {
            reject(new Error(`${message} Check console for [http-server] logs.`));
          } else {
            // If it exited cleanly (code 0) but 'server-ready' didn't fire, it's still an issue.
            reject(new Error(`${message} Server did not become ready.`)); 
          }
        }
      };

      const onProcessExitError = (err: any) => {
        if (resolvedOrRejected) return;
        if (serverProcess === currentServerProcess) {
          resolvedOrRejected = true;
          cleanup();
          currentServerProcess = null;
          console.error('Error with http-server process (exit promise catch):', err);
          reject(err);
        }
      };

      const serverReadinessTimeoutId = setTimeout(() => {
        if (resolvedOrRejected) return;
        resolvedOrRejected = true;
        cleanup();
        // Check if currentServerProcess is still this serverProcess before trying to kill it
        if (serverProcess === currentServerProcess) {
            console.warn('Server readiness timeout. Attempting to kill unresponsive server process...');
            serverProcess.kill(); // Attempt to kill the timed-out process
            currentServerProcess = null;
        }
        reject(new Error('Server readiness timeout after 30 seconds.'));
      }, 30000);

      const cleanup = () => {
        clearTimeout(serverReadinessTimeoutId);
        if (disposeServerReadyListener) {
          disposeServerReadyListener();
          disposeServerReadyListener = null;
        }
        // Note: We can't directly remove .exit listeners from a WebContainerProcess.
        // The resolvedOrRejected flag and currentServerProcess check handle preventing stale actions.
      };

      disposeServerReadyListener = wcInstance.on('server-ready', onServerReadyCallback);
      serverProcess.exit.then(onProcessExit).catch(onProcessExitError);
    });
  } catch (error: any) {
    console.error('Failed to spawn or manage dev server:', error.message);
    if (currentServerProcess && (error as any).process === currentServerProcess) {
        currentServerProcess = null;
    }
    throw error;
  }
}
