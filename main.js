import fs from 'node:fs';
import path from 'node:path';
import child_process from 'node:child_process';
import stream from 'node:stream';

import axios from 'axios';

/**
 * 
 * @param {object} options
 * @param {string} options.appName
 * @param {string} options.outDir
 * @param {string} options.srcPath
 * @param {string} options.outPath
 * @param {{[key: string]: string}} options.srcMap
 * @returns {Promise<void>} - Resolves when the AppImage is created
 */
export default async function createAppImage({
    appName,
    outDir,
    srcPath,
    iconPath,
    outPath,
    iconOutPath,
    srcMap = {},
}) {
    const appDir = await createAppDirFolder(appName, outDir);
    for (const [src, dest] of Object.entries(srcMap)) {
        console.log(`Copying ${src} to ${dest}`);
        const srcFilePath = path.resolve(src);
        const destFilePath = path.resolve(appDir, '.' + dest);
        await fs.promises.mkdir(path.dirname(destFilePath), { recursive: true });
        await fs.promises.copyFile(srcFilePath, destFilePath);
        await fs.promises.chmod(destFilePath, 0o755);
    }
    await createAppRunScript(appDir);
    await placeFile(appDir, srcPath, outPath);
    await placeFile(appDir, iconPath, iconOutPath);
    const appImageToolPath = path.resolve(appDir, 'appimagetool.AppImage')
    if (!fs.existsSync(appImageToolPath)) {
        await downloadAppImageTool(appImageToolPath);
    }
    await fs.promises.chmod(appImageToolPath, 0o755);
    child_process.execSync(`${appImageToolPath} ${appDir}`);
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
exec demo "$@"`;
    }

    await fs.promises.writeFile(appRunPath, appRunScript);
    await fs.promises.chmod(appRunPath, 0o755);
}

/**
 * 
 * @param {string} appDir - Absolute file path of AppDir directory
 * @param {string} srcPath - File path to binary
 * @param {string} outPath - Filepath to place the binary
 * @returns {Promise<void>} - Resolves when the file is placed
 */
export async function placeFile(appDir, srcPath, outPath) {

    /**
     * @type {string}
     */
    const dirPath = path.resolve(appDir, path.dirname('.' + outPath));

    await fs.promises.mkdir(dirPath, { recursive: true });
    await fs.promises.copyFile(path.resolve(srcPath), path.resolve(appDir, '.' + outPath));

}

export async function downloadAppImageTool(filePath) {
   
    let apiResponse = await axios({
        method: 'get',
        url: 'https://api.github.com/repos/appimage/appimagetool/releases',
        responseType: 'json'
    });
    
    let url = `https://github.com/AppImage/appimagetool/releases/download/${apiResponse.data[0].tag_name}/appimagetool-${process.arch === 'x64' ? 'x86_64': 'i686'}.AppImage`

    const writeStream = fs.createWriteStream(filePath);

    const response = await axios({
        method: 'get',
        url: url,
        responseType: 'stream'
    });

    await stream.promises.pipeline(response.data, writeStream);
}
