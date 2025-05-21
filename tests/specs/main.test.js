import assert from 'node:assert';
import child_process from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { afterEach, describe, it } from 'node:test';

import createAppImage, { createAppDirFolder, downloadAppImageTool, placeFile } from '../../main.js';

describe('AppImage test suite', function () {

    it('creates an {appName}.AppDir', async function () {
        await createAppDirFolder('demo', './tests/fixtures');
        assert.strictEqual(fs.existsSync('./tests/fixtures/demo.AppDir'), true);
    });

    it('throws error if {appName}.AppDir exists', async function () {
        await fs.promises.mkdir('./tests/fixtures/demo.AppDir', { recursive: true });
        assert.rejects(
            createAppDirFolder('demo', './tests/fixtures'),
            new Error(`AppDir at file path ${path.resolve('./tests/fixtures/demo.AppDir')} already exists.`),
        );
    })

    it('places the binary file into {appName}.AppDir directory', async function () {
        await fs.promises.mkdir('./tests/fixtures/demo.AppDir', { recursive: true });
        await placeFile('./tests/fixtures/demo.AppDir', './tests/fixtures/demo', '/usr/bin/demo');
        assert.strictEqual(fs.existsSync('./tests/fixtures/demo.AppDir/usr/bin/demo'), true);
    });

    it('throws error if source file does not exist', async function () {
        await fs.promises.mkdir('./tests/fixtures/demo.AppDir', { recursive: true });
        assert.rejects(
            placeFile('./tests/fixtures/demo.AppDir', './tests/fixtures/nonexistentfile', '/usr/bin/demo'),
            new Error(`Source file ./tests/fixtures/nonexistentfile does not exist.`),
        );
    });

    it('downloads appimagetool from GitHub', async function () {
        await downloadAppImageTool('./tests/fixtures/appimagetool.AppImage');
        assert.strictEqual(fs.existsSync('./tests/fixtures/appimagetool.AppImage'), true);
    });

    it('returns if the appimagetool is already downloaded', async function () {
        await fs.promises.mkdir('./tests/fixtures', { recursive: true });
        await fs.promises.writeFile('./tests/fixtures/appimagetool.AppImage', 'dummy content');
        assert.strictEqual(await downloadAppImageTool('./tests/fixtures/appimagetool.AppImage'), 1);
    });

    it('creates an {appName}.AppImage and executes it correctly', async function () {
        await createAppImage({
            appName: 'demo',
            outDir: './tests/fixtures',
            appImagePath: './tests/fixtures/appimagetool.AppImage',
            srcMap: {
                '/AppRun': './tests/fixtures/AppRun',
                '/usr/bin/demo': './tests/fixtures/demo',
                '/demo.desktop': './tests/fixtures/demo.desktop',
                '/demo.png': './tests/fixtures/demo.png',
            }
        });

        assert.strictEqual(fs.existsSync('./tests/fixtures/demo.AppImage'), true);
        assert.strictEqual(child_process.execSync('./tests/fixtures/demo.AppImage').toString(), 'Hello, World!\n');
    });

    afterEach(async function () {
        // Clean up the test fixture test.AppDir directory after every test
        await fs.promises.rm('./tests/fixtures/demo.AppDir', { recursive: true, force: true });
        await fs.promises.rm('./tests/fixtures/appimagetool.AppImage', { recursive: true, force: true });
    });
});
