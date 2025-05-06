import fs from 'node:fs';

import createAppImage from "../../main.js";

await createAppImage({
    appName: 'demo',
    outDir: './tests/fixtures',
    srcPath: './tests/fixtures/demo',
    iconPath: './tests/fixtures/demo.png',
    outPath: '/usr/bin/demo',
    iconOutPath: '/demo.png',
    srcMap: {
        './tests/fixtures/demo.desktop': '/demo.desktop',
    }
});

await fs.promises.rm('./tests/fixtures/demo.AppDir', { recursive: true });