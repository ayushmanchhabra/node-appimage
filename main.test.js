import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { afterEach, describe, it } from 'node:test';

import createAppImAge, { createAppDirFolder, createAppRunScript, placeFile, createDesktopFile, downloadAppImageTool } from './main.js';

describe('AppImage test suite', function () {

    it('creates an {appName}.AppDir', async function () {
        await createAppDirFolder('demo', '.');
        assert.strictEqual(fs.existsSync('./demo.AppDir'), true);
    });

    it('throws error if {appName}.AppDir exists', async function () {
        await fs.promises.mkdir('./demo.AppDir', { recursive: true });
        assert.rejects(
            createAppDirFolder('demo', '.'),
            new Error(`AppDir at file path ${path.resolve('./demo.AppDir')} already exists.`),
        );
    })

    it('creates an AppRun script', async function () {
        await fs.promises.mkdir('./demo.AppDir', { recursive: true });
        await createAppRunScript('./demo.AppDir', '');
        assert.strictEqual(fs.existsSync('./demo.AppDir/AppRun'), true);
    });

    it('places the binary file into {appName}.AppDir directory', async function () {
        await fs.promises.mkdir('./demo.AppDir', { recursive: true });
        await placeFile('./demo.AppDir', './demo', '/usr/bin/demo');
        assert.strictEqual(fs.existsSync('./demo.AppDir/usr/bin/demo'), true);
    });

    it('creates desktop file', async function () {
        await fs.promises.mkdir('./demo.AppDir', { recursive: true });
        await createDesktopFile('./demo.AppDir', {
            Type: 'Application',
            Name: 'Test',
            Comment: 'Test application',
            Exec: 'demo',
            Icon: 'demo',
            Categories: ['Utility'],
        });
        assert.strictEqual(fs.existsSync('./demo.AppDir/Test.desktop'), true);
    });

    it('downloads appimagetool from GitHub', async function () {
        await downloadAppImageTool('./appimagetool.AppImage');
        assert.strictEqual(fs.existsSync('./appimagetool.AppImage'), true);
    });

    it('creates an {appName}.AppImage', async function () {
        await createAppImAge({
            appName: 'demo',
            outDir: '.',
            srcPath: './demo',
            iconPath: './demo.png',
            outPath: '/usr/bin/demo',
            iconOutPath: '/demo.png',
            desktopConfig: {
                Type: 'Application',
                Name: 'demo',
                Comment: 'Demo application',
                Exec: 'demo',
                Icon: 'demo',
                Categories: ['Utility'],
            },
        });

        assert.strictEqual(fs.existsSync('./demo-x86_64.AppImage'), true);
    });

    afterEach(async function () {
        // Clean up the test fixture test.AppDir directory after every test
        await fs.promises.rm('./demo.AppDir', { recursive: true, force: true });
    });
});
