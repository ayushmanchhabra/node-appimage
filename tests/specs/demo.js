import fs from 'node:fs';

import createAppImage from "../../main.js";

await createAppImage({
    appName: 'demo',
    outDir: './tests/fixtures',
    appImagePath: './tests/fixtures/appimagetool.AppImage',
    srcMap: {
        './tests/fixtures/AppRun': '/AppRun',
        './tests/fixtures/demo': '/usr/bin/demo',
        './tests/fixtures/demo.desktop': '/demo.desktop',
        './tests/fixtures/demo.png': '/demo.png',
    }
});

await fs.promises.rm('./tests/fixtures/demo.AppDir', { recursive: true });