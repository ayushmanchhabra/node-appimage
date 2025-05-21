import child_process from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import stream from 'node:stream';

import axios from 'axios';

/**
 * Creates an AppImage for a given application.
 * @param {object} options
 * @param {string} options.appName - Name of the application
 * @param {string} options.outDir - Output directory for the AppDir
 * @param {string} options.appImagePath - Path to the AppImage tool
 * @param {{[key: string]: string}} options.srcMap - Map of destination paths to source files in the AppDir
 * @returns {Promise<void>} - Resolves when the AppImage is created at `${outDir}/${appName}.AppImage`
 */
export default async function createAppImage({
    appName,
    outDir,
    appImagePath,
    srcMap = {},
}) {
    const appDir = await createAppDirFolder(appName, outDir);
    for (const [dest, src] of Object.entries(srcMap)) {
        await placeFile(appDir, src, dest);
    }
    const appImageToolPath = path.resolve(appImagePath)
    await downloadAppImageTool(appImageToolPath);
    await fs.promises.chmod(appImageToolPath, 0o755);
    child_process.execFileSync(appImageToolPath, [appDir, path.resolve(outDir, `${appName}.AppImage`)]);
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
 * Place a file in the AppDir.
 * @param {string} appDir - The AppDir directory
 * @param {string} src - The source file path
 * @param {string} dest - The destination file path relative to the AppDir
 * @returns {Promise<void>} - Resolves when the file is placed
 * @throws {Error} If the source file does not exist
 */
export async function placeFile(appDir, src, dest) {
    if (!fs.existsSync(src)) {
        throw new Error(`Source file ${src} does not exist.`);
    }
    const srcFilePath = path.resolve(src);
    const destFilePath = path.resolve(appDir, '.' + dest);
    await fs.promises.mkdir(path.dirname(destFilePath), { recursive: true });
    await fs.promises.copyFile(srcFilePath, destFilePath);
    await fs.promises.chmod(destFilePath, 0o755);
}

/**
 * Download the AppImage tool if it doesn't exist.
 * @param {string} filePath - The file path to cache the AppImage tool at
 * @returns {Promise<void | 1>} - Resolves when the AppImage tool is downloaded and cached
 */
export async function downloadAppImageTool(filePath) {

    if (fs.existsSync(filePath)) {
        return 1;
    }

    let apiResponse = await axios({
        method: 'get',
        url: 'https://api.github.com/repos/appimage/appimagetool/releases',
        responseType: 'json'
    });

    let url = `https://github.com/AppImage/appimagetool/releases/download/${apiResponse.data[0].tag_name}/appimagetool-${process.arch === 'x64' ? 'x86_64' : 'i686'}.AppImage`

    const writeStream = fs.createWriteStream(filePath);

    const response = await axios({
        method: 'get',
        url: url,
        responseType: 'stream'
    });

    await stream.promises.pipeline(response.data, writeStream);
}
