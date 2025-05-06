# appimage

A Node.js implementation of the packaging executables as AppImage.

## Getting Started

```js
import createAppImage from "appimage";

await createAppImage({
    appName: 'demo',
    outDir: '/path/to/outdir',
    appImagePath: '/path/to/cached/appimagefile',
    srcMap: {
        './path/to/AppRun': '/AppRun',
        './path/to/demo': '/usr/bin/demo',
        './path/to/demo.desktop': '/demo.desktop',
        './path/to/demo.png': '/demo.png',
    }
});
```

There is a demo AppImage inside the repo. To assemble it, clone the repo, run `npm run prep`, `npm run demo` and execute the AppImage at `./tests/fixtures/demo.AppImage`

## LICENSE

MIT
