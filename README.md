# appimage

[![npm](https://img.shields.io/npm/v/appimage/latest)](https://www.npmjs.com/package/appimage/v/latest)

A Node.js implementation of packaging a Linux binary as an AppImage.

## Getting Started

```js
import createAppImage from "appimage";

await createAppImage({
    appName: 'demo',
    outDir: './path/to/outdir',
    // If AppImage is not cached, it is downloaded to below path
    appImagePath: './path/to/cached/appimagefile',
    srcMap: {
        '/AppRun': './path/to/AppRun',
        '/usr/bin/demo': './path/to/demo',
        '/demo.desktop': './path/to/demo.desktop',
        '/demo.png': './path/to/demo.png',
    }
});
```

There is a demo AppImage inside the repo. To assemble it, clone the repo, run `npm run prep`, `npm run demo` and execute the AppImage at `./tests/fixtures/demo.AppImage`

## Contributing

This project is in its early stages, expect bugs. File an issue or pull request accordingly.

## LICENSE

MIT
