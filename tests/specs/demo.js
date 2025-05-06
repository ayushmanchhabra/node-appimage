import fs from 'node:fs';

import createAppImage from "../../main.js";

await createAppImage({
    appName: 'demo',
    outDir: './tests/fixtures',
    iconPath: './tests/fixtures/demo.png',
    iconOutPath: '/demo.png',
    srcMap: {
        './tests/fixtures/demo': '/usr/bin/demo',
        './tests/fixtures/demo.desktop': '/demo.desktop',
    }
});

await fs.promises.rm('./tests/fixtures/demo.AppDir', { recursive: true });