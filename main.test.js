import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { afterEach, describe, it } from 'node:test';

import { createAppDirFolder, createAppRunScript } from './main.js';

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

    afterEach(async function () {
        // Clean up the test fixture test.AppDir directory after every test
        await fs.promises.rm('./test.AppDir', { recursive: true, force: true });
    });
});
