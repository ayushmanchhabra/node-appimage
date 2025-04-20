import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { afterEach, describe, it } from 'node:test';

import createAppImAge, { createAppDirFolder, createAppRunScript, placeFile, createDesktopFile, downloadAppImageTool } from './main.js';

describe('AppImage test suite', function () {

    it('creates an {appName}.AppDir', async function () {
        await createAppDirFolder('test', '.');
        assert.strictEqual(fs.existsSync('./test.AppDir'), true);
    });

    it('throws error if {appName}.AppDir exists', async function () {
        await fs.promises.mkdir('./test.AppDir', { recursive: true });
        assert.rejects(
            createAppDirFolder('test', '.'),
            new Error(`AppDir at file path ${path.resolve('./test.AppDir')} already exists.`),
        );
    })

    it('creates an AppRun script', async function () {
        await fs.promises.mkdir('./test.AppDir', { recursive: true });
        await createAppRunScript('./test.AppDir', '');
        assert.strictEqual(fs.existsSync('./test.AppDir/AppRun'), true);
    });

    it('places the binary file into {appName}.AppDir directory', async function () {
        await fs.promises.mkdir('./test.AppDir', { recursive: true });
        await placeFile('./test.AppDir', './test', '/usr/bin/test');
        assert.strictEqual(fs.existsSync('./test.AppDir/usr/bin/test'), true);
    });

    it('creates desktop file', async function () {
        await fs.promises.mkdir('./test.AppDir', { recursive: true });
        await createDesktopFile('./test.AppDir', {
            Type: 'Application',
            Name: 'Test',
            Comment: 'Test application',
            Exec: 'test',
            Icon: 'test',
            Categories: ['Utility'],
        });
        assert.strictEqual(fs.existsSync('./test.AppDir/Test.desktop'), true);
    });

    it('downloads appimagetool from GitHub', async function () {
        await downloadAppImageTool('./appimagetool.AppImage');
        assert.strictEqual(fs.existsSync('./appimagetool.AppImage'), true);
    });

    it('creates an {appName}.AppImage', async function () {
        await createAppImAge({
            appName: 'test',
            outDir: '.',
            srcPath: './test',
            iconPath: './test.png',
            outPath: '/usr/bin/test',
            iconOutPath: '/test.png',
            desktopConfig: {
                Type: 'Application',
                Name: 'Test',
                Comment: 'Test application',
                Exec: 'test',
                Icon: 'test',
                Categories: ['Utility'],
            },
        });

        assert.strictEqual(fs.existsSync('./Test-x86_64.AppImage'), true);
    });

    afterEach(async function () {
        // Clean up the test fixture test.AppDir directory after every test
        await fs.promises.rm('./test.AppDir', { recursive: true, force: true });
    });
});
