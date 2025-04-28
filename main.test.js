import assert from 'node:assert';
import fs from 'node:fs';
import { afterEach, describe, it } from 'node:test';

import createAppImAge, { createAppDirFolder, placeFile, downloadAppImageTool } from './main.js';

describe('AppImage test suite', function () {

    it('creates an {appName}.AppDir', async function () {
        await createAppDirFolder('demo', './test');
        assert.strictEqual(fs.existsSync('./test/demo.AppDir'), true);
    });

    it('places the binary file into {appName}.AppDir directory', async function () {
        await fs.promises.mkdir('./test/demo.AppDir', { recursive: true });
        await placeFile('./test/demo.AppDir', './test/demo', '/usr/bin/demo');
        assert.strictEqual(fs.existsSync('./test/demo.AppDir/usr/bin/demo'), true);
    });

    it('downloads appimagetool from GitHub', async function () {
        await downloadAppImageTool('./appimagetool.AppImage');
        assert.strictEqual(fs.existsSync('./appimagetool.AppImage'), true);
    });

    it('creates an {appName}.AppImage', async function () {
        await createAppImAge({
            appName: 'demo',
            outDir: './test',
            srcMap: [
                { './test/AppRun': '/AppRun' },
                { './test/demo.desktop': '/demo.desktop' },
                { './test/demo': '/usr/bin/demo' },
                { './test/demo.png': '/demo.png' },
            ],
        });

        assert.strictEqual(fs.existsSync('./test/demo.AppImage'), true);
    });

    afterEach(async function () {
        // Clean up the test fixture test.AppDir directory after every test
        // await fs.promises.rm('./test/demo.AppDir', { recursive: true, force: true });
    });
});
