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
 * @param {string} appName - Name of the application
 * @param {string} outDir - Output directory for the AppDir
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

/**
 * Create AppRun script.
 * @param {string} appDir - Absolute file path of AppDir directory
 * @param {string} appRunScript - AppRun script content
 * @returns {Promise<void>} - Resolves when the AppRun script is created
 */
export async function createAppRunScript(appDir, appRunScript = '') {
    /**
     * @type {string}
     */
    const appRunPath = path.resolve(appDir, 'AppRun');

    if (appRunScript === '') {
        appRunScript = `#!/bin/sh
HERE="$(dirname "$(readlink -f "\${0}")")"
export PATH="\${HERE}/usr/bin:\${PATH}"
exec test "$@"`;
    }

    await fs.promises.writeFile(appRunPath, appRunScript);
}

/**
 * 
 * @param {string} appDir - Absolute file path of AppDir directory
 * @param {string} srcPath - File path to binary
 * @param {string} outPath - Filepath to place the binary
 * @returns {Promise<void>} - Resolves when the file is placed
 */
export async function placeFile(appDir, srcPath, outPath = '/usr/bin') {

    /**
     * @type {string}
     */
    const dirPath = path.resolve(appDir, path.dirname('.' + outPath));

    await fs.promises.mkdir(dirPath, { recursive: true });

    await fs.promises.copyFile(path.resolve(srcPath), path.resolve(appDir, '.' + outPath));

}

export default appImage;

