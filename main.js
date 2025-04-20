import fs from 'node:fs';
import path from 'node:path';

/**
 * 
 * @param {object} options
 * @param {string} options.appName 
 */
async function appImage({
    appName,
    outDir,
}) {
    throw new Error('Not implemented');
}

/**
 * Creates a directory for the AppDir.
 * @param {*} appName - Name of the application
 * @param {*} outDir - Output directory for the AppDir
 * @returns {Promise<string>} - Absolute file path of AppDir directory
 * @throws {Error} If the AppDir already exists
 */
export async function createAppDirFolder(appName, outDir) {
    /**
     * @type {string}
     */
    const appDir = path.resolve(outDir, `${appName}.AppDir`);

    if (fs.existsSync(appDir)) {
        throw new Error(`AppDir at file path ${appDir} already exists.`);
    } else {
        await fs.promises.mkdir(appDir, { recursive: true });
    }

    return appDir;
}

export async function createAppRunScript(appDir, appRunScript = '') {
    const appRunPath = path.resolve(appDir, 'AppRun');

    if (appRunScript === '') {
        appRunScript = `#!/bin/sh
HERE="$(dirname "$(readlink -f "\${0}")")"
export PATH="\${HERE}/usr/bin:\${PATH}"
exec test "$@"`;
    }
    await fs.promises.writeFile(appRunPath, appRunScript);
}

export default appImage;

