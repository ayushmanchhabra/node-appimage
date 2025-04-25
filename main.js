import fs from 'node:fs';
import path from 'node:path';
import child_process from 'node:child_process';
import stream from 'node:stream';

import axios from 'axios';

/**
 * 
 * @param {object} options
 * @param {string} options.srcMap
 * @param {string} options.outDir
 * @param {{[key: string]: string}[]} options.files
 * @returns {Promise<void>} - Resolves when the AppImage is created
 */
export default async function createAppImage({
    appName,
    srcMap,
    outDir,
}) {
    const appDir = await createAppDirFolder(appName, outDir);
    
    for (const file of srcMap) {
        for (const [src, out] of Object.entries(file)) {
            await placeFile(appDir, src, out);
        }
    }
    const appImageToolPath = path.resolve('./appimagetool.AppImage')
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

    await fs.promises.mkdir(appDir, { recursive: true });

    return appDir;
}

/**
 * 
 * @param {string} appDir - Absolute file path of AppDir directory
 * @param {string} srcPath - File path to binary
 * @param {string} outPath - Filepath to place the binary
 * @returns {Promise<void>} - Resolves when the file is placed
 */
export async function placeFile(appDir, srcPath, outPath) {

    if (outPath.startsWith('/')) {
        outPath = outPath.substring(1);
    }

    /**
     * @type {string}
     */
    const dirPath = path.resolve(appDir, path.dirname(outPath));

    await fs.promises.mkdir(dirPath, { recursive: true });
    await fs.promises.cp(path.resolve(srcPath), path.resolve(appDir, outPath));
    await fs.promises.chmod(path.resolve(appDir, outPath), 0o755);

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
