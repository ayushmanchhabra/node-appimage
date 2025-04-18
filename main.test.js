import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { afterEach, describe, it } from 'node:test';

import { createAppDirFolder } from './main.js';

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

    afterEach(async function () {
        // Clean up the test directory after `creates an {appName}.AppDir` test
        await fs.promises.rm('./test.AppDir', { recursive: true, force: true });
    });
});
